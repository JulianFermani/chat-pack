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

---

## 🗺 API Key de Google Maps (para ubicación de colectivos)

Para poder usar las funcionalidades de geolocalización (como obtener la ubicación de colectivos), necesitás configurar una API KEY de Google Maps.

Colocá la misma clave en los siguientes archivos:

- `/config/env/development.env`
- `/config/env/production.env`

Aclaración: Los archivos .env.template son justamente templates para que copies y pegues sin el .template.

Variable esperada:

```
MAPS_API=tu_api_key_aca
```

> ⚠️ Asegurate de habilitar la API de **Google Maps Static** y/o **Geocoding API**.
