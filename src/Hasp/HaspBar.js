import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';
import { Rect } from 'konva/lib/shapes/Rect';

export default class HaspBar extends HaspObject {
    hasAction = false;

    max = 100;
    min = 0;
    val = 0;

    minWidth = 10;
    minHeight = 10;

    isHorizontal = true;

    constructor(config) {
        config.width ??= 200;
        config.height ??= 20;
        config.val ??= 0;
        super(config);
        this.haspid = config.haspid;
        this.setRadius(this.height() / 2);
        this.setFill(this.theme.secondary_color);
        this.hasp_enabled = true;
        this.val = config.val;

        this.valRect = new Konva.Rect({
            id: uuidv4(),
            x: 0,
            y: 0,
            width: (this.val / (this.max - this.min)) * config.width,
            height: config.height,
            fill: this.theme.primary_color,
            draggable: false,
            name: "value",
            type: config.type,
            selectable: false,
            cornerRadius: this.radius,
            listening: false,
        })

        this.on('transform', function () {
            this.adjust();
            this.updateSize();
        });

        this.on('transformend', function () {
            this.adjust();
            this.updateSize();
        });

        this.add(this.valRect);
        this.draggable(true);
    }

    updateSize() {
        if (this.height() < this.width()) {
            this.isHorizontal = true;
            this.valRect.height(this.height())
            this.setRadius(this.height());
            this.valRect.cornerRadius(this.height() / 2);
        } else {
            this.isHorizontal = false;
            this.valRect.width(this.width())
            this.setRadius(this.width());
            this.valRect.cornerRadius(this.width() / 2);
        }
    }

    adjust() {
        this.val = Number(this.val);
        this.min = Number(this.min);
        this.max = Number(this.max);
        if (this.val > this.max)
            this.val = this.max;
        if (this.val < this.min)
            this.val = this.min
        var pos = 0;
        // if (this.height() < this.width()) {
        if (this.isHorizontal) {
            pos = ((this.val - this.min) / (this.max - this.min)) * this.width()
        } else {
            var tval = this.max - this.val;
            pos = ((tval - this.min) / (this.max - this.min)) * this.height()
        }
        this.setBarVal(pos);
        return pos;
    }

    setBarVal(barPos) {
        if (this.isHorizontal) {
            this.valRect.y(0)
            this.valRect.width(barPos);
        } else {
            this.valRect.y(barPos)
            this.valRect.height(this.height() - barPos);
        }
    }

    objectExport(page, objectData) {
        objectData.min = this.min;
        objectData.max = this.max;
        if (this.val > 0)
            objectData.val = this.val;
    }
}