FROM node:24-alpine

ENV MONGO_DB_USERNAME=root
ENV MONGO_DB_PASSWORD=root

RUN mkdir -p /home/app

COPY ./app /home/app

WORKDIR /home/app

EXPOSE 3000

RUN npm install

CMD ["node","/home/app/server.js"]
