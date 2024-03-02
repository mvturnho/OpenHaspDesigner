import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';
import { Rect } from 'konva/lib/shapes/Rect';
import { range } from '../utils/utils';

export default class HaspLineMeter extends HaspObject {
    hasAction = false;
    keepRatio = false;
    canTransform = true;

    max = 100;
    min = 0;
    val = 0;
    line_count = 17;
    angle = 240;
    hasp_rotation = 0;
    rot_offset = -90;
    hasp_type = 0;
    hasp_type_options = [
        { value: 0, description: "clock-wise" },
        { value: 1, description: "counter-clock-wise" }
    ]
    // value_string;
    // text = '';

    constructor(config) {
        config.width ??= 100;
        config.height ??= 100;
        config.radius ??= config.width / 2;
        config.text = config.value_str;
        // console.log(config.value_str)
        config.entity_id ??= ''; //make sure this object can set its entityid
        super(config);
        this.minWidth = 50;
        this.minHeight = 50;
        config.hasp_rotation ??= this.hasp_rotation;
        config.angle ??= this.angle;
        config.line_count ??= this.line_count;
        config.min ??= this.min;
        config.max ??= this.max;
        config.val ??= this.val;
        this.text = config.text;
        this.text_font = config.text_font;
        this.haspid = config.haspid;
        this.hasp_enabled = true;
        this.hasp_rotation = config.hasp_rotation;
        this.angle = config.angle;
        this.line_count = config.line_count;
        this.val = config.val;
        this.min = config.min;
        this.max = config.max;

        this.on('transform', function () {
            // if (this.scaleX() === 1) {
            //     const rectWidth = this.rect.width();
            //     this.rect.height(rectWidth);
            //     this.height(rectWidth);
            // }
            this.drawLines();
        });

        this.on('transformend', function () {
            this.drawLines();
        });

        this.draggable(true);

        this.drawLines();
    }

    drawLines() {
        if (this.lineGroup !== undefined)
            this.lineGroup.destroy()
        this.lineGroup = new Konva.Group({
            x: 0,
            y: 0,
            width: this.width(),
            height: this.height(),
        })

        const halfWidth = this.width() / 2;
        // if(this.height() > this.width()){
        //     halfWidth = this.height() / 2;
        // }

        const outerRadius = halfWidth * 0.9;
        const smallInnerRadius = outerRadius - 15;
        // const majorInnerRadius = outerRadius - 15;
        // var innerRadius = majorInnerRadius;

        const tickValues = range(this.min, this.max, this.line_count - 1)
        const majorTicks = range(this.min, this.max, this.label_count - 1)
        // console.log(majorTicks)
        var angle = 0;

        var linecolor = this.theme.tick_color;
        const correctionAngle = this.rot_offset - (-this.hasp_rotation) - (this.angle / 2);
        tickValues.forEach(i => {
            angle = (((i - this.min) / (this.max - this.min)) * this.angle) + correctionAngle;
            if (i >= this.critical_value)
                linecolor = this.theme.primary_color;
            this.drawTick(angle, halfWidth, halfWidth, smallInnerRadius, outerRadius, 4, linecolor);
        });

        this.add(this.lineGroup);
    }

    drawTick(angle, x, y, innerRadius, outerRadius, strokeWidth, linecolor) {
        let x1 = (Math.cos(angle * (Math.PI / 180)) * innerRadius);
        let y1 = (Math.sin(angle * (Math.PI / 180)) * innerRadius);
        let x2 = (Math.cos(angle * (Math.PI / 180)) * outerRadius);
        let y2 = (Math.sin(angle * (Math.PI / 180)) * outerRadius);
        this.lineGroup.add(new Konva.Line({
            x: x,
            y: y,
            points: [x1, y1, x2, y2],
            stroke: linecolor,
            type: 'linemetergroup',
            strokeWidth: strokeWidth,
            tension: 0,
            listening: false,
        }));
    }

    adjust() {
        this.val = Number(this.val);
        this.min = Number(this.min);
        this.max = Number(this.max);
        if (this.val > this.max)
            this.val = this.max;
        if (this.val < this.min)
            this.val = this.min
        this.drawLines();
    }

    setTextLabel(text) {
        this.text = text;
        this.drawLines();
    }


    objectExport(page, objectData) {
        objectData.min = this.min;
        objectData.max = this.max;
        if (this.val > 0) objectData.val = this.val;
        if (this.line_count > 17) objectData.line_cont = this.line_count;
        if (this.text !== '') objectData.value_str = this.text;
        if (this.hasp_type !== 0) objectData.type = this.hasp_type;
        if (this.angle !== 240) objectData.angle = this.angle;
        if (this.hasp_rotation > 0) objectData.rotation = this.hasp_rotation;
    }
}