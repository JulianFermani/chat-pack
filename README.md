# 🤖 WhatsApp Bot - Chat Pack

Este proyecto es un bot de WhatsApp personal, pensado para correr fácilmente en producción usando Docker y MongoDB.

## 🚀 Comandos útiles

### 1. Levantar la base de datos MongoDB

```bash
docker compose up -d
```

Esto levanta la base de datos MongoDB definida en tu `docker-compose.yml`.

### 2. Build del proyecto para producción

```bash
docker build -t chat-pack .
```

Esto crea una imagen Docker llamada `chat-pack` a partir del `Dockerfile` del proyecto.

### 3. Correr el proyecto en producción

```bash
docker run chat-pack:latest
```

Esto lanza el contenedor con la imagen `chat-pack:latest`.
