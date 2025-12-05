FROM nginx:alpine

# Copy the built files to nginx
COPY dist/ /usr/share/nginx/html/

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Default environment variables
ENV API_URL=http://watchtower-api:8080
ENV API_TIMEOUT=60s

# Expose port 80
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
