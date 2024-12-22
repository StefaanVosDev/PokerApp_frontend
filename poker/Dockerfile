# Use the official Nginx image from the Docker Hub
FROM nginx:latest

# Build arguments to pass environment variables
ARG VITE_KC_URL
ARG VITE_KC_REALM
ARG VITE_KC_CLIENT_ID

# Set environment variables
ENV VITE_KC_URL=$VITE_KC_URL
ENV VITE_KC_REALM=$VITE_KC_REALM
ENV VITE_KC_CLIENT_ID=$VITE_KC_CLIENT_ID

# Copy the build output to replace the default Nginx contents
COPY dist /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start Nginx when the container has started
CMD ["nginx", "-g", "daemon off;"]