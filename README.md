## todo-dev-api

#### start watchtower

`docker run -d --name watchtower --restart unless-stopped -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --cleanup --remove-volumes -i 300`

#### app start

`docker run -d --name todo_api -p 3000:3000 -dit --restart unless-stopped mgcat/todo-dev-api`

#### check launched conts

`docker ps`
