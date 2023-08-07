import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';
import HaspButton from './HaspButton';

export default class HaspMsgbox extends HaspObject {
    hasAction = false;
    options = [{ text: "OK" }, { text: "Cancel" }];
    padding = 6;
    margin = 10;
    constructor(config) {
        config.x ??= 40;
        config.y ??= 150;
        config.width ??= 240;
        config.height ??= 150;
        super(config);

        // set the transfomer handlers.
        this.on('transform', (e) => { this.drawButtons(); });
        this.on('transformend', (e) => { this.drawButtons(); });

        this.drawButtons();
    }

    clearButtons() {
        //only remove the buttons
        this.getChildren().forEach(element => {
            if (element instanceof HaspButton) {
                // console.log('delete ' + element.text)
                element.destroy();
            }
        });
    }

    addButton(config) {
        var optionButton = new HaspButton(config);
        optionButton.on('settext', (e) => { this.buttonTextChange(e.target) })

        // optionButton.draggable(false);
        optionButton.canTransform = false;
        optionButton.canDelete = false;
        optionButton.noExport = true;
        optionButton.gridSnap = false;
        optionButton.index = config.index;
        this.add(optionButton);
    }

    drawButtons() {
        this.clearButtons();
        // const totalRowPadding = this.padding * (this.options.length + 1);
        var y = this.height() - 50;
        var x = this.margin;
        const bw = ((this.width()) / (this.options.length)) - (this.margin);
        this.options.forEach((btn, index) => {
            console.log('add ' + btn.text)
            var config = { x: x, y: y, width: bw, type: 'msgbutton', text: btn.text, radius: 20, theme: this.theme, index: index };
            this.addButton(config);
            x += (bw) + this.padding;
        });
    }

    buttonTextChange(button) {
        this.options[button.attrs.index].text = button.text;
    }

    objectExport(page, objectData) {
        //use /n to identify new line
        let options = [];
        this.options.forEach(btn => {
            options.push(btn.text);
        });
        objectData.options = options;
    }
}