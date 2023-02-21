FROM node:latest

WORKDIR /app

COPY ./*json .

RUN npm install

RUN npm run build

ENTRYPOINT ["npm", "run", "start:dev"]