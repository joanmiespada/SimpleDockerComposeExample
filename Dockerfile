FROM node:slim

WORKDIR /usr/src/app

#COPY package.json /tmp/package.json
COPY ./transactions ./transactions/
COPY ./package.json ./package.json
COPY ./.babelrc ./.babelrc

#RUN cd /tmp && npm install 
#RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

RUN npm install

COPY ./src/* ./src/
#RUN ls -la 
#RUN pwd
RUN npm run build
RUN npm run start:prod
#CMD ["babel-node", "src/index.js"]
#CMD ["ls","-la"]
#CMD ["tail", "-f", "/dev/null"]
#RUN tail -f /dev/null
#CMD tail -f /dev/null