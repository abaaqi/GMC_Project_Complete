# syntax=docker/dockerfile:1
# ---------- Build the Vite frontend ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite inlines these at build time. In docker-compose the API is reached
# same-origin through the nginx proxy, so the default base URL is "/api".
ARG VITE_API_BASE_URL=/api
ARG VITE_ENABLE_MOCK_DATA=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ENABLE_MOCK_DATA=$VITE_ENABLE_MOCK_DATA

RUN npm run build

# ---------- Serve with nginx ----------
FROM nginx:1.27-alpine AS serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
