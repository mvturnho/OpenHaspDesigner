import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspSpinner extends HaspObject {
    keepRatio = true;
    canTransform = true;
    hasAction = false;

    padding = 10;
    padinc = 8;
    arcWidth = 15;

    constructor(config) {
        console.log('Spinner')
        config.border_width ??= 0;
        config.radius ??= 0;
        super(config);
        this.haspid = config.haspid;
        this.hasp_enabled = true;
        this.minWidth = 100;
        this.minHeight = 100;
        this.setBorderWidth(config.border_width);

        const halfWidth = config.width / 2;
        const padding = this.padding + this.padinc;

        this.spin = new Konva.Arc({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            type: "spinner",
            outerRadius: halfWidth - padding,
            innerRadius: halfWidth - padding - this.arcWidth,
            angle: 60,
            fill: this.theme.primary_color,
            strokeWidth: 0,
        })
        this.ring = new Konva.Ring({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            type: "ring",
            outerRadius: halfWidth - padding ,
            innerRadius: halfWidth - padding  - this.arcWidth,
            fill: this.theme.secondary_color,
            // stroke: "black"
            strokeWidth: 0,
        })

        this.rect.opacity(0)

        this.on('transform', function () {
            if (this.scaleX() === 1) {
                const rectWidth = this.rect.width();
                this.repositionArc(rectWidth);
            }
        });

        this.on('transformend', (e) => {
            this.repositionArc(this.getLayer().shadowRectangle.width());
        });

        var angularSpeed = 100;
        var spin = this.spin;
        var anim = new Konva.Animation(function (frame) {
            var angleDiff = (frame.timeDiff * angularSpeed) / 1000;
            spin.rotate(angleDiff);
        }, this.getLayer());


        this.add(this.ring);
        this.add(this.spin);        
        this.draggable(true);
        anim.start();
    }

    setPadding(padding) {
        const pad = Number(padding);
        // console.log(this.rect.width())
        if (pad < (this.rect.width() / 4) && pad > 0) {
            this.padding = pad;
            this.repositionArc(this.width())
        }
    }

    repositionArc(width) {
        const halfWidth = (width / 2);
        const padding = this.padding + this.padinc;

        this.spin.x(halfWidth);
        this.spin.y(halfWidth)
        this.spin.outerRadius(halfWidth - padding)
        this.spin.innerRadius(halfWidth - padding - this.arcWidth)

        this.ring.x(halfWidth);
        this.ring.y(halfWidth)
        this.ring.outerRadius(halfWidth - padding)
        this.ring.innerRadius(halfWidth - padding - this.arcWidth)
    }

    themeChange(type, value) {
        if (type === 'primary_color') {
            this.spin.fill(this.theme.primary_color)
        }
    }

    objectExport(page,objectData,hassConfig) {
        if (this.padding > 0) {
            objectData.pad_top = this.padding;
            objectData.pad_right = this.padding;
            objectData.pad_left = this.padding;
            objectData.pad_bottom = this.padding;
        }
    }

}