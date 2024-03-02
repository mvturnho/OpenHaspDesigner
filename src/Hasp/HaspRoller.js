import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspRoller extends HaspObject {

    listOptions = ["Option1", "Option2", "Option3"];
    itemHeight = 30;

    // bg_color20 = "white";

    constructor(config) {
        config.height ??= 60;
        super(config);
        this.loadOptions(config.options);
        this.haspid = config.haspid;
        this.minWidth = 100;
        this.minHeight = 60;
        this.setBgColor(this.theme.primary_color);
        this.drawOptions();

        this.on('transform', (e) => { this.drawOptions(); });
        this.on('transformend', (e) => { this.drawOptions(); });
    }

    redraw(args) {
        this.drawOptions();
    }

    drawOptions() {
        if (this.labelGroup !== undefined)
            this.labelGroup.destroy()
        this.labelGroup = new Konva.Group({
            x: 0,
            y: 0,
            width: this.width(),
            height: this.height(),
        })
        // this.clearLabels();
        const w = this.width() - 6;
        const numItems = Math.floor(this.height() / this.itemHeight);
        const stepY = this.itemHeight;
        for (var index = 0; index < numItems && index < this.listOptions.length; index++) {
            const option = this.listOptions[index];
            // console.log(option)
            // let config = { x: 3, y: index * stepY, width: w, height: stepY, type: 'optionlabel', text: option, 'align': 'center' };
            const label = new Konva.Text({
                id: uuidv4(),
                x: 3,
                y: index * stepY,
                width: w,
                height: stepY,
                type: 'optionlabel',
                verticalAlign: 'middle',
                text: option,
                fontSize: 20,
                fontFamily: 'Calibri',
                align: 'center',
                fill: this.theme.bg_color20,
                listening: false,
                strokeWidth: 1,
            });
            label.noExport = true;
            this.labelGroup.add(label);
        }
        this.add(this.labelGroup);
    }


    /**
     * Iterate the config options and for every \n char
     * we create a new item
     * @param {*} options 
     */
    loadOptions(options) {
        if (options) {
            this.listOptions = [];
            const opt_list = options.split('\n')
            opt_list.forEach(option => {
                if (option !== '\n') { //new row for every \n char
                    this.listOptions.push(option)
                }
            });
        }
    }

    objectExport(page, objectData) {
        //use /n to identify new line
        objectData.options = this.listOptions.join('\n');
    }

}