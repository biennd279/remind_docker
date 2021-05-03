FROM node:alpine3.13

ENV NODE_ENV production

WORKDIR /app

COPY ["package.json", "./"]

COPY . .

RUN npm install --silent --production --save

CMD ["npm", "run", "start"]
