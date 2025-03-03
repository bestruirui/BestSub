FROM debian:bookworm

ENV TZ=Asia/Shanghai

RUN apt-get update && apt-get install -y ca-certificates tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    rm -rf /var/cache/apt/*  && \
    mkdir -p /app

ARG TARGET_ARCH

COPY dist/BestSub_linux_${TARGET_ARCH}/BestSub /app/BestSub

CMD /app/BestSub