import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspColorpicker extends HaspObject {
    keepRatio = true;
    canTransform = true;
    hasAction = false;

    padding = 5;
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

        this.ring = new Konva.Ring({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            type: "ring",
            outerRadius: halfWidth - padding ,
            innerRadius: halfWidth - padding  - this.arcWidth,
            fillLinearGradientStartPoint: { x: -50, y: -50 },
            fillLinearGradientEndPoint: { x: 50, y: 50 },
            fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
            // stroke: "black"
            strokeWidth: 0,
            listening: false
        })

        this.center = new Konva.Circle({
            id: uuidv4(),
            x: halfWidth,
            y: halfWidth,
            type: "ring",
            radius: halfWidth* 0.4 ,
            fill: 'red',
            // stroke: "black"
            strokeWidth: 0,
            listening: false
        })

        this.on('transform', function () {
            if (this.scaleX() === 1) {
                const rectWidth = this.rect.width();
                this.redrawObject(rectWidth);
            }
        });

        this.on('transformend', (e) => {
            this.redrawObject(this.getLayer().shadowRectangle.width());
        });

        this.add(this.ring);   
        this.add(this.center);   
        this.draggable(true);
    }

    setPadding(padding) {
        const pad = Number(padding);
        // console.log(this.rect.width())
        if (pad < (this.rect.width() / 4) && pad > 0) {
            this.padding = pad;
            this.redrawObject(this.width())
        }
    }

    redrawObject(width) {
        const halfWidth = (width / 2);
        const padding = this.padding + this.padinc;

        this.ring.x(halfWidth);
        this.ring.y(halfWidth);
        this.ring.outerRadius(halfWidth - padding)
        this.ring.innerRadius(halfWidth - padding - this.arcWidth)

        this.center.x(halfWidth);
        this.center.y(halfWidth);
        this.center.radius(halfWidth * 0.4)
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