FROM node
WORKDIR /home/admin/nodeApps/todo-dev-api
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
