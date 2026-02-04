# -------- Build stage --------
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# -------- Production stage --------
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

# ✅ install ONLY production dependencies
RUN npm ci --only=production

# ✅ copy app source (not node_modules)
COPY --from=build /app ./

EXPOSE 5000

CMD ["node", "server.js"]
