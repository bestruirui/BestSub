#!/bin/bash

# Exit on any error, but handle errors gracefully
set -e

# Enable error trapping
trap 'handle_error $? $LINENO' ERR

# =============================================================================
# Configuration
# =============================================================================

# Project configuration
readonly APP_NAME="bestsub"
readonly MAIN_DIR="./cmd/bestsub"
readonly OUTPUT_DIR="build"
readonly TOOLCHAIN_DIR="$HOME/.bestsub/toolchains"

# Build metadata
readonly BUILD_TIME="$(TZ='Asia/Shanghai' date +'%F %T %z')"
readonly GIT_AUTHOR="bestrui"
readonly GIT_VERSION="$(git describe --tags --abbrev=0 2>/dev/null || echo 'dev')"
readonly COMMIT_ID="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"

# Build flags
readonly LDFLAGS="-X 'github.com/bestruirui/bestsub/internal/utils/info.Version=${GIT_VERSION}' \
                  -X 'github.com/bestruirui/bestsub/internal/utils/info.BuildTime=${BUILD_TIME}' \
                  -X 'github.com/bestruirui/bestsub/internal/utils/info.Author=${GIT_AUTHOR}' \
                  -X 'github.com/bestruirui/bestsub/internal/utils/info.Commit=${COMMIT_ID}' \
                  -s -w"

# Android NDK configuration
readonly ANDROID_NDK_VERSION="r27c"
readonly ANDROID_NDK_BASE="https://dl.google.com/android/repository/"
readonly ANDROID_NDK_PATH="${TOOLCHAIN_DIR}/android-ndk/android-ndk-${ANDROID_NDK_VERSION}/toolchains/llvm/prebuilt/linux-x86_64/bin"

# =============================================================================
# Utility Functions
# =============================================================================

log_info() {
    echo "ℹ️  $1"
}

log_success() {
    echo "✅ $1"
}

log_error() {
    echo "❌ $1" >&2
}

log_warning() {
    echo "⚠️  $1" >&2
}

log_step() {
    echo ""
    echo "🔧 $1"
    echo "────────────────────────────────────────"
}

