FROM node:alpine
RUN apk add g++ make python
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=prod
COPY . .
EXPOSE 3000
CMD [ "node", "src/app.js" ]