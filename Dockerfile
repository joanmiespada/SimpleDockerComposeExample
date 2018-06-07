FROM node:latest

WORKDIR /usr/src/app

COPY package.json /tmp/package.json
COPY ./transactions ./transactions/

RUN cd /tmp && npm install --production
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

COPY ./build .

#CMD ["node", "./main.js"]