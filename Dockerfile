FROM node:12.16.1-alpine AS build

WORKDIR /tmp

COPY src src/
COPY package*.json ./
COPY ts*.json ./

RUN npm install --save-dev
RUN npm run build \
    && npm run copy-statics

FROM node:12.16.1-alpine

ARG SERVER_PORT=5000
ENV SERVER_PORT=${SERVER_PORT}

WORKDIR /usr/app

COPY --from=build /tmp/dist ./dist
COPY package*.json ./

RUN npm install --save-prod \
    && adduser -D -H kiosk

USER kiosk

CMD node dist/server.js
EXPOSE ${SERVER_PORT}
