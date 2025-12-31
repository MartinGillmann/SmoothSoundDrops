#
#	sudo docker build -t i_smooth_sound_drops -f Docker/Dockerfile .
#	sudo docker run -d -t --name c_smooth_sound_drops -p 8090:80 -e PLACEHOLDER_PROTOCOL="http" -e PLACEHOLDER_DOMAIN="famgillmann.ch" -e PLACEHOLDER_PATH="SmoothSoundDrops" i_smooth_sound_drops
#
#	* List / Analyse
#	sudo docker image ls -a
#	sudo docker container ls -a
#	sudo docker logs c_smooth_sound_drops
#	sudo ss -tulnp | grep docker
#	sudo docker exec -it c_smooth_sound_drops cat /var/startup.log
#	sudo docker inspect --format='{{json .NetworkSettings.Ports}}' c_smooth_sound_drops
#	sudo docker inspect c_smooth_sound_drops | grep IPAddress
#   curl -v --connect-to famgillmann.ch:80:10.41.11.54:8090 http://famgillmann.ch/SmoothSoundDrops/
#   sudo docker exec -it c_smooth_sound_drops tail /var/log/nginx/access.log
#   sudo docker exec -it c_smooth_sound_drops tail /var/log/nginx/error.log
#
#
#
#	* Step into
#	sudo docker exec -it  c_smooth_sound_drops /bin/sh
#   sudo docker exec -it  c_smooth_sound_drops cat /var/startup.log
#
#	*** Remove
#	sudo docker rm -f c_smooth_sound_drops && sudo docker rmi -f i_smooth_sound_drops
#	rm -rf *
#	sudo truncate -s 0 /var/lib/docker/containers/<container_id>/<container_id>-json.log
#
#   *** Full Recycle (build first)
#	sudo docker build -t i_smooth_sound_drops -f Docker/Dockerfile . && sudo docker rm -f c_smooth_sound_drops && sudo docker run -d -t --name c_smooth_sound_drops -p 8090:80 -e PLACEHOLDER_PROTOCOL="http" -e PLACEHOLDER_DOMAIN="famgillmann.ch" -e PLACEHOLDER_PATH="SmoothSoundDrops" i_smooth_sound_drops
#
#   *** Full Recycle	
# 	sudo docker rm -f c_smooth_sound_drops && sudo docker rmi -f i_smooth_sound_drops && sudo docker build -t i_smooth_sound_drops -f Docker/Dockerfile .
# 	sudo docker rm -f c_smooth_sound_drops && sudo docker rmi -f i_smooth_sound_drops && sudo docker build -t i_smooth_sound_drops -f Docker/Dockerfile . && sudo docker run -d -t --name c_smooth_sound_drops -p 8090:80 -e PLACEHOLDER_PROTOCOL="http" -e PLACEHOLDER_DOMAIN="famgillmann.ch" -e PLACEHOLDER_PATH="SmoothSoundDrops" i_smooth_sound_drops
#
#
#	*** Jump
#	cd /home/pi/Docker/SmoothSoundDrops
#	cd /var/lib/docker/containers
#
#################################################################################
# Deployment Explained
# 1) In C:\CSharpSolutions\ReactProjects\SmoothSoundDrops\smoothsounddrops muss
#   - build
#   - node_modules
# gelöscht werden
#
# 2) C:\CSharpSolutions\ReactProjects\SmoothSoundDrops\_2_Code_to_Pi.bat
#   kopiert SmoothSoundDrops/smoothsounddrops/ und SmoothSoundDrops/Docker/ zu Docker
#
# 3) Docker image build und docker run container...
# StartUp.sh started 
#   - ReplacePlaceholders.sh
#   - npm run build
#   - nginx
# 3.1) ReplacePlaceholders.sh ersetzt
#	- PLACEHOLDER_PROTOCOL
#   - PLACEHOLDER_PATH
#	- PLACEHOLDER_DOMAIN
# in 
#	- nginxConfig.txt
#	- package.json
#

# Use an official Node.js image as the base
# _________________________________________
FROM node AS build

# Install Nginx
RUN apt-get update && apt-get install -y nginx vim dos2unix net-tools && apt-get clean

# Set the working directory
WORKDIR /app

# Copy 
COPY . .

RUN npm install -g create-react-app
RUN npm install -g serve
RUN npm update
RUN npx create-react-app otherapp
RUN cd smoothsounddrops && npm install
#RUN npm run build

RUN chmod +x Docker/StartUp.sh

EXPOSE 80

# Start nginx
#CMD ["nginx", "-g", "daemon off;"]
#CMD ["sh", "-c", "while true; do sleep 10; done"]
CMD ["sh", "-c", "cd Docker && dos2unix StartUp.sh && ./StartUp.sh && while true; do sleep 10; done"]

                      