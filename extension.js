const { St, Clutter, GLib, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;

const BrightnessIndicator = GObject.registerClass(
class BrightnessIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Screenpad Brightness');

        // Add a new menu item
        this.brightnessMenuItem = new PopupMenu.PopupBaseMenuItem({ activate: false });
        this.brightnessSlider = new Slider.Slider(0.5);
        this.brightnessSlider.connect('notify::value', this._onSliderValueChanged.bind(this));
        this.brightnessMenuItem.add(this.brightnessSlider);

        // Insert the new brightness slider below the primary brightness slider
        Main.panel.statusArea.aggregateMenu.menu.addMenuItem(this.brightnessMenuItem, 2);
        this._loadCurrentBrightness();
    }

    _loadCurrentBrightness() {
        let [res, out, err, status] = GLib.spawn_command_line_sync('cat /sys/class/leds/asus::screenpad/brightness');
        if (res) {
            let brightness = parseInt(out.toString().trim());
            this.brightnessSlider.value = (brightness - 10) / 245;
            log(`Screenpad Brightness Extension: Current brightness loaded: ${brightness}`);
        } else {
            log(`Screenpad Brightness Extension: Error loading current brightness: ${err}`);
        }
    }

    _onSliderValueChanged(slider) {
        let brightness = Math.round(slider.value * 245) + 10;
        log(`Screenpad Brightness Extension: Setting brightness to: ${brightness}`);

        // Command to execute
        let command = `python3 ~/.local/share/gnome-shell/extensions/screenpad-brightness@local/set_brightness.py ${brightness}`;
        
        // Execute the command
        
        // GLib.spawn_command_line_async(`echo ${brightness} | tee /sys/class/leds/asus::screenpad/brightness > /dev/null`);
        let debug = GLib.spawn_command_line_async(`/bin/sh -c 'echo ${brightness} | tee /sys/class/leds/asus::screenpad/brightness'`);
        
        log(`debug=${debug}`);

    }
});

function init() {
    log('Screenpad Brightness Extension init');
}

function enable() {
    this._indicator = new BrightnessIndicator();
    Main.panel.addToStatusArea('screenpad-brightness', this._indicator);
    log('Screenpad Brightness Extension enabled');
}

function disable() {
    if (this._indicator) {
        this._indicator.destroy();
        this._indicator = null;
    }
    log('Screenpad Brightness Extension disabled');
}
