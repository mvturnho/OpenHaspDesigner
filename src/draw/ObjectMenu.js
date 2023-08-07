import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import { Group } from 'konva/lib/Group';

/**
 * Object to show some onscreen object related menu.
 */
export default class ObjectMenu extends Group {
    node;
    constructor(menu) {
        super(menu)
        this.visible(false);
        this.add(new Konva.Rect({
            id: uuidv4(),
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            fill: '#a5d6a7',
            stroke: 'gray',
            strokeWidth: 1,
            draggable: true,
            name: "object_menu",
            type: "object_menu",
            selectable: false,
            cornerRadius: 10,
            listening: true,
            opacity: 0.8,
        }));
    }

    isType() {
        return ('menu')
    }

    follow() {
        if (this.node) {
            this.visible(true);
            var pos = this.node.getAbsolutePosition();
            pos.x += this.node.width() + 45;
            this.position(pos);
        }
    }

    setNode(node) {
        if (node) {
            this.visible(true);
            this.moveToTop();
            this.node = node;
        } else {
            this.visible(false);
            this.node = undefined
        }
    }

    isSameNode(node) {
        return node === this.node;
    }
}