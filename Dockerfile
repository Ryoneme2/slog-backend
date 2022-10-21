FROM node:16

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY ./package.json .

RUN npm install && npx prisma generate

COPY . .

CMD ["npm","run","dev"]