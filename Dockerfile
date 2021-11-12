FROM node:16-alpine

WORKDIR /src

COPY ./offchain/package.json .

RUN apk update && apk add --no-cache --virtual .build-deps g++ make python3

RUN npm install

RUN apk del .build-deps

COPY ./offchain .

RUN npm run build

CMD ["npm", "run", "prod"]
