FROM nginx:1.26.2

COPY ./src/nginx.conf /etc/nginx/nginx.conf

COPY ./src/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
