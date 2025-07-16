# 🤖 WhatsApp Bot - Chat Pack

Este proyecto es un bot de WhatsApp personal, pensado para correr fácilmente en producción usando Docker y MongoDB de forma separada.

---

## 🧱 Requisitos previos

Antes de correr los servicios, asegurate de tener creada una red de Docker compartida:

```bash
docker network create chat-pack-net
```

Esto permite que el contenedor de la app se comunique con el de MongoDB usando su nombre de servicio como hostname (`mongo`).

---

## 🗃 Levantar la base de datos MongoDB

```bash
docker compose up -d
```

---

## 🚀 Build del proyecto para producción

```bash
docker build -t chat-pack .
```

Esto crea una imagen Docker llamada `chat-pack` a partir del `Dockerfile` del proyecto.

---

## ▶️ Correr el proyecto en producción

```bash
docker run --network=chat-pack-net chat-pack:latest
```

- `--network=chat-pack-net`: conecta tu app a la misma red que MongoDB.
