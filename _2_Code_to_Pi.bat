@echo off
SET OrdnerPfad1=smoothsounddrops\node_modules
SET OrdnerPfad2=smoothsounddrops\build

IF EXIST "%OrdnerPfad1%" (
    echo Der Ordner ''%OrdnerPfad1%' existiert. Breche ab.
	pause
    exit /b
)
IF EXIST "%OrdnerPfad2%" (
    echo Der Ordner ''%OrdnerPfad2%' existiert. Breche ab.
	pause
    exit /b
)

echo Die Ordner existiert nicht. Fahre fort...

pscp -r smoothsounddrops\ pi@10.41.11.54:/home/pi/Docker/SmoothSoundDrops/smoothsounddrops/
pscp -r Docker\ pi@10.41.11.54:/home/pi/Docker/SmoothSoundDrops/Docker/

pause
