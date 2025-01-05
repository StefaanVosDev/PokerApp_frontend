# Name the node stage "builder"
FROM node:20 AS builder

# Declare build arguments
ARG VITE_BACKEND_URL
ARG VITE_KC_URL
ARG VITE_KC_REALM
ARG VITE_KC_CLIENT_ID
ARG VITE_GEMINI_API_KEY

# Set working directory
WORKDIR /app

# Copy all files from the current directory to the working directory in the image
COPY . .

# Install node modules and build assets
RUN npm install && npm run build

# Nginx stage for serving content
FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Correctly copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/dist .

# Set environment variables
ARG VITE_BACKEND_URL
ARG VITE_KC_URL
ARG VITE_KC_REALM
ARG VITE_KC_CLIENT_ID
ARG VITE_GEMINI_API_KEY

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_KC_URL=${VITE_KC_URL}
ENV REALM=${VITE_KC_REALM}
ENV VITE_KC_CLIENT_ID=${VITE_KC_CLIENT_ID}
ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}

EXPOSE 3000

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]