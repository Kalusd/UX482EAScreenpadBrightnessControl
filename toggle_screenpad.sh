#!/bin/bash

# Chemin vers le fichier de luminosité
BRIGHTNESS_FILE='/sys/class/leds/asus::screenpad/brightness'

# Lire la luminosité actuelle
current_brightness=$(cat $BRIGHTNESS_FILE)

# Basculer la luminosité
if [ "$current_brightness" -eq 0 ]; then
    new_brightness=10
elif [ "$current_brightness" -eq 10 ]; then
    new_brightness=255
else
    new_brightness=0
fi

# Appliquer la nouvelle luminosité
echo $new_brightness | tee $BRIGHTNESS_FILE > /dev/null

sleep 0.5

# Afficher une notification avec la luminosité actuelle sur le premier écran
DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$(id -u)/bus notify-send "Screenpad Brightness" "Current Brightness: $new_brightness"


