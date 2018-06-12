FROM node:slim

WORKDIR /usr/src/app

COPY ./transactions ./transactions/
COPY ./package.json ./package.json
COPY ./.babelrc ./.babelrc

RUN npm install

COPY ./src/* ./src/

RUN npm run build
