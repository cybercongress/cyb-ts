# install
FROM node:18.14 as install
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# build
FROM node:18.14 as build
WORKDIR /usr/src/app
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build
