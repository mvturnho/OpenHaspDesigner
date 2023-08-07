import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspBar from './HaspBar';
// import { Rect } from 'konva/lib/shapes/Rect';
import mustache from 'mustache'

export default class HaspSlider extends HaspBar {
    //styles
    hasAction = false;
    bg_color20 = "white";

    constructor(config) {
        config.entity_id ??= ''; //make sure this object can set its entityid
        super(config);
        this.knob = new Konva.Circle({
            id: uuidv4(),
            x: 0,
            y: (this.height() / 2),
            radius: (this.height()) * 0.8,
            stroke: this.borderColor,
            strokeWidth: this.borderWidth,
            fill: this.theme.bg_color20,
            type: "knob",
            draggable: true,
        });

        //enables the button to change thye value
        this.knob.on('dragmove', (e) => {
            if (this.height() < this.width()) {
                this.knob.y((this.height() / 2))
                if (this.knob.x() < 0) this.knob.x(0);
                if (this.knob.x() > this.width()) this.knob.x(this.width());
                const newVal = (this.knob.x() / this.width()) * (this.max - this.min);
                this.val = Math.round(newVal);
                const pos = super.adjust();
                this.knob.x(pos);
            } else {
                this.knob.x((this.width() / 2))
                if (this.knob.y() < 0) this.knob.y(0);
                if (this.knob.y() > this.height()) this.knob.y(this.height());
                const newVal = (this.knob.y() / this.height()) * (this.max - this.min);
                this.val = Math.round(newVal);
                const pos = super.adjust();
                this.knob.y(pos);
            }
        });


        this.bg_color20 = this.theme.bg_color20;

        this.updateSize()

        this.add(this.knob);
    }

    updateSize() {
        super.updateSize();
        //vertical
        if (this.width() < this.height()) {
            const halfwidth = this.width() / 2;
            const pos = (this.val / (this.max - this.min)) * this.width()
            this.setRadius(this.width());
            this.knob.radius(this.width() * 0.7);
            this.knob.x(halfwidth);
            this.knob.y(pos);
            this.setBarVal(pos);
        } else {
            const halfheight = this.height() / 2;
            const pos = (this.val / (this.max - this.min)) * this.height()
            this.setRadius(this.height());
            this.knob.radius(this.height() * 0.7);
            this.knob.x(pos);
            this.knob.y(halfheight);
            this.setBarVal(pos);
        }
    }

    adjust() {
        const x = super.adjust();
        this.knob.x(posx);
    }

    async hassConfigExport(page, hassConfig) {
        console.log('mustache')
        mustache.tags = ["[[", "]]"];
        await fetch('/media/templates/slider.mustache')
            .then((response) => response.text())
            .then((template) => {
                const rendered = mustache.render(template, { page_id: page.haspid, haspid: this.haspid, hass_entityid: this.hass_entityid });
                // console.log(rendered);
                hassConfig.push(rendered)
            });

    }
}