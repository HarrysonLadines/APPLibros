# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar y preparar dependencias
COPY package*.json ./
RUN npm install

# Copiar el esquema de Prisma
COPY prisma ./prisma

# Copiar todo el proyecto
COPY . .

# Generar el cliente de Prisma antes de build
RUN npx prisma generate

# Crear el build de Next.js
RUN npm run build

# Stage 2: Producción
FROM node:20-alpine
WORKDIR /app

# Copiar archivos necesarios del stage anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.js ./

# Variables de entorno (inyectadas por GitHub/Vercel)
ENV DATABASE_URL=${DATABASE_URL}

EXPOSE 3000

# Iniciar la app en producción
CMD ["npm", "start"]
