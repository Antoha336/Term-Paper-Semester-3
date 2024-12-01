FROM nginx:1.26.2

COPY ./src/nginx.conf /etc/nginx/nginx.conf

COPY ./src/build /usr/share/nginx/html

EXPOSE 5002

CMD ["nginx", "-g", "daemon off;"]
