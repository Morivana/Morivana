FROM node:20-alpine

WORKDIR /app

# Copy package manifests from the subfolder
COPY morivana-app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the server directory
COPY morivana-app/server ./server

# Expose port (Railway will override this via the PORT environment variable)
EXPOSE 5174

# Set production environment defaults
ENV NODE_ENV=production
ENV PORT=5174

# Start the Express server
CMD ["npm", "run", "start"]
