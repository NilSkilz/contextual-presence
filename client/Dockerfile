FROM node:14
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY ./ ./
RUN yarn install
RUN ls -al
CMD ["yarn", "start"]
