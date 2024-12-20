FROM node:20.11.0

WORKDIR /app

ENV NODE_ENV=production

RUN npm i -g serve

COPY dist dist

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]