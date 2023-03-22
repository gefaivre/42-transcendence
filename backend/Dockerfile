FROM node:latest

WORKDIR /app

RUN mkdir images

COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
