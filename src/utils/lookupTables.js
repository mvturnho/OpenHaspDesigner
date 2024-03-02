
import HaspObject from '../Hasp/HaspObject';
import HaspButton from '../Hasp/HaspButton';
import HaspLabel from '../Hasp/HaspLabel';
import HaspSwitch from '../Hasp/HaspSwitch';
import HaspCheckBox from '../Hasp/HaspCheckbox';
import HaspSlider from '../Hasp/HaspSlider';
import HaspBar from '../Hasp/HaspBar';
import HaspArc from '../Hasp/HaspArc';
import HaspGauge from '../Hasp/HaspGauge';
import HaspLineMeter from '../Hasp/HaspLineMeter';
import HaspTabview from '../Hasp/HaspTabview';
import HaspTab from '../Hasp/HaspTab';
import HaspLed from '../Hasp/HaspLed';
import HaspImage from '../Hasp/HaspImage';
import HaspButtonmatrix from '../Hasp/HaspButtonmatrix';
import HaspMsgbox from '../Hasp/HaspMsgbox';
import HaspKeypad from '../Hasp/HaspKeypad';
import HaspDropdown from '../Hasp/HaspDropdown';
import HaspSpinner from '../Hasp/HaspSpinner';
import HaspRoller from '../Hasp/HaspRoller';
import HaspColorpicker from '../Hasp/HaspColorpicker';


const lookupPageSize = {
    "small_landscape": { w: 320, h: 240, title: "Small 320x240" },
    "small_portrait": { w: 240, h: 320, title: "Small Portrait 240x320" },
    "large_landscape": { w: 480, h: 320, title: "Large Landcape 480x320" },
    "large_portrait": { w: 320, h: 480, title: "Large Portrait 320x480" },
    "large_square": { w: 480, h: 480, title: "Large Square 480x480" },
    "xlarge_landscape": { w: 800, h: 600, title: "X-large Landcape 800x600" },
    "xlarge_portrait": { w: 600, h: 800, title: "X-Large Portrait 600x800" },
}

const objectTypelookup = {
    "obj": HaspObject,
    "btn": HaspButton,
    "label": HaspLabel,
    "switch": HaspSwitch,
    "checkbox": HaspCheckBox,
    'img': HaspImage,
    "bar": HaspBar,
    "slider": HaspSlider,
    "arc": HaspArc,
    "linemeter": HaspLineMeter,
    "tabview": HaspTabview,
    "tab": HaspTab,
    'gauge': HaspGauge,
    'btnmatrix': HaspButtonmatrix,
    'kpad': HaspKeypad,
    'cpicker': HaspColorpicker,
    'dropdown': HaspDropdown,
    'led': HaspLed,
    // 'msgbox': HaspMsgbox,
    'roller': HaspRoller,
    'spinner': HaspSpinner,
}

const lookupIcon = {
    "page": { icon: "media/icons/addPage.png", docicon: "media/hasp/haspPages.png", title: "Base Page object" },
    "obj": { icon: "media/icons/addObject.png", docicon: "media/hasp/haspObject.png", title: "Object to add other object to" },
    "btn": { icon: 'media/icons/addButton.png', docicon: "media/hasp/haspButton.png", title: "Button object" },
    "label": { icon: 'media/icons/addLabel.png', docicon: "media/hasp/haspLabel.png", title: "Label object" },
    "switch": { icon: 'media/icons/addSwitch.png', docicon: "media/hasp/haspSwitch.png", title: "Switch object" },
    "checkbox": { icon: 'media/icons/addCheckbox.png', docicon: "media/hasp/haspCheckbox.png", title: "Checkbox object" },
    'img': { icon: 'media/icons/addImage.png', docicon: "media/hasp/haspImage.png", title: "Image object" },
    "bar": { icon: 'media/icons/addBar.png', docicon: "media/hasp/haspBar.png", title: "Bar object" },
    "slider": { icon: 'media/icons/addSlider.png', docicon: "media/hasp/haspSlider.png", title: "Slider object" },
    "arc": { icon: 'media/icons/addArc.png', docicon: "media/hasp/haspArc.png", title: "Arc object" },
    "linemeter": { icon: 'media/icons/addLinemeter.png', docicon: "media/hasp/haspLinemeter.png", title: "Linemeter object" },
    "tabview": { icon: 'media/icons/addTabview.png', docicon: "media/hasp/haspTabview.png", title: "Tabview object" },
    "tab": { icon: 'media/icons/addTab.png', docicon: "media/hasp/haspTabview.png", title: "Tab object" },
    'gauge': { icon: 'media/icons/addGauge.png', docicon: "media/hasp/haspGauge.png", title: "Gauge object" },
    'btnmatrix': { icon: 'media/icons/addButtonmatrix.png', docicon: "media/hasp/haspButtonmatrix.png", title: "Button Matrix object" },
    'kpad': { icon: 'media/icons/addKeypad.png', docicon: "media/hasp/haspKeypad.png", title: "Keypad Matrix object" },
    'cpicker': { icon: 'media/icons/addCpicker.png', docicon: "media/hasp/haspCpicker.png", title: "Color picker object" },
    'dropdown': { icon: 'media/icons/addDropdown.png', docicon: "media/hasp/haspDropdown.png", title: "Dropdown menu" },
    'led': { icon: 'media/icons/addLed.png', docicon: "media/hasp/haspLed.png", title: "Led menu" },
    'msgbox': { icon: 'media/icons/addMessagebox.png', docicon: "media/hasp/haspMessagebox.png", title: "Messagebox" },
    'roller': { icon: 'media/icons/addRoller.png', docicon: "media/hasp/haspRoller.png", title: "Roller" },
    'spinner': { icon: 'media/icons/addSpinner.png', docicon: "media/hasp/haspSpinner.png", title: "Spinner" },
}

export { objectTypelookup, lookupPageSize, lookupIcon }