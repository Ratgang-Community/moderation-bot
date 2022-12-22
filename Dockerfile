FROM node:18-bullseye-slim

ARG VERSION
ENV VERSION=${VERSION}

ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Prisma generate files
COPY prisma ./prisma
RUN yarn prisma:generate

# Bundle app source
COPY . .
RUN yarn build

# Start app
CMD [ "yarn", "deploy" ]