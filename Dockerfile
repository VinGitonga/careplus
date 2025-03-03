FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN nuxt build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
