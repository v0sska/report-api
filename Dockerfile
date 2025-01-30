FROM node:22-alpine

RUN apk add --no-cache openssl

RUN mkdir /api
RUN chown node:node /api
USER node
WORKDIR /api

COPY --chown=node:node entrypoint.sh /api/entrypoint.sh
RUN chmod +x /api/entrypoint.sh

COPY --chown=node:node nest-cli.json package*.json tsconfig.build.json tsconfig.json ./
RUN npm ci
COPY --chown=node:node src ./src
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node .env ./

RUN npm run prisma:generate

RUN npm run build

EXPOSE 3000

CMD [ "sh", "/api/entrypoint.sh" ]
