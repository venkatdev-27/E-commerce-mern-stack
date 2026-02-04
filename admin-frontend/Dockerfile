# -------- Build Stage --------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_ADMIN_API_BASE_URL
ENV VITE_ADMIN_API_BASE_URL=$VITE_ADMIN_API_BASE_URL

RUN npm run build


# -------- Production Stage --------
FROM nginx:alpine

# 👉 Copy custom Nginx config (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 👉 Copy build files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
