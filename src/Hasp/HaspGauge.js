import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';
import { Rect } from 'konva/lib/shapes/Rect';
import { range } from '../utils/utils';

export default class HaspGauge extends HaspObject {
    hasAction = false;
    canTransform = true;
    max = 100;
    min = 0;
    val = 0;
    critical_value = 80;
    line_count = 21;
    label_count = 6;
    //angle 180 with rotation 360 should produce flat halvecircle gauge
    // we now have angle cortrect but rotation 330 make it flat
    angle = 240;
    hasp_rotation = 0;
    rot_offset = -90;

    constructor(config) {
        config.width ??= 100;
        config.height ??= 100;
        config.radius ??= config.width / 2;
        config.entity_id ??= ''; //make sure this object can set its entityid
        super(config);
        config.hasp_rotation ??= this.hasp_rotation;
        config.angle ??= this.angle;
        config.line_count ??= this.line_count;
        config.label_count ??= this.label_count;
        config.min ??= this.min;
        config.max ??= this.max;
        config.critical_value ??= this.critical_value;
        config.val ??= this.val;
        config.text_font ??= 20;
        this.text_font = config.text_font;
        this.haspid = config.haspid;
        this.hasp_enabled = true;
        this.hasp_rotation = config.hasp_rotation;
        this.angle = config.angle;
        this.line_count = config.line_count;
        this.label_count = config.label_count;
        this.min = config.min;
        this.max = config.max;
        this.critical_value = config.critical_value;
        this.val = config.val;

        this.on('transform', function () {
            // if (this.scaleX() === 1) {
                // const rectWidth = this.rect.width();
                // this.rect.height(rectWidth);
                // this.height(rectWidth);
            // }
            this.drawLines();
            this.drawNeedle();
        });

        this.on('transformend', function () {
            this.drawLines();
            this.drawNeedle();
        });

        this.draggable(true);

        this.drawLines();

        this.drawNeedle();
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
        const outerRadius = halfWidth * 0.9;
        const smallInnerRadius = outerRadius - 8;
        const majorInnerRadius = outerRadius - 15;
        var innerRadius = majorInnerRadius;

        const tickValues = range(this.min, this.max, this.line_count - 1)
        const majorTicks = range(this.min, this.max, this.label_count - 1)
        // console.log(tickValues)
        // console.log(majorTicks)
        var angle = 0;

        var linecolor = this.theme.tick_color;
        const correctionAngle = this.rot_offset - this.hasp_rotation - (this.angle / 2);
        tickValues.forEach(i => {
            angle = (((i - this.min) / (this.max - this.min)) * this.angle) + correctionAngle;
            if (i >= this.critical_value)
                linecolor = this.theme.primary_color;
            this.drawTick(angle, halfWidth, halfWidth, smallInnerRadius, outerRadius, 4, linecolor);
        });

        linecolor = this.theme.tick_color;
        majorTicks.forEach(i => {
            angle = (((i - this.min) / (this.max - this.min)) * this.angle) + correctionAngle;
            if (i >= this.critical_value)
                linecolor = this.theme.primary_color;
            this.drawTick(angle, halfWidth, halfWidth, majorInnerRadius, outerRadius, 6, linecolor);
            this.drawLabel(angle, halfWidth, halfWidth, innerRadius - 5, this.theme.bg_color20, Math.round(i));
        });

        var criticalangle = (((this.critical_value - this.min) / (this.max - this.min)) * this.angle) + correctionAngle;
        this.drawCriticalArc(angle - criticalangle, criticalangle, halfWidth, halfWidth, outerRadius, this.theme.primary_color)

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

    drawLabel(angle, x, y, radius, color, text) {
        let lx1 = (Math.cos(angle * (Math.PI / 180)) * radius);
        let ly1 = (Math.sin(angle * (Math.PI / 180)) * radius);
        const textObj = new Konva.Text({
            x: x + lx1,
            y: y + ly1,
            type: 'textobj',
            verticalAlign: 'left',
            text: text,
            fontSize: 14,
            fontFamily: 'Calibri',
            fill: color,
            listening: false,
            strokeWidth: 1,
        });

        textObj.x(textObj.x() - (textObj.width() / 2))

        this.lineGroup.add(textObj);
    }

    drawCriticalArc(lineAngle, criticalangle, x, y, radius, color) {
        // console.log(lineAngle, criticalangle)
        this.lineGroup.add(new Konva.Arc({
            id: uuidv4(),
            x: x,
            y: y,
            type: "value",
            outerRadius: radius,
            innerRadius: radius - 5,
            angle: lineAngle,
            rotation: criticalangle,
            fill: color,
            strokeWidth: 0,
        }));

    }

    drawNeedle() {
        const linecolor = this.theme.gauge_needle_color;
        const strokeWidth = 5;
        const halfWidth = this.width() / 2;
        const outerRadius = halfWidth * 0.8;
        const angle = (((this.val - this.min) / (this.max - this.min)) * this.angle) + this.rot_offset - this.hasp_rotation - (this.angle / 2);;
        let x1 = (Math.cos(angle * (Math.PI / 180)) * 2);
        let y1 = (Math.sin(angle * (Math.PI / 180)) * 2);
        let x2 = (Math.cos(angle * (Math.PI / 180)) * outerRadius);
        let y2 = (Math.sin(angle * (Math.PI / 180)) * outerRadius);

        this.lineGroup.add(new Konva.Line({
            x: halfWidth,
            y: halfWidth,
            points: [x1, y1, x2, y2],
            stroke: linecolor,
            type: 'needle',
            strokeWidth: strokeWidth,
            // tension: 0,
            listening: false,
        }));

        this.lineGroup.add(new Konva.Circle({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            radius: (this.height()) * 0.02,
            stroke: linecolor,
            fill: 'white',
            type: "needle_center",
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
        this.drawNeedle();
    }


    objectExport(page, objectData) {
        if(this.min !== 0) objectData.min = this.min;
        if(this.max !== 100) objectData.max = this.max;
        if (this.val > 0) objectData.val = this.val;
        if (this.critical_value !== 80) objectData.critical_value = this.critical_value;
        if (this.line_count !== 21) objectData.line_count = this.line_count;
        if (this.label_count !== 6) objectData.label_count = this.label_count;
        if (this.text !== '') objectData.value_str = this.text;
        if (this.hasp_type !== 0) objectData.type = this.hasp_type;
        if (this.hasp_rotation > 0) objectData.rotation = this.hasp_rotation;
        if (this.angle !== 240) objectData.angle = this.angle;
        if (this.text_font !== undefined) objectData.text_font = this.text_font;
        
        if(this.rect.cornerRadius() === this.height() / 2) objectData.radius = undefined ;
    }

    // - obj: "p4b10" # Power gauge
    //   properties:
    //     "val": '{{ states("sensor.shp6_02_power") }}'
    hassConfigExport(page,hassConfig){
        // if (this.hass_entityid !== '') {
          let object = {};
          object.obj = 'p' + page.haspid + 'b' + this.haspid + ' # Gauge';
          object.properties = {};
          object.properties.val = '{{ states("' + this.hass_entityid + '") }}';
        //   hassConfig.push(object)
        // }
      }
      
}