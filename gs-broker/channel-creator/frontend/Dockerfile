# base image
FROM node:14.17.1-alpine

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package.json ./
RUN npm install --silent
COPY . ./

# start app
CMD ["npm", "start"]
