FROM node:14.6.0

ENV NODE_ENV=production
WORKDIR /app

COPY ["package.json", "/app"]

RUN npm install --production

ENV PATH /app/node_modules/.bin:$PATH
