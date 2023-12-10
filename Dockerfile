FROM node:14 as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx as server-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]