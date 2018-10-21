FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN YARN_CACHE_FOLDER=/dev/shm/yarn_cache yarn --production

COPY .next /usr/src/app/.next
COPY locales /usr/src/app/locales
COPY build /usr/src/app/build
COPY src/static /usr/src/app/build/static

EXPOSE 3000

USER node

CMD [ "yarn", "start" ]
