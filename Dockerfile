FROM node:14.1-alpine AS builder
COPY . /opt/web
WORKDIR /opt/web

RUN npm install
RUN npx browserslist@latest --update-db
ENV PATH="/opt/web/node_modules/.bin:$PATH"
RUN npm run build


FROM nginx:1.17-alpine

RUN apk --no-cache add curl
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/web/build /usr/share/nginx/html

RUN chgrp -R 0 /var/* && chmod -R g=u /var/*

EXPOSE 8052

CMD ["nginx", "-g", "daemon off;"]