# Use the Node.js base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the server code
COPY . .

# Expose port 3001
EXPOSE 3001

# Run the server
CMD ["node", "server.js"]
