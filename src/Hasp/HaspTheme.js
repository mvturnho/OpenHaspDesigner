export default class HaspTheme {
    haspdark = {
        COLOR_SCR: '0x545b6a',
        COLOR_SCR_GRAD: '#222b3a',
        COLOR_SCR_TEXT: '#3b3e42',
        COLOR_BTN_BORDER_PR: '#5f656e',
        COLOR_BG_BORDER: '#808a97',
        BORDER_WIDTH: 2
    }

    page_color = '#42495a';
    primary_color = "#00aaff";
    bg_color = "#5a6173";
    secondary_color = "#4b4b4b";
    bg_color10 = this.bg_color;
    bg_color20 = "#ffffff"; //knobcolor
    tick_color = "#8c8a8c";
    knob_color = "#5a6173";
    border_color = '#848a94';
    gauge_label_color = '#ffffff';
    gauge_needle_color = '#ffffff';

    bg_color10_switch = this.primary_color;
    bg_color20_switch = this.bg_color20
    
    font_size = 24;
    border_width = 1;
    radius = 5;

    changeListeners = new Array();

    addChangeListener(object) {
        this.changeListeners.push(object);
    }

    colorChange(type, color) {
        console.log(color)
        console.log(this.layer)
        this.changeListeners.forEach(object => {
            console.log(object.type)
            object.themeChange(type, color);
        });
    }
}