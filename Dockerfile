# User Node 10 Read Alpine Image
FROM mhart/alpine-node:10
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

# Only copy over the Node pieces we need from the above image
FROM alpine:3.8
COPY --from=0 /usr/bin/node /usr/bin/
COPY --from=0 /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
WORKDIR /app
COPY --from=0 /app .
COPY . .
EXPOSE 3000
CMD ["./node_modules/nodemon/bin/nodemon.js", "bot.js"]