FROM node:18-bullseye AS base

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
COPY .docker/worker/scripts /usr/local/bin

## make scripts executable and enable php modules
RUN set -ex \
    ## setup default pathes and install helper scripts
    && mkdir -p /app \
    && cd /usr/local/bin/ \
        && chmod 755 startup \
        && chmod 755 wait-for-postgres \
        # && chmod 755 wait-for-mysql \
        && chmod 755 wait-for-seconds \
        && chmod 755 wait-for-file

## Workdir
WORKDIR /app

####
### PROD Stage
####
FROM base as productive

## build from CI stage: npm run build
COPY build build
## build from CI stage: npm ci --only=prod
COPY node_modules node_modules
## package / config files
COPY ["package.json", "package-lock.json", "app.env", "./"]

## other runtime files
COPY public public
COPY views views

RUN set -ex \
    && sudo chown -R node:node /app

## switch to node user
USER node

CMD /usr/local/bin/startup
