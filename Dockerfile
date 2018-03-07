FROM node:8.9.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --production

COPY production-server /usr/src/app/production-server
COPY locales /usr/src/app/locales
COPY .next /usr/src/app/.next

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