# Error handling function
handle_error() {
    local exit_code=$1
    local line_number=$2
    log_error "Build failed at line ${line_number} with exit code ${exit_code}"
    log_error "Command that failed: $(sed -n "${line_number}p" "$0" | xargs)"
    log_error "Check the output above for more details"
    exit $exit_code
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install command if not exists (Linux/macOS)
install_command() {
    local cmd="$1"
    local package="$2"

    if command_exists "$cmd"; then
        log_info "$cmd is already installed"
        return 0
    fi

    log_info "Installing $cmd..."

    # Detect OS and package manager
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command_exists apt-get; then
            sudo apt-get update >/dev/null 2>&1 || {
                log_error "Failed to update package list"
                return 1
            }
            sudo apt-get install -y "$package" >/dev/null 2>&1 || {
                log_error "Failed to install $package using apt-get"
                return 1
            }
        elif command_exists yum; then
            sudo yum install -y "$package" >/dev/null 2>&1 || {
                log_error "Failed to install $package using yum"
                return 1
            }
        elif command_exists dnf; then
            sudo dnf install -y "$package" >/dev/null 2>&1 || {
                log_error "Failed to install $package using dnf"
                return 1
            }
        elif command_exists pacman; then
            sudo pacman -S --noconfirm "$package" >/dev/null 2>&1 || {
                log_error "Failed to install $package using pacman"
                return 1
            }
        else
            log_error "No supported package manager found. Please install $cmd manually"
            return 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists brew; then
            brew install "$package" >/dev/null 2>&1 || {
                log_error "Failed to install $package using brew"
                return 1
            }
        else
            log_error "Homebrew not found. Please install $cmd manually or install Homebrew first"
            return 1
        fi
    else
        log_error "Unsupported OS: $OSTYPE. Please install $cmd manually"
        return 1
    fi

    log_success "$cmd installed successfully"
}

# =============================================================================
# Setup Functions
# =============================================================================

prepare_environment() {
    log_step "Preparing build environment"

    # Check and install required commands
    log_info "Checking required commands..."

    # Check Go
    if ! command_exists go; then
        log_error "Go is not installed. Please install Go from https://golang.org/dl/"
        return 1
    fi

    local go_version=$(go version 2>/dev/null | grep -o 'go[0-9]\+\.[0-9]\+' | head -1)
    log_success "Go version: $go_version"

    # Check git
    if ! command_exists git; then
        install_command git git || return 1
    fi

    # Check curl
    if ! command_exists curl; then
        install_command curl curl || return 1
    fi

    # Check unzip
    if ! command_exists unzip; then
        install_command unzip unzip || return 1
    fi

    # Check tar
    if ! command_exists tar; then
        install_command tar tar || return 1
    fi

    # Check zip
    if ! command_exists zip; then
        install_command zip zip || return 1
    fi

    # Check md5sum (or md5 on macOS)
    if ! command_exists md5sum && ! command_exists md5; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            log_warning "md5sum not found, but md5 is available on macOS"
        else
            install_command md5sum coreutils || return 1
        fi
    fi

    log_success "All required commands installed"

    # Create output directory and subdirectories
    log_info "Creating output directory structure: ${OUTPUT_DIR}"

    # Check if OUTPUT_DIR exists (including symlinks)
    if [ -e "${OUTPUT_DIR}" ]; then
        if [ -d "${OUTPUT_DIR}" ]; then
            log_success "Output directory already exists: ${OUTPUT_DIR}"
        else
            log_error "Output path exists but is not a directory: ${OUTPUT_DIR}"
            log_error "Path type: $(ls -la "${OUTPUT_DIR}" 2>/dev/null || echo 'Cannot determine type')"
            return 1
        fi
    else
        # Try to create the directory
        if ! mkdir -p "${OUTPUT_DIR}"; then
            log_error "Failed to create output directory: ${OUTPUT_DIR}"
            log_error "Current working directory: $(pwd)"
            log_error "Directory permissions: $(ls -la . 2>/dev/null || echo 'Cannot list directory')"
            return 1
        fi
        log_success "Created output directory: ${OUTPUT_DIR}"
    fi

    # Create subdirectories for organized output
    local subdirs=("bin" "docker" "archives")
    for subdir in "${subdirs[@]}"; do
        if ! mkdir -p "${OUTPUT_DIR}/${subdir}"; then
            log_error "Failed to create subdirectory: ${OUTPUT_DIR}/${subdir}"
            return 1
        fi
    done
    log_success "Created output subdirectories: bin, docker, archives"

    log_info "Tidying Go modules..."
    if ! go mod tidy >/dev/null 2>&1; then
        log_error "Failed to tidy Go modules"
        return 1
    fi

    log_success "Build environment ready"
}

setup_android_ndk() {
    log_step "Setting up Android NDK"

    if [ -d "${TOOLCHAIN_DIR}/android-ndk" ]; then
        log_success "Android NDK ${ANDROID_NDK_VERSION} already installed"
        return 0
    fi

    local ndk_zip="/tmp/android-ndk-${ANDROID_NDK_VERSION}.zip"
    local ndk_url="${ANDROID_NDK_BASE}android-ndk-${ANDROID_NDK_VERSION}-linux.zip"

    log_info "Downloading Android NDK ${ANDROID_NDK_VERSION}..."
    if ! curl -L -o "${ndk_zip}" "${ndk_url}" >/dev/null 2>&1; then
        log_error "Failed to download Android NDK from ${ndk_url}"
        return 1
    fi

    log_info "Extracting Android NDK..."
    if ! mkdir -p "${TOOLCHAIN_DIR}/android-ndk"; then
        log_error "Failed to create NDK directory: ${TOOLCHAIN_DIR}/android-ndk"
        log_error "Toolchain directory: ${TOOLCHAIN_DIR}"
        log_error "Home directory permissions: $(ls -la "$HOME" 2>/dev/null | head -5 || echo 'Cannot list home directory')"
        return 1
    fi

    if ! unzip -q "${ndk_zip}" -d "${TOOLCHAIN_DIR}/android-ndk" 2>/dev/null; then
        log_error "Failed to extract Android NDK"
        rm -f "${ndk_zip}"
        return 1
    fi

    rm -f "${ndk_zip}"

    log_success "Android NDK ${ANDROID_NDK_VERSION} installed"
}

# =============================================================================
# Build Functions
# =============================================================================

get_go_arch() {
    case "$1" in
    "x86_64") echo "amd64" ;;
    "arm64") echo "arm64" ;;
    "x86") echo "386" ;;
    "armv7") echo "arm" ;;
    *)
        log_error "Unsupported architecture: $1"
        return 1
        ;;
    esac
}

