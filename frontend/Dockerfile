# Frontend Dockerfile
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the project files
COPY . .

# Build the app
RUN npm run build

# Install serve to serve the build directory
RUN npm install -g serve

# Expose the port
EXPOSE 5000

# Serve the build directory
CMD ["serve", "-s", "build"]
