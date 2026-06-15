FROM node:20

RUN apt-get update && apt-get install -y git build-essential

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod -R 777 /app

EXPOSE 5000

CMD ["npm", "start"]
