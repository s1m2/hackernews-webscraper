# The LTS support for node
FROM node:10

# Creating the app directory 
WORKDIR /usr/src/app

# Copy the package json and package-lock to the working directory 
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the apps source code to the working directory
COPY . .

ENTRYPOINT  [ "node", "scraper.js" ]