# Gunakan image Node.js resmi sebagai base image
FROM node:18-alpine

# Set direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm ci --only=production

# Salin semua file aplikasi
COPY . .

# Bangun aplikasi Next.js
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Mulai aplikasi
CMD ["npm", "start"]