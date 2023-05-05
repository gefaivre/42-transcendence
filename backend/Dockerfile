FROM node:latest

WORKDIR /app

COPY entrypoint.sh .

COPY images/basic-pp.jpg   /app/images/basic_pp.jpg

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
