FROM node:18.20.4-alpine3.19

RUN sed -i -e 's/:33:/:82:/' /etc/group && \
    if ! id -u www-data >/dev/null 2>&1; then \
        adduser -u 82 -D -S -G www-data www-data; \
    fi

RUN adduser www-data node
