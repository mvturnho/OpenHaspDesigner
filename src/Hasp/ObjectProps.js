import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import { Group } from 'konva/lib/Group';

export default class ObjectProps extends Group {
    textX;
    textY;
    fontsize = 12;
    offset=10;
    width=100;
    height=40;

    constructor(config) {
        super(config);
        const uuid = uuidv4();
        this.id(uuid);
        this.uuid = uuid;
        this.type = "obj_props";

        this.back = new Konva.Rect({
            id: uuidv4(),
            x: this.offset,
            y: this.offset,
            width: this.width,
            height: this.height,
            fill: '#ffffcc',
            stroke: '#ffcc66',
            strokeWidth: 1,
            draggable: false,
            name: "props",
            type: "props",
            selectable: false,
            cornerRadius: 10,
            listening: false,
          });

        this.textX = this.createText(15,15,'x:')
        this.textY = this.createText(50,15,'y:')
        this.textW = this.createText(15,30,'w:')
        this.textH = this.createText(50,30,'h:')

        this.add(this.back);
        this.add(this.textX);
        this.add(this.textY);
        this.add(this.textW);
        this.add(this.textH);
    }

    createText(x1,y1,h1,text){
        return  new Konva.Text({
            x: x1,
            y: y1,
            height: h1,
            text: text,
            fontSize: this.fontsize,
            fontFamily: 'Calibri',
            fill: 'red',
            listening: false,
        });
    }

    setObject(node) {
        if (node) {
            this.update(node);
            this.show();
            this.moveToTop();
        }
    }

    update(node) {
        if (node) {
            // console.log('update')
            this.absolutePosition(node.absolutePosition());
            const y = this.y();
            this.y(y + node.height())
            // this.x(node.getAbsolutePosition().x * node.scaleX());
            // this.y(node.getAbsolutePosition().y + node.height())
            this.textX.text("x:" + Math.round(node.x()));
            this.textY.text("y:" + Math.round(node.y()));
            this.textW.text("w:" + Math.round(node.width()));
            this.textH.text("h:" + Math.round(node.height()));
            this.draw();
        }
    }
}