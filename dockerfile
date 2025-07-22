# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app (if needed)
# RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]