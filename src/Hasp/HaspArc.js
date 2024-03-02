import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

const ARC_MODE_NORMAL = 0;
const ARC_MODE_SYMMETRICAL = 1;
const ARC_MODE_REVERSE = 2;

export default class HaspArc extends HaspObject {
    keepRatio = true;
    canTransform = true;
    hasAction = false;

    min = 0;            //minimum value of the indicator
    max = 100;          //maximum value of the indicator
    val = 0;           //current value of the indicator
    padding = 0;
    padinc = 8;
    arcWidth = 15;
    adjustable = true; //bool	false	Add knob that the user can operate to change the value
    start_angle = 135;   //0-360		start angle of the arc background (see note)
    end_angle = 45;	//end angle of the arc background(see note)
    value_rotation = 0;
    hasp_rotation = 0;

    hasp_type = ARC_MODE_NORMAL;
    hasp_type_options = [
        { value: ARC_MODE_NORMAL, description: "normal" },
        { value: ARC_MODE_SYMMETRICAL, description: "symmetrical" },
        { value: ARC_MODE_REVERSE, description: "reverse" }
    ]

    constructor(config) {
        // console.log('ARC')
        config.border_width ??= 0;
        super(config);
        // console.log(config)
        this.haspid = config.haspid;
        this.hasp_enabled = true;
        this.minWidth = 100;
        this.minHeight = 100;
        config.hasp_rotation ??= this.hasp_rotation;
        // this.setBgColor(this.theme.secondary_color)
        this.hasp_rotation = config.hasp_rotation;
        const halfWidth = config.width / 2;
        const padding = this.padding + this.padinc;

        this.bg_arc = new Konva.Arc({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            type: "arc",
            draggable: false,
            outerRadius: halfWidth - padding,
            innerRadius: halfWidth - padding - this.arcWidth,
            angle: this.end_angle - this.start_angle,
            rotation: this.hasp_rotation,
            fill: this.theme.secondary_color,
            stroke: "black",
            strokeWidth: 0,
        });

        this.indic_arc = new Konva.Arc({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            type: "value",
            outerRadius: halfWidth - padding,
            innerRadius: halfWidth - padding - this.arcWidth,
            angle: 0,
            rotation: this.hasp_rotation,
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

        this.add(this.bg_arc);
        this.add(this.indic_arc);
        this.addKnob();
        this.adjust();
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
                draggable: false,
                stroke: "#dedede",
                strokeWidth: 1,
            });

            //enables the button to change thye value
            // this.knob.on('dragmove', (e) => {
            //     if (this.knob.x() < 0) this.knob.x(0);
            //     if (this.knob.x() > this.width()) this.knob.x(this.width());
            //     const newVal = (this.knob.x() / this.width()) * (this.max - this.min);
            //     this.val = Math.round(newVal);
            //     if (this.val > this.max) this.val = this.max;
            //     if (this.val < this.min) this.val = this.min;
            //     this.adjust();
            // });

            this.add(this.knob);
        }
    }

    /**
     * should tahe into account the gap start_angle end_angle
     */
    getAngle() {
        // const factor = ((this.val - this.min) / (this.max - this.min));
        // const value_angle = factor * (this.end_angle - this.start_angle);

        var angle = this.hasp_rotation;
        if (this.hasp_type === ARC_MODE_REVERSE) {
            angle += this.end_angle;
        } else if (this.hasp_type === ARC_MODE_NORMAL) {
            angle += this.start_angle;
        } else if (this.hasp_type === ARC_MODE_SYMMETRICAL) {
            var bg_end = this.end_angle;
            if (this.end_angle < this.start_angle) {
                bg_end = this.end_angle + 360;
            }
            var angle_midpoint = (this.start_angle + bg_end) / 2;
            angle += angle_midpoint;
        }

        return angle;
    }

    getKnobPos() {
        const halfWidth = this.width() / 2;
        const padding = this.padding + this.padinc;
        var angle = this.getAngle();

        const x = (Math.cos(angle * (Math.PI / 180)) * (halfWidth - padding - (this.arcWidth / 2))) + halfWidth;
        const y = (Math.sin(angle * (Math.PI / 180)) * (halfWidth - padding - (this.arcWidth / 2))) + halfWidth;
        return { x: x, y: y }
    }

    repositionArc(width) {
        const halfWidth = (width / 2);
        const padding = this.padding + this.padinc;
        this.bg_arc.x(halfWidth);
        this.bg_arc.y(halfWidth);
        this.bg_arc.outerRadius(halfWidth - padding)
        this.bg_arc.innerRadius(halfWidth - padding - this.arcWidth)
        this.indic_arc.x(halfWidth);
        this.indic_arc.y(halfWidth)
        this.indic_arc.outerRadius(halfWidth - padding)
        this.indic_arc.innerRadius(halfWidth - padding - this.arcWidth)

        if (this.adjustable) {
            const knobPos = this.getKnobPos()
            this.knob.x(knobPos.x);
            this.knob.y(knobPos.y);
        }
    }

    themeChange(type, value) {
        if (type === 'primary_color') {
            this.indic_arc.fill(this.theme.primary_color)
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

    adjust() {
        this.val = Number(this.val);
        this.min = Number(this.min);
        this.max = Number(this.max);
        this.start_angle = Number(this.start_angle);
        this.end_angle = Number(this.end_angle);
        this.hasp_rotation = Number(this.hasp_rotation);
        this.hasp_type = Number(this.hasp_type);

        var angle = this.end_angle - this.start_angle;
        if (angle < 0) angle += 360;
        var indic_angle = (this.val / (this.max - this.min)) * angle;
        if (indic_angle < 0) indic_angle += 360;
        const rotation = this.hasp_rotation + this.start_angle;
        console.log(rotation + " " + angle)
        this.bg_arc.angle(angle);
        this.bg_arc.rotation(rotation);
        var indic_rotation = this.hasp_rotation + this.start_angle;
        if(this.hasp_type = ARC_MODE_SYMMETRICAL){
            indic_angle = indic_angle /2;
        }
        this.indic_arc.angle(indic_angle);
        this.indic_arc.rotation(indic_rotation);

        if (this.val > this.max) this.val = this.max;
        if (this.val < this.min) this.val = this.min;

        if (this.adjustable) {
            const knobPos = this.getKnobPos()
            this.knob.x(knobPos.x);
            this.knob.y(knobPos.y);
        }

    }

    objectExport(page, objectData, hassConfig) {
        if (this.padding > 0) {
            objectData.pad_top = this.padding;
            objectData.pad_right = this.padding;
            objectData.pad_left = this.padding;
            objectData.pad_bottom = this.padding;
        }
        if (this.adjustable) { objectData.adjustable = this.adjustable; }
        if (this.hasp_type > 0) { objectData.type = this.hasp_type; }
        if (this.min !== 0) { objectData.min = this.min; }
        if (this.max !== 100) { objectData.max = this.max; }
        if (this.val !== 0) { objectData.val = this.val; }

        if (this.start_angle !== 135) { objectData.start_angle = this.start_angle; }
        if (this.end_angle !== 45) { objectData.end_angle = this.end_angle; }
        if (this.hasp_rotation !== 0) { objectData.rotation = this.hasp_rotation; }
    }
}