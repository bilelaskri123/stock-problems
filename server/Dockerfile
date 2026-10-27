# backend/Dockerfile
FROM node:24.20.0-alpine

# Set working Directory
WORKDIR /usr/src/app

# Cache dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose the port your express app listens on
EXPOSE 3000

# Start the application
CMD [ "node", "server.js" ]
