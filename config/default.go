package config

const DefaultConfigTemplate = `
# Whether to print progress
print-progress: false

rename:
  # Renaming method: api, regex, or mix
  method: mix
  # Whether to show flag information
  flag: false

check:
  # Concurrency
  concurrent: 100
  # Check interval, in minutes
  interval: 10
  # Timeout, in milliseconds
  timeout: 2000
  # Minimum speed, in KB/s
  min-speed: 2048
  # Download test timeout, in seconds
  download-timeout: 10
  # Speed test URL
  speed-test-url: https://github.com/AaronFeng753/Waifu2x-Extension-GUI/releases/download/v3.121.12-beta/Update-W2xEX-v3.121.12-beta-FROM-v3.121.01.7z
  # Items to check
  items:
    - openai
    - youtube
    - netflix
    - disney

save:
  # Save method: webdav, http, gist, or r2
  method: webdav
  # Save port
  port: 8080
  # WebDAV
  webdav-url: "https://webdav.company/dav"
  webdav-username: "username"
  webdav-password: "password"
  # GitHub token
  github-token: ""
  # Gist ID
  github-gist-id: ""
  # GitHub API mirror
  github-api-mirror: "https://your-worker-url.com/github"
  # Worker URL
  worker-url: https://your-worker-url.com
  # Worker token
  worker-token: your-worker-token

# Mihomo API
mihomo-api-url: "http://192.168.31.11:9090"
# Mihomo API secret
mihomo-api-secret: ""
# Retry count for subscription URLs
sub-urls-retry: 3
# Proxy settings, supports http and socks proxies
proxy:
  type: "http" # Options: http, socks
  address: "http://192.168.31.11:7890" # Proxy address
# Subscription URLs
sub-urls:
  - https://example.com/sub1
  - https://example.com/sub2
`
