FROM node:16-alpine

WORKDIR /src

COPY image-uploader/package.json .

RUN apk update && apk add --no-cache --virtual .build-deps g++ make python3

RUN npm install

RUN apk del .build-deps

COPY image-uploader .

RUN npm run build

CMD ["npm", "run", "prod"]
