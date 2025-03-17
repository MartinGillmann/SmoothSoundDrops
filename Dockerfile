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
#	cd /home/pi/Docker/MusicDisplay
#	cd /var/lib/docker/containers
#
################################################################################3

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
#WORKDIR /usr/share/nginx/html
WORKDIR /app2
COPY --from=build /app1/build .
RUN ls -als

EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
#CMD ["bash", "-c", "while true; do sleep 1000; done"]    #bash: not found
#CMD ["sh", "-c", "while true; do sleep 1000; done"]    #bash: not found
                      