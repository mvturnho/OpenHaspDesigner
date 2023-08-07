import { Group } from 'konva/lib/Group';
import { v4 as uuidv4 } from 'uuid';

export default class MoveButton extends Group {
    type = 'uibutton'
    constructor(config) {
        // config.x = 0;
        // config.y = 0;
        // config.width = 20;
        // config.height = 20;
        super(config);

        this.circle = new Konva.Circle({
            id: uuidv4(),
            x: 10,
            y: 10,
            radius: 10,
            fill: 'green',
            stroke: 'white',
            strokeWidth: 1,
            type: this.type,
            draggable: false,
            page: this,
            listening: true,
        });
        this.add(this.circle);

        var base = this;
        var imageObj = new Image();
        imageObj.onload = function () {
            var image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: 20,
                height: 20,
                type: 'image_image',
                listening: false,
            });
            base.add(image);

            // image.moveToTop();
        };
        imageObj.src = '/media/icons/move.png'
    }

    isType(type) {
        return this.type === type;
    }
}