build_standard() {
    local os="$1"
    local arch="$2"
    local go_arch

    if ! go_arch="$(get_go_arch "${arch}")"; then
        log_error "Failed to get Go architecture: ${arch}"
        return 1
    fi

    local output_file="${OUTPUT_DIR}/bin/${APP_NAME}-${os}-${arch}"

    log_info "Building ${os}/${arch}..."

    if ! GOOS="${os}" GOARCH="${go_arch}" CGO_ENABLED=0 \
        go build -o "${output_file}" -ldflags="${LDFLAGS}" -tags=jsoniter "${MAIN_DIR}" 2>&1; then
        log_error "Failed to build ${os}/${arch}"
        log_error "Build command: GOOS=${os} GOARCH=${go_arch} CGO_ENABLED=0 go build -o ${output_file} -ldflags=\"${LDFLAGS}\" -tags=jsoniter ${MAIN_DIR}"
        return 1
    fi

    if [ ! -f "${output_file}" ]; then
        log_error "Build completed but output file not found: ${output_file}"
        return 1
    fi

    log_success "Built ${os}/${arch} → bin/$(basename "${output_file}")"
}

get_android_compiler() {
    case "$1" in
    "x86_64") echo "x86_64-linux-android24-clang" ;;
    "arm64") echo "aarch64-linux-android24-clang" ;;
    "armv7") echo "armv7a-linux-androideabi24-clang" ;;
    "x86") echo "i686-linux-android24-clang" ;;
    *)
        log_error "Unsupported Android architecture: $1"
        return 1
        ;;
    esac
}

build_android() {
    local arch="$1"
    local go_arch
    local compiler

    if ! go_arch="$(get_go_arch "${arch}")"; then
        log_error "Failed to normalize architecture: ${arch}"
        return 1
    fi

    if ! compiler="$(get_android_compiler "${arch}")"; then
        log_error "Failed to get Android compiler for architecture: ${arch}"
        return 1
    fi

    local compiler_path="${ANDROID_NDK_PATH}/${compiler}"
    if [ ! -f "${compiler_path}" ]; then
        log_error "Android compiler not found: ${compiler_path}"
        log_error "Make sure Android NDK is properly installed"
        return 1
    fi

    local output_file="${OUTPUT_DIR}/bin/${APP_NAME}-android-${arch}"

    log_info "Building android/${arch}..."

    if ! GOOS=android GOARCH="${go_arch}" CC="${compiler_path}" CGO_ENABLED=1 \
        go build -o "${output_file}" -ldflags="${LDFLAGS}" -tags=jsoniter "${MAIN_DIR}" 2>&1; then
        log_error "Failed to build android/${arch}"
        log_error "Build command: GOOS=android GOARCH=${go_arch} CC=${compiler_path} CGO_ENABLED=1 go build -o ${output_file} -ldflags=\"${LDFLAGS}\" -tags=jsoniter ${MAIN_DIR}"
        return 1
    fi

    if [ ! -f "${output_file}" ]; then
        log_error "Build completed but output file not found: ${output_file}"
        return 1
    fi

    # Strip binary to reduce size
    local strip_tool="${ANDROID_NDK_PATH}/llvm-strip"
    if [ -f "${strip_tool}" ]; then
        if ! "${strip_tool}" "${output_file}" 2>/dev/null; then
            log_warning "Failed to strip binary, but build was successful"
        fi
    else
        log_warning "Strip tool not found: ${strip_tool}"
    fi

    log_success "Built android/${arch} → bin/$(basename "${output_file}")"
}

# =============================================================================
# Post-build Functions
# =============================================================================

create_archives() {
    log_step "Creating distribution archives"

    local archives_dir="${OUTPUT_DIR}/archives"

    # Copy documentation files to archives directory
    cp README.md LICENSE "${archives_dir}/" 2>/dev/null || log_info "Documentation files not found, skipping"

    # Archive all binaries (zip format for all platforms)
    while IFS= read -r -d '' file; do
        local basename_file
        basename_file=$(basename "$file")
        local extension=""

        # Add .exe extension for Windows binaries
        if [[ "$basename_file" == *"-windows-"* ]]; then
            extension=".exe"
        fi

        if ! cp "$file" "${archives_dir}/${APP_NAME}${extension}" 2>/dev/null; then
            log_error "Failed to copy $file to ${archives_dir}/${APP_NAME}${extension}"
            continue
        fi

        if (cd "${archives_dir}" && zip -q "${basename_file}.zip" "${APP_NAME}${extension}" README.md LICENSE 2>/dev/null); then
            rm -f "${archives_dir}/${APP_NAME}${extension}"
            log_success "Archived: archives/${basename_file}.zip"
        else
            log_error "Failed to create archive: ${basename_file}.zip"
            rm -f "${archives_dir}/${APP_NAME}${extension}"
        fi
    done < <(find "${OUTPUT_DIR}/bin/" -name "${APP_NAME}-*" -type f -print0 2>/dev/null)

    # Cleanup documentation files from archives directory
    rm -f "${archives_dir}/README.md" "${archives_dir}/LICENSE"

    if ! cd .. 2>/dev/null; then
        log_error "Failed to return to parent directory"
        return 1
    fi

    log_success "Created archives in ${archives_dir}/"
}

