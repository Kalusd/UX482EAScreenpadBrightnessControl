# UX482EAScreenpadBrightnessControl

Cette extension GNOME permet de contrôler la luminosité du Screenpad d'ordinateurs Asus tels que le UX482EA.

## Installation du module noyau asus-wmi

L'installation se fait en suivant les étapes de ce dépôt : [asus-wmi-screenpad](https://github.com/Plippo/asus-wmi-screenpad)  
Pour rendre l'installation plus simple, il est conseillé de désactiver le Démarrage Sécurisé dans le microprogramme BIOS/UEFI.  
J'ai eu quelques problèmes lors de l'installation, l'appareil `/sys/class/leds/asus::screenpad` n'apparaissait pas et le rétro-éclairage du clavier ne fonctionnait plus. Si vous obtenez les mêmes problèmes, suivre les étapes de ce [commentaire](https://github.com/Plippo/asus-wmi-screenpad/issues/50#issuecomment-1710176541) à débloqué la situation de mon côté.  
Vous devriez donc normalement avoir le dossier suivant `/sys/class/leds/asus::screenpad`.

## Script supplémentaire  

Le script ```toggle_screenpad.sh``` permet de basculer entre 3 niveaux prédéterminés de luminosité, d'une façon similaire a ScreenXpert sur Windows.  
Il est possible d'affecter une touche du clavier à ce programme depuis : Paramètres > Clavier > Voir et personnaliser les raccourcis > Raccourcis personnalisés > +  
Puis, donnez un nom à votre raccourci, le champ "Commande" représente le chemin vers le script (ex: ~/toggle_screenpad.sh), et enfin, assignez votre raccourci à une touche ou une combinaison de touche grâce au champ "Raccourci".  

## Installation de l'extension

1. Installez les outils de développement GNOME Shell

```
sudo apt update
sudo apt install gnome-shell-extensions gnome-shell-extension-prefs gnome-tweaks
```

2. Créez le répertoire de l'extension

```
mkdir -p ~/.local/share/gnome-shell/extensions/screenpad-brightness@local
cd ~/.local/share/gnome-shell/extensions/screenpad-brightness@local
```

3. Collez les fichiers nécessaires à l'extension

- _metadata.json_
- _extension.js_
- _schemas/org.gnome.shell.extensions.screenpad-brightness.gschema.xml_

  Vous devriez donc avoir la structure suivante dans le répertoire de l'extension :

```
~/.local/share/gnome-shell/extensions/screenpad-brightness@local/
├── extension.js
├── metadata.json
└── schemas
    └── org.gnome.shell.extensions.screenpad-brightness.gschema.xml
```

4. Compilez le schéma :  
   Le schéma devrait normalement déjà être compilé, mais la commande suivante permet de le compiler au besoin.

```
glib-compile-schemas ~/.local/share/gnome-shell/extensions/screenpad-brightness@local/schemas
```

5. Rechargez GNOME Shell pour détecter la nouvelle extension :

```
gnome-shell --replace &
```

Si la commande précedente n'a pas fonctionné, vous pouvez simplement fermer votre session et vous reconnecter.

6. Activez l'extension via gnome-extensions-app :
   Vous pouvez activer l'extension graphiquement avec :

```
gnome-extensions-app &
```

Ou en ligne de commande avec :

```
gnome-extensions enable screenpad-brightness@local
```

## Emplacement de l'extension
