import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspLed extends HaspObject {

    constructor(config) {
        config.height ??= 40;
        config.width ??= 40;
        super(config);
        this.haspid = config.haspid;
        this.minWidth = 20;
        this.minHeight = 20;
        this.setBgColor(this.theme.primary_color);
        this.setRadius(this.height() / 2);
    }

}