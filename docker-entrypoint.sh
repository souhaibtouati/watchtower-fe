#!/bin/sh
set -e

# Default values for environment variables
: "${API_URL:=http://watchtower-api:8080}"
: "${API_TOKEN:=}"
: "${API_TIMEOUT:=60s}"

# Export variables for envsubst
export API_URL API_TOKEN API_TIMEOUT

# Substitute environment variables in nginx config
envsubst '${API_URL} ${API_TOKEN} ${API_TIMEOUT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Starting nginx with configuration:"
echo "  API_URL: ${API_URL}"
echo "  API_TOKEN: ${API_TOKEN:+[CONFIGURED]}"
echo "  API_TIMEOUT: ${API_TIMEOUT}"

# Execute nginx
exec nginx -g 'daemon off;'
