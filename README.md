Necesitas tener instalado:

1. Google Chrome
2. Ffmpeg

### Google Chrome

```bash
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list

wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/google-chrome.gpg > /dev/null

sudo apt update

sudo apt install google-chrome-stable
```

### ffmpeg

```bash
sudo apt install ffmpeg
```
