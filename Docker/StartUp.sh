echo "$(date) *** In StartUp.sh ..." >> /var/startup.log

echo "$(date) *** Pwd is $(pwd)" >> /var/startup.log

chmod +x ReplacePlaceholders.sh
dos2unix ReplacePlaceholders.sh
echo "$(date) *** LS is $(ls -als)" >> /var/startup.log

./ReplacePlaceholders.sh
echo "$(date) *** ReplacePlaceholders done" >> /var/startup.log
echo "$(date) *** LS is $(ls -als)" >> /var/startup.log

echo "$(date) *** Json is $(cat ../smoothsounddrops/package.json)" >> /var/startup.log

echo "$(date) *** 'npm run build' ..." >> /var/startup.log
cd ../smoothsounddrops
npm run build
echo "$(date) *** 'npm run build' done" >> /var/startup.log
cd ..

echo "$(date) *** Pwd is $(pwd)" >> /var/startup.log
echo "$(date) *** nginxConfig.txt ..." >> /var/startup.log
dos2unix Docker/nginxConfig.txt
cp Docker/nginxConfig.txt /etc/nginx/conf.d/default.conf

echo "$(date) *** NGINX: $(nginx -T)" >> /var/startup.log


echo "$(date) *** Starting nginx ..." >> /var/startup.log
echo "$(date) *** Now you are ready to cUrl into it :-)" >> /var/startup.log
nginx -g "daemon off;"

echo "$(date) *** StartUp.sh done" >> /var/startup.log

