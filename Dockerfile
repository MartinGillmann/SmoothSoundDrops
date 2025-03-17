#
#	sudo docker build -t i_music-display -f Dockerfile .
#	sudo docker run -d -t --name c_music-display --cpus="0.50" -p 8089:80 --restart unless-stopped i_music-display
#
#	* List / Analyse
#	sudo docker image ls -a
#	sudo docker container ls -a
#	sudo docker logs c_music-display
#	sudo ss -tulnp | grep docker

#
#	* Step into
#	sudo docker exec -it  c_music-display /bin/sh
#
#	*** Remove
#	sudo docker rm -f c_music-display && sudo docker rmi -f i_music-display
#	rm -rf *
#	sudo truncate -s 0 /var/lib/docker/containers/<container_id>/<container_id>-json.log
#
#	*** Jump
#	cd /home/pi/Docker/Music-Display
#	cd /var/lib/docker/containers
#
#################################################################################

# Use an official Node.js image as the base
# _________________________________________
FROM node AS build

# Set the working directory
WORKDIR /app1

# Copy 
COPY . .
RUN ls -als
RUN pwd

RUN npm install -g create-react-app
RUN npm install -g serve
RUN npm update
RUN npm run build

# Now let it run on nginx
# _________________________________________
FROM nginx:1.21-alpine
WORKDIR /app2/smoothsounddrops
COPY --from=build /app1/build .
RUN sh -c 'echo "server { listen 80; server_name localhost; location /smoothsounddrops { root /app2; index index.html; } } " > /etc/nginx/conf.d/default.conf'


EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

                      