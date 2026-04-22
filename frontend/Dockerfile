# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use a startup script to handle the dynamic PORT for Google Cloud Run
CMD ["sh", "-c", "sed -i 's/listen       80;/listen       '\"$PORT\"';/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
