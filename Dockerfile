FROM node:20-slim

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies required for build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (Vite frontend + esbuild backend)
RUN npm run build

# Remove devDependencies to keep the image small for production
RUN npm prune --production

# Expose the port the app runs on (Render provides PORT env var)
EXPOSE 4001

# Start the application
CMD ["npm", "start"]
