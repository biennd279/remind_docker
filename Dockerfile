FROM node:14.6.0

ENV NODE_ENV=production
WORKDIR /app

COPY ["package.json", "./"]

RUN npm install --production

