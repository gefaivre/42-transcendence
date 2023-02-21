FROM node:16-slim

# Create and change to the app directory.
WORKDIR /app

# Copy the package.json and package-lock.json files to the container.
COPY package*.json ./

# Install dependencies.
#RUN npm install

# Copy the rest of the application code to the container.
COPY . .

# Build the app for production.
#RUN npm run build

# Serve the app with a production-ready web server.
#CMD ["npm", "run", "dev"]