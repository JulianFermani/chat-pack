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
APP_NAME=Chat Pack Bot
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

## 🔔 Alertas con ntfy

El bot incluye monitoreo del estado del cliente de WhatsApp. Cuando ntfy está configurado, envía alertas al iniciar, al detectar estados degradados o desconexiones, y cuando WhatsApp se recupera.

Variables esperadas:

```env
NTFY_BASE_URL=https://ntfy.sh
NTFY_TOPIC=tu_topic_de_alertas
APP_NAME=Chat Pack Bot
```

Notas:

- `NTFY_TOPIC` habilita las notificaciones. Si queda vacío, las alertas se omiten y se registran warnings en logs.
- `NTFY_BASE_URL` es opcional. Si no se define, el código usa `https://ntfy.sh`.
- `APP_NAME` se usa como prefijo en los mensajes. Si no se define, se usa `Chat Pack`.

### Alertas del VPS aunque el bot no arranque

El watchdog de [`deploy/monitoring/`](deploy/monitoring/) corre con systemd, fuera de Docker. Chequea el disco de Docker (umbral por defecto: 90%), el daemon, el ping de MongoDB y si el contenedor del bot lleva al menos 90 segundos corriendo. El bot debe fallar tres chequeos seguidos para alertar, así un despliegue normal no dispara avisos. Cada incidente avisa una vez y luego notifica la recuperación. Un fallo al publicar se reintenta mientras siga pendiente.

En el VPS, desde el repo, instalá el script y las unidades (requiere Docker, Bash, curl y systemd):

```bash
sudo install -m 0755 deploy/monitoring/chat-pack-watchdog /usr/local/bin/
sudo install -m 0644 deploy/monitoring/chat-pack-watchdog.{service,timer} /etc/systemd/system/
sudo install -d -m 0700 /etc/chat-pack
sudo touch /etc/chat-pack/watchdog.env
sudo chmod 0600 /etc/chat-pack/watchdog.env
sudoedit /etc/chat-pack/watchdog.env
```

Configurá `NTFY_TOPIC` en ese archivo, idealmente un tópico privado. También podés definir `NTFY_TOKEN` para autenticar la publicación, `NTFY_BASE_URL` para usar otra instancia HTTPS, `APP_NAME` y `WATCHDOG_DISK_THRESHOLD` (por ejemplo, `85` o `90`). `WATCHDOG_DISK_PATH` solo hace falta si Docker usa otro disco. El archivo es independiente del `.env` del bot.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now chat-pack-watchdog.timer
sudo systemctl start chat-pack-watchdog.service
sudo journalctl -u chat-pack-watchdog.service -n 30 --no-pager
```

Este chequeo no reinicia servicios ni modifica datos. Si se cae todo el VPS o pierde Internet, no puede avisar en el momento: para eso necesitás un monitor externo.

---

## 📥 Descarga automática de redes sociales

El bot puede detectar links públicos de Instagram, TikTok y Twitter/X en mensajes comunes y reenviar el contenido descargado con el caption del post.

Variables esperadas:

```env
SOCIAL_DOWNLOAD_ENABLED=true
SOCIAL_DOWNLOAD_GROUPS_ENABLED=false
SOCIAL_DOWNLOAD_MAX_FILE_MB=100
SOCIAL_DOWNLOAD_TIMEOUT_MS=120000
SOCIAL_DOWNLOAD_TMP_DIR=/tmp/chat-pack-social-downloads
SOCIAL_DOWNLOAD_YTDLP_PATH=yt-dlp
```

Notas:

- `SOCIAL_DOWNLOAD_ENABLED` activa o desactiva la feature completa. Por defecto queda activa.
- `SOCIAL_DOWNLOAD_GROUPS_ENABLED` controla si responde en grupos. Por defecto queda desactivado para no meter ruido.
- `SOCIAL_DOWNLOAD_MAX_FILE_MB` limita el archivo descargado. El default es `100`.
- `SOCIAL_DOWNLOAD_TIMEOUT_MS` corta descargas lentas. El default es `120000`.
- `SOCIAL_DOWNLOAD_TMP_DIR` define dónde se descargan archivos temporales.
- `SOCIAL_DOWNLOAD_YTDLP_PATH` permite indicar el binario de `yt-dlp`. En Docker puede quedar como `yt-dlp`; en desarrollo local debe existir en tu `PATH` o apuntar a una ruta absoluta.
- La descarga usa `yt-dlp`, instalado en la imagen Docker con extras `default` y `curl-cffi` junto con `ffmpeg`.
- Para TikTok conviene mantener `yt-dlp` actualizado: el sitio cambia seguido sus challenges anti-bot.
- No usa cookies ni login. Si Instagram o X piden sesión, el bot responde con error y emoji.
- Los archivos temporales se borran siempre al finalizar el intento de descarga.

Para desarrollo local, instalá `yt-dlp` antes de probar la feature:

```bash
python3 -m pip install -U "yt-dlp[default,curl-cffi]"
```

Luego verificá la ruta con:

```bash
command -v yt-dlp
```

Si no queda disponible como `yt-dlp`, configurá `SOCIAL_DOWNLOAD_YTDLP_PATH` con la ruta devuelta por tu instalación.

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
| Registrar TIN       | `/registrarTin 1596322`     | Guarda el numero impreso de tu tarjeta TIN para consultar el saldo despues.                          |
| Ver TIN             | `/verTin`                   | Muestra el numero de tarjeta TIN registrado en el chat privado.                                      |
| Saldo TIN           | `/consultarSaldo`           | Consulta el saldo actual de la tarjeta TIN registrada usando el servicio de recarga online.          |
| Eliminar TIN        | `/eliminarTin`              | Borra la tarjeta TIN registrada para el chat privado.                                                |
| Descargas sociales  | Automático                  | Descarga links públicos de Instagram, TikTok y Twitter/X, y los reenvía con caption.                 |
| Stickers en privado | Automático                  | Convierte imágenes o videos a sticker, y stickers a imagen, en chats privados.                       |
| Stickers en grupos  | Automático                  | En grupos, convierte multimedia usando la palabra `sticker` o devuelve imagen respondiendo `imagen`. |

Notas sobre TIN:

- Los comandos TIN solo funcionan en chats privados.
- `/registrarTin` espera el numero impreso de la tarjeta, por ejemplo `1596322`, no la serie alfanumerica interna.
- `/consultarSaldo` usa la tarjeta registrada previamente y muestra el saldo actual con formato de moneda.

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

> ⚠️ Asegurate de habilitar la API de **Google Maps Static** y/o **Geocoding API**. .
