import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspArc extends HaspObject {
    keepRatio = true;
    canTransform = true;
    hasAction = false;

    min = 0;            //minimum value of the indicator
    max = 100;          //maximum value of the indicator
    val = 0;           //current value of the indicator
    padding = 0;
    padinc = 8 ;
    arcWidth = 15;
    arcRotation = 0;    //offset to the 0 degree position
    arc_type = 0;           //0 = normal, 1 = symmetrical, 2 = reverse
    adjustable = true; //bool	false	Add knob that the user can operate to change the value
    start_angle = 20;   //0-360		start angle of the arc background (see note)
    end_angle = 300;	//end angle of the arc background(see note)
    start_angle10 = 45  //0-360		start angle of the arc indicator (see note)
    value_rotation = 120;
    // start_angle10 = 270 //0-360		start angle of the arc indicator (see note)

    constructor(config) {
        console.log('ARC')
        config.border_width ??= 0;
        super(config);
        // console.log(config)
        this.haspid = config.haspid;
        this.hasp_enabled = true;
        this.minWidth = 100;
        this.minHeight = 100;

        // this.setBgColor(this.theme.secondary_color)

        const halfWidth = config.width / 2;
        const padding = this.padding + this.padinc;

        this.arc = new Konva.Arc({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            type: "arc",
            draggable: false,
            outerRadius: halfWidth - padding ,
            innerRadius: halfWidth - padding - this.arcWidth,
            angle: 300,
            rotation: 120,
            fill: this.theme.secondary_color,
            stroke: "black",
            strokeWidth: 0,
        });

        this.ring = new Konva.Arc({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            type: "value",
            outerRadius: halfWidth - padding ,
            innerRadius: halfWidth - padding  - this.arcWidth,
            angle: this.getAngle(this.val),
            rotation: this.value_rotation,
            fill: this.theme.primary_color,
            // stroke: "black"
            strokeWidth: 0,
        })

        this.on('transform', function () {
            if (this.scaleX() === 1) {
                const rectWidth = this.rect.width();
                this.repositionArc(rectWidth);
            }
        });

        this.on('transformend', (e) => {
            this.repositionArc(this.getLayer().shadowRectangle.width());
        });

        this.add(this.arc);
        this.add(this.ring);
        this.addKnob();
        this.draggable(true);
    }

    addKnob() {
        if (this.knob !== undefined)
            this.knob.destroy();
        if (this.adjustable) {
            const knobPos = this.getKnobPos();
            // console.log(knobPos);
            this.knob = new Konva.Circle({
                id: uuidv4(),
                x: knobPos.x,
                y: knobPos.y,
                radius: this.arcWidth / 2,
                fill: this.theme.knob_color,
                type: "knob",
                draggable: true,
                stroke: "#dedede",
                strokeWidth: 1,
            });

            //enables the button to change thye value
            this.knob.on('dragmove', (e) => {
                if (this.knob.x() < 0) this.knob.x(0);
                if (this.knob.x() > this.width()) this.knob.x(this.width());
                const newVal = (this.knob.x() / this.width()) * (this.max - this.min);
                this.val = Math.round(newVal);
                if (this.val > this.max) this.val = this.max;
                if (this.val < this.min) this.val = this.min;
                this.adjust();
            });

            this.add(this.knob);
        }
    }

    /**
     * should tahe into account the gap start_angle end_angle
     */
    getAngle() {
        const factor = ((this.val - this.min) / (this.max - this.min));
        const angle = factor * (this.end_angle);
        return angle;
    }

    getKnobPos() {
        const halfWidth = this.width() / 2;
        const padding = this.padding + this.padinc;
        const angle = this.getAngle(this.val) + this.value_rotation;

        const x = (Math.cos(angle * (Math.PI / 180)) * (halfWidth - padding - (this.arcWidth / 2))) + halfWidth;
        const y = (Math.sin(angle * (Math.PI / 180)) * (halfWidth - padding - (this.arcWidth / 2))) + halfWidth;
        return { x: x, y: y }
    }

    repositionArc(width) {
        const halfWidth = (width / 2);
        const padding = this.padding + this.padinc;
        this.arc.x(halfWidth);
        this.arc.y(halfWidth);
        this.arc.outerRadius(halfWidth - padding)
        this.arc.innerRadius(halfWidth - padding - this.arcWidth)
        this.ring.x(halfWidth);
        this.ring.y(halfWidth)
        this.ring.outerRadius(halfWidth - padding)
        this.ring.innerRadius(halfWidth - padding - this.arcWidth)

        if (this.adjustable) {
            const knobPos = this.getKnobPos()
            this.knob.x(knobPos.x);
            this.knob.y(knobPos.y);
        }
    }

    themeChange(type, value) {
        if (type === 'primary_color') {
            this.ring.fill(this.theme.primary_color)
        }
    }


    setPadding(padding) {
        const pad = Number(padding);
        // console.log(this.rect.width())
        if (pad < (this.rect.width() / 4) && pad > 0) {
            this.padding = pad;
            this.repositionArc(this.width())
        }
    }

    setHaspAdjustable(adjustable) {
        this.adjustable = Boolean(adjustable);
        this.addKnob();
    }

    setArcType(type) {
        // console.log(type)
        this.arc_type = type;
        if (type == 0) {
            this.value_rotation = 120;
        }
        else if (this.id(type == 1)) {
            this.value_rotation = 280;

        }
        else
            this.value_rotation = 360;
        // this.repositionArc(this.width())
        this.ring.rotation(this.value_rotation)
        if (this.adjustable) {
            const knobPos = this.getKnobPos()
            this.knob.x(knobPos.x);
            this.knob.y(knobPos.y);
        }
    }

    adjust() {
        if (this.val > this.max) this.val = this.max;
        if (this.val < this.min) this.val = this.min;

        if (this.adjustable) {
            const knobPos = this.getKnobPos()
            this.knob.x(knobPos.x);
            this.knob.y(knobPos.y);
        }

        const angle = this.getAngle();
        this.ring.angle(angle);
    }

    objectExport(page,objectData,hassConfig) {
        if (this.padding > 0) {
            objectData.pad_top = this.padding;
            objectData.pad_right = this.padding;
            objectData.pad_left = this.padding;
            objectData.pad_bottom = this.padding;
        }
        if (this.adjustable)
            objectData.adjustable = this.adjustable;

        if (this.arc_type > 0)
            objectData.type = this.arc_type;

        objectData.min = this.min;
        objectData.max = this.max;
        if (this.val > 0)
            objectData.val = this.val;
    }
}