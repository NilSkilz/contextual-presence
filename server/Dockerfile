FROM node:14
WORKDIR /server
COPY package.json ./
COPY yarn.lock ./
COPY src ./src
COPY data ./data
RUN yarn install
RUN ls -al
CMD ["yarn", "start"]