FROM node:22-alpine3.22

WORKDIR /app-node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "src/server.js" ]