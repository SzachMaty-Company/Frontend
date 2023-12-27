FROM node:14 as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN ls -l .
 
FROM nginx:1.24.0 as server-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]
