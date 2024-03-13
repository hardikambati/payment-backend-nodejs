FROM node:18.16.0-alpine3.17

RUN mkdir /app

RUN npm install --global nodemon

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install

COPY src/ .

EXPOSE 3000

CMD [ "npm", "start"]