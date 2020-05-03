FROM node:12.16.1-alpine AS build

WORKDIR /tmp

COPY package*.json ./

RUN npm install --save-dev --loglevel=error

COPY ts*.json ./
COPY src src/

RUN npm run build \
    && npm run copy-statics

FROM node:12.16.1-alpine

ARG SERVER_PORT=5000
ENV SERVER_PORT=${SERVER_PORT}

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --save-prod --loglevel=error \
    && adduser -D -H kiosk

COPY --from=build /tmp/dist ./dist

USER kiosk

CMD node dist/server.js
EXPOSE ${SERVER_PORT}
