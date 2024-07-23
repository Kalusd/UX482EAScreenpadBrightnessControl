const { St, Clutter, GLib, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;

const BrightnessIndicator = GObject.registerClass(
class BrightnessIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Screenpad Brightness');

        // Create a box to hold the icon and slider
        let box = new St.BoxLayout({
            vertical: false,
            style_class: 'brightness-box',
            x_expand: true,   // Allow the box to expand horizontally
            y_expand: false   // Prevent the box from expanding vertically
        });

        // Create an icon
        this.brightnessIcon = new St.Icon({
            icon_name: 'display-brightness-symbolic', // Use a GNOME symbolic icon
            style_class: 'system-status-icon',
            icon_size: 16
        });

        // Create the slider
        this.brightnessSlider = new Slider.Slider(0.5);
        this.brightnessSlider.connect('notify::value', this._onSliderValueChanged.bind(this));

        // Ensure the slider occupies all available space
        this.brightnessSlider.x_expand = true; // Allow the slider to expand horizontally

        // Create and add a spacer between the icon and the slider
        let spacer = new St.BoxLayout({ 
            style_class: 'brightness-spacer',
            width: 10, // Adjust as necessary
        });

        // Add the icon, spacer, and slider to the box
        box.add_child(this.brightnessIcon);
        box.add_child(spacer);
        box.add_child(this.brightnessSlider);

        // Add the box to the menu item
        this.brightnessMenuItem = new PopupMenu.PopupBaseMenuItem({ activate: false });
        this.brightnessMenuItem.add_child(box);

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
        
        // Execute the command
        GLib.spawn_command_line_async(`/bin/sh -c 'echo ${brightness} | tee /sys/class/leds/asus::screenpad/brightness'`);
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

