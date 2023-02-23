FROM node:19.7.0

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm && pnpm install

EXPOSE 13000

CMD [ "pnpm", "run", "run:backend" ]