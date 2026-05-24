FROM node:24

RUN apt-get update && apt-get install -y \
        ffmpeg \
        python3 \
        python3-pip \
        chromium \
        && python3 -m pip install --break-system-packages --no-cache-dir -U "yt-dlp[default,curl-cffi]" \
        && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
