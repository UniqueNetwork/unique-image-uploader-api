FROM node:16-alpine

WORKDIR /src

COPY ./offchain/package.json .

RUN npm install

COPY ./offchain .

RUN npm run build

CMD ["npm", "run", "prod"]
