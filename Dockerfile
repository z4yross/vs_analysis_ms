FROM node:current-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# RUN apk add --no-cache bash
# RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
# RUN chmod +x /bin/wait-for-it.sh

COPY --chown=node:node ./package*.json ./

COPY --chown=node:node ./server ./server

COPY ./server/utils/firestore/keys /keys

ENV KEY_PATH='/keys/'

USER node

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist-server/bin/www" ]