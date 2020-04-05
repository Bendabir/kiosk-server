# Kiosk Server

Kiosk is an application that can cast various contents (webpages, videos, YouTube videos, images, etc.) to other screens. The idea is to easily cast contents to different screens without interacting with machines. It has been designed to avoid any kind of configuration for the user.

The application is separated in 3 parts :
- [kiosk-server](https://github.com/bendabir/kiosk-server), the brain of the application. It embeds all the logic and interacts with screen clients.
- [kiosk-client](https://github.com/bendabir/kiosk-client), a simple webpage that handles the cast operation. It takes its instructions from the Kiosk server. Of course, multiple clients can connect to the same Kiosk server instance.
- [kiosk-admin](https://github.com/bendabir/kiosk-admin), an admin interface to use the application.

The server communicates with the clients through WebSocket to insure real-time casting. The server exposes a RESTful API to configure the screens, contents, etc. It's used by the admin interface.

The RESTful API is secured by a simple API key. Likewise, the WebSocket connections are secured by a client key.

## Setup

The app has been designed to run with Node.js 12 (LTS). All data are stored with PostgreSQL.

## Configuration

The server can be configured through many environment variables.

| Variables                   | Type   | Description |
|-----------------------------|--------|-------------|
| `LOG_LEVEL`                 | String | One of : `"debug"`, `"info"`, `"warn"` or `"error"`. Default to `"info"`. |
| `SERVER_HOST`               | String | Network interface to listen to. Default to `"0.0.0.0"`. |
| `SERVER_PORT`               | Int    | TCP port to listen to. Default to `5000`. |
| `API_KEY`                   | String | Key to use to secure the API. **Default is no key, so no auth.** |
| `CLIENT_KEY`                | String | Key to use to secure the WebSocket connections. **Default is no key, so no auth.** |
| `UPLOAD_DIR`                | String | Path for uploaded files. Default is `"./uploads"`. |
| `MAX_UPLOAD_SIZE`           | Int    | Max allowed size for files upload. Default is 2MiB. |
| `PG_HOST`                   | String | Hostname of the PostgreSQL server. Default is `"localhost"`. |
| `PG_PORT`                   | Int    | Port of the PostgreSQL server. Default is `5432`. |
| `PG_USER`                   | String | User of the PostgreSQL server. Default is `"postgres"`. |
| `PG_PASS`                   | String | Password of the PostgreSQL server. Default is no password. |
| `PG_DB`                     | String | PostgreSQL database to use. Default is `"kiosk"`. |

## Run

### Development

Make sure dev dependencies are installed.

```bash
npm install --save-dev
```

and then run the server with

```bash
npm start
```

You can define a `.env` file with some env variables for easier dev.

Tests can be ran with

```bash
npm run test
```

and code coverage can be computed with

```bash
npm run coverage
```

### Docker

You can also run the server inside a Docker container. This is designed for production.

First build the Docker image.

```bash
docker build -t bendabir/kiosk-server:3.0.0 .
```

Then you can run the container with something similar to the following command.

```bash
# Assumes a PostgreSQL container named "postgres" is running
# on the network "bridge".
docker run --rm \
           --name kiosk-server \
           --hostname kiosk-server \
           -v $UPLOAD_PATH:/usr/app/uploads \
           -e LOG_LEVEL=debug \
           -e POSTGRES_HOST=postgres \
           -e POSTGRES_PORT=5432 \
           -e POSTGRES_USER=postgres \
           -e POSTGRES_DB=kiosk \
           -p 5000:5000 \
           --network bridge \
           bendabir/kiosk-server:latest
```

## Usage

### API

**TODO**
