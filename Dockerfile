FROM node:alpine3.13

ENV NODE_ENV production

WORKDIR /app

COPY ["package.json", "/app"]

RUN npm install --production

ENV PATH /app/node_modules/.bin:$PATH

ENV ENV DEBUG=*

RUN npm install -g nodemon cross-env
