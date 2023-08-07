import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspTab extends HaspObject {

    canTransform = false;
    hasAction = false;
    gridSnap = false;

    noObjectExport = true;
    tabview;
    selected = false;
    bgColor = undefined;
    borderColor = undefined;

    constructor(config) {
        config.text_font ??= 20;
        config.text ??= 'Tab';
        config.border_width = undefined;
        super(config);
        // this.rect.opacity(0);
        this.draggable(false);
        this.haspid = config.haspid;
        this.text = config.text;
        this.setBgColor(this.theme.secondary_color);
    }

    setSize(width, height) {
        this.width(width);
        this.height(height);
        this.rect.width(width);
        this.rect.height(height);
    }

    setTextLabel(text) {
        // console.log(text)
        this.tabview.callback(this);
    }

    setSelected(selected) {
        this.selected = selected;
    }

    objectExport(page, objectData) {
        objectData.text = this.text;
        const parent = this.getParent();
        objectData.parentid = parent.haspid;
    }

}