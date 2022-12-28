FROM node:16.16.0

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modiles/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

ARG MAX_OLD_SPACE_SIZE=4096
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

# install app dependencies
COPY package.json ./

# yarn ignore-engines
RUN yarn config set ignore-engines true

RUN yarn install
RUN yarn cache clean

# add app
COPY . ./

# expose port
EXPOSE 8080

# start app
CMD ["yarn", "run", "start"]