# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar todas las dependencias necesarias para build
RUN npm install

# Copiar todo el proyecto
COPY . .

# Crear el build de Next.js
RUN npm run build

# Stage 2: Producción
FROM node:20-alpine
WORKDIR /app

# Copiar solo lo necesario desde el stage de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Instalar solo dependencias de producción
RUN npm install --production

# Variables de entorno (solo la que usas)
ENV DATABASE_URL=${DATABASE_URL}

# Puerto que expondrá el contenedor
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
