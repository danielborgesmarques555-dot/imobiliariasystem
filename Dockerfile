FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY dev-server.cjs ./
COPY index.html ./
COPY script.js ./
COPY styles.css ./
COPY assets ./assets

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dev-server.cjs"]
