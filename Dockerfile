FROM keymetrics/pm2:8-alpine as builder
MAINTAINER  zhouyu muyu.zhouyu@gmail.com
COPY src src/
COPY config config/
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
RUN npm install
RUN npm run build

FROM keymetrics/pm2:8-alpine
MAINTAINER zhouyu muyu.zhouyu@gmail.com 
COPY --from=builder dist dist/
COPY --from=builder config config/
COPY --from=builder node_modules node_modules/
COPY --from=builder package-lock.json .
ENTRYPOINT pm2-runtime /dist/main.js