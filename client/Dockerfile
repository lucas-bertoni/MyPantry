FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "build"]
