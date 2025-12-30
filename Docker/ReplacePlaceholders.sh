
echo " cd ../smoothsounddrops \n npm pkg set 'homepage'='/$PLACEHOLDER_PATH' \n cat package.json \n cd ../Docker" | sed 's/"//g' > _sed.sh
chmod +x _sed.sh
echo "_sed(1): $(cat _sed.sh)" >> /var/startup.log
./_sed.sh

echo "sed -i 's*ph-smooth-path*$PLACEHOLDER_PATH*' ../Docker/nginxConfig.txt" > _sed.sh
chmod +x _sed.sh
echo "_sed(6): $(cat _sed.sh)" >> /var/startup.log
./_sed.sh

