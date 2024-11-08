FROM node:18-alpine

WORKDIR /usr/app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base \
    linux-headers

# Set Python as python3 to avoid python2 issues
RUN ln -sf python3 /usr/bin/python


COPY ./package.json .

# Clear npm cache and install dependencies
RUN  npm install
RUN  npm rebuild

COPY ./ .

EXPOSE 3000 

CMD [ "npm", "start" ]