FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --prod
EXPOSE 3000
COPY --chown=node:node ./ ./
CMD ["node","main.js"]
