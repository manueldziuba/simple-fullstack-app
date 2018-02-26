# Use the official node docker image (version 8)  
FROM node:8

# Set environment variables
ENV TERM=xterm
ENV NODE_ENV=production

# By default, Docker runs container as root - we restrict the app to run restricted
USER node
WORKDIR /home/node

# Copy package files into the container, then install all (prod) dependencies for the project
COPY package*.json ./
RUN npm install --only=production

# Copy the application files into the container
COPY server /home/node/server
COPY client /home/node/client

# Expose the port 5000 to the host to be able to open http://localhost:5000 in the browser
EXPOSE 5000

# Start/run the application
CMD [ "npm", "start" ]
