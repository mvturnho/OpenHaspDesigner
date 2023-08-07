import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';
import { Rect } from 'konva/lib/shapes/Rect';

export default class HaspLineMeter extends HaspObject {
    keepRatio = true;
    canTransform = true;
    hasAction = false;
    
    max = 100;
    min = 0;
    val = 0;
    line_count = 17;
    angle = 240;
    hasp_type = 0;
    value_string;
    text = '';

    constructor(config) {
        config.width ??= 100;
        config.height ??= 100;
        config.radius ??= config.width / 2;
        super(config);
        config.val ??= this.val;
        this.text_font = config.text_font;
        this.haspid = config.haspid;
        this.hasp_enabled = true;
        this.val = config.val;

        this.on('transform', function () {
            if (this.scaleX() === 1) {
                const rectWidth = this.rect.width();
                this.rect.height(rectWidth);
                this.height(rectWidth);
            }
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
        const outerRadius = halfWidth * 0.8;
        const innerRadius = outerRadius - 15;
        const step = (this.max - this.min) / this.line_count;

        let i = this.min;
        while (i < this.max) {
            var linecolor = this.theme.tick_color;
            if(Number(this.hasp_type) === 0 && i < this.val)
                linecolor=this.theme.primary_color;
            if(Number(this.hasp_type) === 1 && i > (this.max - this.val))
                linecolor=this.theme.primary_color;
            // console.log(i);
            const angle = (i / this.max) * this.angle;
            // console.log(angle);
            let x1 = (Math.cos(angle * (Math.PI / 180)) * innerRadius);
            let y1 = (Math.sin(angle * (Math.PI / 180)) * innerRadius);
            let x2 = (Math.cos(angle * (Math.PI / 180)) * outerRadius);
            let y2 = (Math.sin(angle * (Math.PI / 180)) * outerRadius);
            this.lineGroup.add(new Konva.Line({
                x: halfWidth,
                y: halfWidth,
                points: [x1, y1, x2, y2],
                stroke: linecolor,
                type: 'linemetergroup',
                strokeWidth: 4,
                tension: 0,
                rotation: 90 + ((360 - this.angle) / 2),
                listening: false,
            }));

            i += step;
        }
        if (this.text !== '') {
            let textObj = new Konva.Text({
                x: this.width() / 2,
                height: this.height(),
                type: 'textobj',
                // width: this.width(),
                verticalAlign: 'middle',
                text: this.text,
                fontSize: this.theme.font_size,
                fontFamily: 'Calibri',
                fill: 'white',
                listening: false,
                draggable: true,
                strokeWidth: 1,
                align: this.align,
            });

            textObj.x(halfWidth - (textObj.width() / 2))

            this.lineGroup.add(textObj)
        }
        this.add(this.lineGroup);
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
        if(this.hasp_type !== 0) objectData.type = this.hasp_type;
    }
}