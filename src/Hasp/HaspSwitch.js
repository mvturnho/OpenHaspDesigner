import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspSwitch extends HaspObject {
    hasAction = false;
    knob;
    bg_color20;
    bg_color10; //active bg_color

    constructor(config) {
        config.width ??= 80;
        config.height ??= 40;
        super(config);
        this.haspid = config.haspid;
        config.entity_id ??= ''; //make sure this object can set its entityid
        this.setRadius(this.height() / 2);
        this.setFill(this.theme.secondary_color);
        // this.setType(config.type);
        config.bg_color10 ??= this.theme.bg_color10_switch
        config.bg_color20 ??= this.theme.bg_color20_switch

        this.bg_color10 = config.bg_color10;
        this.bg_color20 = config.bg_color20;
        this.hasp_enabled = true;

        this.knob = new Konva.Circle({
            id: uuidv4(),
            x: this.height() / 2,
            y: this.height() / 2,
            radius: (this.height() / 2) * 0.95,
            fill: this.bg_color20,
            type: "knob",
            draggable: false,
            listening: false,
        });

        this.on('transform', function () {
            const halfheight = this.height() / 2;
            this.setRadius(halfheight);
            this.knob.radius(halfheight * 0.95);
            this.knob.x(halfheight);
            this.knob.y(halfheight);
        });

        this.on('transformend', (e) => {
            // this.getLayer().transformEnd(this)
            const halfheight = this.height() / 2;
            this.setRadius(halfheight);
            this.knob.radius(halfheight * 0.95);
            this.knob.x(halfheight);
            this.knob.y(halfheight);
        });

        this.on('bg_color20', (e) => {
            // console.log(e)
            this.knob.fill(this.bg_color20);
        })

        this.add(this.knob);
        this.draggable(true);
    }

    // objectExport(page, objectData) {
    //     objectData.bg_color10 = this.bg_color10;
    //     objectData.bg_color20 = this.bg_color20;
    // }
}