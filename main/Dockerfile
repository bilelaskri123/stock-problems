# --- Stage 1: Build the Angular application ---
FROM node:24.20.1-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
# Generates production files into the dist/ folder
RUN npm run build -- --configuration=production


# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy custom Nginx configuration for single page application routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production files from Stage 1 (adjust the 'my-angular-app' path if needed)
COPY --from=build /app/dist/stock_bee/browser /usr/share/nginx/html

EXPOSE 80