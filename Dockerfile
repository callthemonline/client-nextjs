FROM node:8.9.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --production

COPY server /usr/src/app/server
COPY pages /usr/src/app/pages
COPY locales /usr/src/app/locales
COPY lib /usr/src/app/lib
COPY .next /usr/src/app/.next

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
