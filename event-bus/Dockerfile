FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
COPY ./out .
EXPOSE 4002
RUN chown -R node /usr/src/app
USER node
CMD ["node", "server.js"]
