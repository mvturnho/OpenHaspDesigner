import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspDropdown extends HaspObject {

    listOptions = ["Option1", "Option2", "Option3"];
    itemHeight = 40;
    max_height = 200;

    constructor(config) {
        config.height ??= 40;
        config.bg_color ??= config.theme.secondary_color + '00'
        // config.width ??= 40;
        super(config);
        this.loadOptions(config.options);
        this.load(config);

        this.haspid = config.haspid;
        this.minWidth = 110;
        this.minHeight = this.itemHeight;
        // this.setBgColor(this.theme.primary_color);
        this.drawOptions();

        this.rect.opacity(0.5);

        this.on('transform', (e) => { this.drawOptions(); });
        this.on('transformend', (e) => {
            this.drawOptions();
        });
    }

    load(config){
        if(config.max_height) {
            this.max_height = config.max_height;
            this.height(this.itemHeight+this.max_height)
        }
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
            opacity: 0.5
        })

        const textrect = new Konva.Rect({
            id: uuidv4(),
            x: 2,
            y: 2,
            width: this.width() - 4,
            height: this.itemHeight - 4,
            fill: this.theme.secondary_color,
            draggable: false,
            type: 'text_rect',
            selectable: false,
            listening: false
        });
        this.labelGroup.add(textrect);

        const w = this.width() - 10;
        const label = new Konva.Text({
            id: uuidv4(),
            x: 3,
            y: 0,
            width: w,
            height: this.itemHeight,
            type: 'optionlabel',
            verticalAlign: 'middle',
            text: this.listOptions[0],
            fontSize: 20,
            fontFamily: 'Calibri',
            align: 'left',
            fill: this.theme.bg_color20,
            listening: false,
            strokeWidth: 1
        });
        this.labelGroup.add(label);

        const pd_butt = new Konva.Text({
            id: uuidv4(),
            x: this.width() - 20,
            y: 2,
            width: 10,
            height: this.itemHeight - 4,
            type: 'pd_butt',
            verticalAlign: 'middle',
            text: 'v',
            fontSize: 20,
            fontFamily: 'Calibri',
            align: 'left',
            fill: this.theme.bg_color20,
            listening: true,
            strokeWidth: 1
        });
        pd_butt.on('click', function (evt) {
            evt.cancelBubble = true;
            // console.log('EXPAND')
            this.expand = !this.expand;
        })

        this.labelGroup.add(pd_butt);

        //add rect for pulldown
        this.max_height = this.height() - this.itemHeight;
        const pdrect = new Konva.Rect({
            id: uuidv4(),
            x: 2,
            y: this.itemHeight,
            width: this.width() - 4,
            height: this.max_height,
            fill: '#11ff1111',
            draggable: false,
            type: 'dropdown_rect',
            selectable: false,
            listening: false
        });
        this.labelGroup.add(pdrect);

        const nw = this.width() - 6;
        const numItems = Math.floor(this.max_height / this.itemHeight);
        for (var index = 0; index < numItems && index < this.listOptions.length; index++) {
            const option = this.listOptions[index];
            // console.log(option)
            // let config = { x: 3, y: index * stepY, width: w, height: stepY, type: 'optionlabel', text: option, 'align': 'center' };
            const label = new Konva.Text({
                id: uuidv4(),
                x: 4,
                y: (index + 1) * this.itemHeight,
                width: nw,
                height: this.itemHeight,
                type: 'optionlabel',
                verticalAlign: 'middle',
                text: option,
                fontSize: 20,
                fontFamily: 'Calibri',
                align: 'left',
                fill: this.theme.bg_color20,
                listening: false,
                strokeWidth: 1,
            });
            this.labelGroup.add(label);
        }

        this.add(this.labelGroup);
    }

    objectExport(page, objectData) {
        //use /n to identify new line
        objectData.opacity = undefined;
        objectData.options = this.listOptions.join('\n')
        objectData.h = 40;
        objectData.max_height = this.max_height;
    }

}