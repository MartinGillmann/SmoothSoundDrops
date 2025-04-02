
echo "sed -i 's_\"homepage\": \"localhost\"_    \"homepage\":\"pl-protocol;://pl-domain;/pl-path;\"_' ../smoothsounddrops/package.json" > _sed.sh
chmod +x _sed.sh
echo "_sed(1): $(cat _sed.sh)" >> /var/startup.log
./_sed.sh

echo "sed -i 's*pl-protocol;*$PLACEHOLDER_PROTOCOL*' ../smoothsounddrops/package.json" > _sed.sh
chmod +x _sed.sh
echo "_sed(2): $(cat _sed.sh)" >> /var/startup.log
./_sed.sh

echo "sed -i 's*pl-domain;*$PLACEHOLDER_DOMAIN*' ../smoothsounddrops/package.json" > _sed.sh
chmod +x _sed.sh
echo "_sed(3): $(cat _sed.sh)" >> /var/startup.log
./_sed.sh

echo "sed -i 's*pl-path;*$PLACEHOLDER_PATH*' ../smoothsounddrops/package.json" > _sed.sh
chmod +x _sed.sh
echo "_sed(4): $(cat _sed.sh)" >> /var/startup.log
./_sed.sh


echo "sed -i 's*ph-server-name*$PLACEHOLDER_DOMAIN*' ../Docker/nginxConfig.txt" > _sed.sh
chmod +x _sed.sh
echo "_sed(5): $(cat _sed.sh)" >> /var/startup.log
./_sed.sh


echo "sed -i 's*ph-smooth-path*$PLACEHOLDER_PATH*' ../Docker/nginxConfig.txt" > _sed.sh
chmod +x _sed.sh
echo "_sed(6): $(cat _sed.sh)" >> /var/startup.log
./_sed.sh
