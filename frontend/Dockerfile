FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

RUN npm install

# Copy all files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev"]
