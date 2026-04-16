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

## 🔐 Configuración de autenticación de WhatsApp

El cliente soporta dos modos de autenticación configurables por entorno:

- `WHATSAPP_AUTH_MODE=local`: guarda la sesión en `.wwebjs_auth/`.
- `WHATSAPP_AUTH_MODE=remote`: guarda la sesión en MongoDB usando `wwebjs-mongo`.

Variables comunes:

```env
CHROMIUM_DIR=/ruta/al/ejecutable/de/chromium
WHATSAPP_AUTH_MODE=local
WHATSAPP_CLIENT_ID=cliente
```

Variables adicionales para `RemoteAuth`:

```env
MONGODB_URI=mongodb://usuario:password@host:27017/
WHATSAPP_REMOTE_BACKUP_SYNC_INTERVAL_MS=60000
```

Notas:

- `CHROMIUM_DIR` es obligatoria en ambos modos.
- `MONGODB_URI` solo es obligatoria cuando `WHATSAPP_AUTH_MODE=remote`.
- `WHATSAPP_CLIENT_ID` es opcional. Si no se define, se usa `cliente`.
- `WHATSAPP_REMOTE_BACKUP_SYNC_INTERVAL_MS` es opcional. Si no se define, se usa `60000`.

---

## ▶️ Correr el proyecto en producción

```bash
docker run --network=chat-pack-net -d chat-pack:latest
```

- `--network=chat-pack-net`: conecta tu app a la misma red que MongoDB.
- `-d`: corre el contenedor en segundo plano.

---

## ✨ Features disponibles

| Feature             | Uso                         | Descripción                                                                                          |
| ------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Saludo              | `/hola`                     | Responde con un saludo.                                                                              |
| Ayuda               | `/comandos`                 | Lista los comandos disponibles del bot.                                                              |
| Colectivos          | `/verColectivos`            | Muestra horarios de colectivos Villa del Rosario y, si hay GPS, permite ver ubicación.               |
| Futbol              | `/futbol`                   | Abre el submenu de futbol para ver los partidos de hoy y gestionar suscripciones diarias.            |
| Partidos de hoy     | `/verPartidosHoy`           | Muestra los partidos de futbol disponibles para el dia actual.                                       |
| Suscribirse         | `/suscribirmePartidosHoy`   | Activa la notificacion diaria del resumen de partidos para el chat actual.                           |
| Desuscribirse       | `/desuscribirmePartidosHoy` | Desactiva la notificacion diaria del resumen de partidos para el chat actual.                        |
| Películas           | `/verPeliculas`             | Muestra la cartelera de SudCinemas Villa María.                                                      |
| Entradas            | `/verEntradas`              | Consulta entradas vendidas para una función según la fecha elegida.                                  |
| Suma interactiva    | `/sumarDosNumeros`          | Pide dos números en pasos y devuelve el resultado.                                                   |
| Stickers en privado | Automático                  | Convierte imágenes o videos a sticker, y stickers a imagen, en chats privados.                       |
| Stickers en grupos  | Automático                  | En grupos, convierte multimedia usando la palabra `sticker` o devuelve imagen respondiendo `imagen`. |

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
