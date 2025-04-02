echo "In StartUp.sh ..." >> /var/startup.log

echo "Pwd is $(pwd)" >> /var/startup.log

chmod +x ReplacePlaceholders.sh
dos2unix ReplacePlaceholders.sh
echo "LS is $(ls -als)" >> /var/startup.log

./ReplacePlaceholders.sh
echo "ReplacePlaceholders done" >> /var/startup.log
echo "LS is $(ls -als)" >> /var/startup.log

echo "Json is $(cat ../smoothsounddrops/package.json)" >> /var/startup.log

echo "'npm run build' ..." >> /var/startup.log
cd ../smoothsounddrops
npm run build
echo "'npm run build' done" >> /var/startup.log
cd ..

echo "Pwd is $(pwd)" >> /var/startup.log
echo "nginxConfig.txt ..." >> /var/startup.log
dos2unix Docker/nginxConfig.txt
cp Docker/nginxConfig.txt /etc/nginx/conf.d/default.conf

echo "NGINX: $(nginx -T)" >> /var/startup.log


echo "Starting nginx ..." >> /var/startup.log
nginx -g "daemon off;"

echo "StartUp.sh done" >> /var/startup.log

