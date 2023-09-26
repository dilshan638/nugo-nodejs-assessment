FROM node:16
WORKDIR ./src/index.js
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "./src/index.js" ]