generate_checksums() {
    log_step "Generating checksums"

    local bin_dir="${OUTPUT_DIR}/bin"

    if ! cd "${bin_dir}" 2>/dev/null; then
        log_error "Failed to change to bin directory: ${bin_dir}"
        return 1
    fi

    if ! find . -maxdepth 1 -name "${APP_NAME}-*" -type f | head -1 | grep -q .; then
        log_info "No build artifacts found in bin directory, skipping checksums"
        cd ../.. 2>/dev/null || true
        return 0
    fi

    # Use appropriate checksum command based on OS
    local checksum_cmd
    if command_exists md5sum; then
        checksum_cmd="md5sum"
    elif command_exists md5; then
        checksum_cmd="md5 -r" # -r for BSD md5 to match md5sum format
    else
        log_error "No checksum command available (md5sum or md5)"
        cd ../.. 2>/dev/null || true
        return 1
    fi

    if find . -maxdepth 1 -name "${APP_NAME}-*" -type f -print0 | xargs -0 $checksum_cmd >md5.txt 2>/dev/null; then
        local checksum_count=$(wc -l <md5.txt 2>/dev/null || echo "0")
        log_success "Generated checksums for ${checksum_count} files in bin/"
    else
        log_error "Failed to generate checksums"
        cd ../.. 2>/dev/null || true
        return 1
    fi

    if ! cd ../.. 2>/dev/null; then
        log_error "Failed to return to parent directory"
        return 1
    fi
}

prepare_docker_binaries() {
    log_step "Preparing Docker binaries"

    local docker_dir="${OUTPUT_DIR}/docker"

    # Create docker directory under OUTPUT_DIR
    if ! mkdir -p "${docker_dir}"; then
        log_error "Failed to create docker directory: ${docker_dir}"
        log_error "Current working directory: $(pwd)"
        log_error "Directory permissions: $(ls -la . 2>/dev/null || echo 'Cannot list directory')"
        return 1
    fi

    local platforms=(
        "x86_64:linux/amd64"
        "x86:linux/386"
        "armv7:linux/arm/v7"
        "arm64:linux/arm64"
    )

    local copied_count=0

    for platform in "${platforms[@]}"; do
        local arch="${platform%%:*}"
        local docker_platform="${platform#*:}"
        local binary_name="${APP_NAME}-linux-${arch}"
        local platform_dir="${docker_dir}/${docker_platform}"

        if ! mkdir -p "${platform_dir}"; then
            log_error "Failed to create directory: ${platform_dir}"
            log_error "Docker platform: ${docker_platform}"
            continue
        fi

        # Try to copy from binary file first
        if [ -f "${OUTPUT_DIR}/bin/${binary_name}" ]; then
            if cp "${OUTPUT_DIR}/bin/${binary_name}" "${platform_dir}/${APP_NAME}" 2>/dev/null; then
                log_success "Copied bin/${binary_name} → docker/${docker_platform}/${APP_NAME}"
                ((copied_count++))
            else
                log_error "Failed to copy bin/${binary_name} to ${platform_dir}/${APP_NAME}"
            fi
        else
            log_warning "Binary not found: bin/${binary_name}"
        fi
    done

    if [ $copied_count -gt 0 ]; then
        log_success "Prepared ${copied_count} Docker binaries in ${docker_dir}/"
    else
        log_warning "No Docker binaries prepared"
    fi
}

# =============================================================================
# Main Execution
# =============================================================================

show_usage() {
    echo "Usage: $0 <command> [os] [arch]"
    echo ""
    echo "Commands:"
    echo "  release              Build all platforms and create distribution packages"
    echo "  build <os> <arch>    Build for specific OS and architecture"
    echo "  help                 Show this help message"
    echo ""
    echo "Supported OS:"
    echo "  linux, windows, darwin, android"
    echo ""
    echo "Supported architectures:"
    echo "  x86_64, arm64, armv7, x86"
    echo ""
    echo "Examples:"
    echo "  $0 build windows x86_64"
    echo "  $0 build linux x86_64"
    echo "  $0 build android arm64"
    echo "  $0 release"
}

