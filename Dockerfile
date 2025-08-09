FROM node:18-alpine
WORKDIR /app

# Speed up PATH lookups for local binaries (react-scripts)
ENV PATH=/app/node_modules/.bin:$PATH

# Install deps first for better caching
COPY package.json package-lock.json ./
RUN npm ci --no-audit --silent

# Copy source
COPY . .

# CRA dev server binds to 0.0.0.0 and uses polling in containers
ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000
CMD ["npm", "start"] 