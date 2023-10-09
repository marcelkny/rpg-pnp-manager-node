FROM node:18-bullseye

RUN set -ex \
    ## update packages and install deps / usefull tools
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get update -y -q \
    && apt-get upgrade -y -q \
    && apt-get install -y -q \
        sudo \
        curl \
        postgresql-client \
    ## cleanup
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

###
# Add node User and sudo config
###

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=1000

## add user group and user
RUN set -ex \
## node should be created by node js image
##    && groupadd --gid ${USER_GID} ${USERNAME} \
##    && useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME} \
    && echo ${USERNAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME}

## copy scripts and configs
COPY scripts /usr/local/bin

## make scripts executable and enable php modules
RUN set -ex \
    ## setup default pathes and install helper scripts
    && mkdir -p /app \
    && cd /usr/local/bin/ \
        && chmod 755 startup \
        && chmod 755 wait-for-postgres \
        # && chmod 755 wait-for-mysql \
        && chmod 755 wait-for-file

## Mountpoint for App Source & Workdir
VOLUME /app
WORKDIR /app

## switch to node user
USER node

## setup cache locally for reuse
ENV NPM_CACHE "/app/.npm-cache"
RUN set -ex \
    && npm set cache ${NPM_CACHE}

## startup
CMD /usr/local/bin/startup
