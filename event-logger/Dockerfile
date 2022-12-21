FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
COPY ./out .
RUN chown -R node /usr/src/app
USER node
CMD ["node", "event-logger/server.js"]