validate_os_arch() {
    local os="$1"
    local arch="$2"

    # Validate OS
    case "$os" in
    "linux" | "windows" | "darwin" | "android") ;;
    *)
        log_error "Unsupported OS: $os"
        log_error "Supported OS: linux, windows, darwin, android"
        return 1
        ;;
    esac

    # Validate architecture
    case "$arch" in
    "x86_64" | "arm64" | "armv7" | "x86") ;;
    *)
        log_error "Unsupported architecture: $arch"
        log_error "Supported architectures: x86_64, arm64, armv7, x86"
        return 1
        ;;
    esac

    return 0
}

main() {
    case "${1:-}" in
    "build")
        if [ $# -ne 3 ]; then
            log_error "Build command requires OS and architecture"
            log_error "Usage: $0 build <os> <arch>"
            show_usage
            exit 1
        fi

        local os="$2"
        local arch="$3"

        if ! validate_os_arch "$os" "$arch"; then
            exit 1
        fi

        log_step "Starting single platform build"
        echo "📦 Building ${APP_NAME} ${GIT_VERSION} (${COMMIT_ID}) for ${os}/${arch}"
        echo ""

        # Setup
        if ! prepare_environment; then
            log_error "Failed to prepare build environment"
            exit 1
        fi

        # Setup Android NDK if building for Android
        if [ "$os" = "android" ]; then
            if ! setup_android_ndk; then
                log_error "Failed to setup Android NDK"
                exit 1
            fi
        fi

        # Build for specified platform
        log_step "Building binary"

        if [ "$os" = "android" ]; then
            if ! build_android "$arch"; then
                log_error "Failed to build ${os}/${arch}"
                exit 1
            fi
        else
            if ! build_standard "$os" "$arch"; then
                log_error "Failed to build ${os}/${arch}"
                exit 1
            fi
        fi

        log_step "Build completed"
        log_success "Binary ready: ${OUTPUT_DIR}/bin/${APP_NAME}-${os}-${arch}"
        ;;
    "release")
        log_step "Starting release build"
        echo "📦 Building ${APP_NAME} ${GIT_VERSION} (${COMMIT_ID})"
        echo ""

        # Setup
        if ! prepare_environment; then
            log_error "Failed to prepare build environment"
            exit 1
        fi

        # if ! setup_android_ndk; then
        #     log_error "Failed to setup Android NDK"
        #     exit 1
        # fi

        # Build for different platforms
        log_step "Building binaries"

        # Android builds (requires CGO and NDK)
        # if ! build_android arm64; then
        #     log_error "Failed to build Android arm64"
        # fi

        # Standard builds (pure Go, static binaries)
        if ! build_standard linux x86_64; then
            log_error "Failed to build Linux x86_64"
        fi
        if ! build_standard linux arm64; then
            log_error "Failed to build Linux arm64"
        fi
        if ! build_standard linux armv7; then
            log_error "Failed to build Linux armv7"
        fi
        if ! build_standard linux x86; then
            log_error "Failed to build Linux x86"
        fi
        if ! build_standard windows x86_64; then
            log_error "Failed to build Windows x86_64"
        fi
        if ! build_standard windows x86; then
            log_error "Failed to build Windows x86"
        fi
        if ! build_standard darwin arm64; then
            log_error "Failed to build Darwin arm64"
        fi
        if ! build_standard darwin x86_64; then
            log_error "Failed to build Darwin arm64"
        fi

        # Post-processing
        if ! prepare_docker_binaries; then
            log_warning "Failed to prepare Docker binaries, but continuing..."
        fi

        if ! generate_checksums; then
            log_warning "Failed to generate checksums, but continuing..."
        fi

        if ! create_archives; then
            log_warning "Failed to create archives, but continuing..."
        fi

        log_step "Build completed"
        log_success "All artifacts ready in ${OUTPUT_DIR}/"
        log_info "  • Binaries: ${OUTPUT_DIR}/bin/"
        log_info "  • Docker binaries: ${OUTPUT_DIR}/docker/"
        log_info "  • Archives: ${OUTPUT_DIR}/archives/"
        ;;
    "help" | "-h" | "--help")
        show_usage
        ;;
    "")
        log_error "No command specified"
        show_usage
        exit 1
        ;;
    *)
        log_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
    esac
}

main "$@"
