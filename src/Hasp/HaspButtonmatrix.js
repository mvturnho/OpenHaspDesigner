import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';
import { Group } from 'konva/lib/Group';
import HaspButton from './HaspButton';
import MoveButton from '../draw/moveButton';


export default class HaspButtonmatrix extends HaspObject {
    options = [[{ text: "Btn1" }, { text: "Btn2" }, { text: "Btn3" }], [{ text: "Btn4" }, { text: "Btn5" }]];
    padding = 6;
    objectMenu = false;
    hasAction = false;
    // selectedButton;
    // selectedRowCol = { row: 0, col: 0 }

    constructor(config) {
        config.width ??= 200;
        config.height ??= 100;
        super(config);
        //check for options and load the internal structure with the config data
        if (config.options)
            this.loadOptions(config.options);
        // set the transfomer handlers.
        this.on('transform', (e) => { this.drawButtons(); });
        this.on('transformend', (e) => { this.drawButtons(); });

        this.drawButtons();

        this.moveButton = new MoveButton({ x: 0, y: this.height() - 20, width: 20, height: 20 });
        this.add(this.moveButton);
    }

    /**
     * Iterate the config options and for every \n char
     * we create a new row
     * @param {*} options 
     */
    loadOptions(options) {
        this.options = [];
        var row = [];
        this.options.push(row);
        options.forEach(option => {
            if (option === '\n') { //new row for every \n char
                row = [];
                this.options.push(row);
            } else {
                row.push({ text: option })
            }
        });
    }

    clearButtons() {
        //only remove the buttons
        this.getChildren().forEach(element => {
            if (element instanceof HaspButton) {
                // console.log(element)
                element.destroy();
            }
        });
    }

    addButton(config, rowindex, colindex) {
        const matrixButton = new HaspButton(config);
        //no transform functions for this object (size is calculated)
        matrixButton.on('transformstart', (e) => { });
        matrixButton.on('transform', (e) => { })
        matrixButton.on('transformend', (e) => { });
        //position is determined by drag and drop
        matrixButton.on('dragmove', (e) => { this.handleDragMove(e); })
        matrixButton.on('dragstart', (e) => { this.handleDragStart(e); });
        matrixButton.on('dragend', (e) => { this.handleDragEnd(e); });
        matrixButton.on('mousedown', (e) => { this.handleMouseDown(e); })
        matrixButton.on('mouseup', (e) => { this.handleMouseUp(e); });
        matrixButton.on('settext', (e) => { this.buttonTextChange(e.target) })
        matrixButton.setRadius(5)
        matrixButton.canTransform = false;
        matrixButton.canDelete = false;
        matrixButton.noExport = true;
        // matrixButton.draggable(false);
        matrixButton.gridSnap = false;
        matrixButton.row_col = { row: rowindex, col: colindex };
        return matrixButton;
    }

    drawButtons() {
        // console.log(this.options)
        this.clearButtons();

        const totalRowPadding = this.padding * (this.options.length + 1);
        let y = this.padding;
        const bh = (this.height() - totalRowPadding) / this.options.length;
        this.options.forEach((row, rowindex) => {
            let x = this.padding;
            const totalColPadding = this.padding * (row.length + 1);
            const bw = ((this.width() - totalColPadding) / (row.length));
            row.forEach((btn, colindex) => {
                if (btn.object)
                    btn.object.destroy();
                let config = { x: x, y: y, width: bw, height: bh, type: 'matrixbtn', text: btn.text, radius: 0, theme: this.theme };
                const matrixButton = this.addButton(config, rowindex, colindex);
                this.add(matrixButton);
                btn.object = matrixButton;
                x += (bw) + this.padding;// matrixButton.width();
            });
            y += (bh) + this.padding;
        });
        if (this.moveButton) {
            this.moveButton.moveToTop();
            this.moveButton.y(this.height() - 20)
        }
    }

    handleMouseDown(e) {
        // console.log('BM mouseDown')
        // console.log(e)
        // const button = e.currentTarget;
        // if (button instanceof HaspButton) {
        //     console.log('selected button')
        // }
    }

    handleMouseUp(e) {
        // console.log('BM mouseUp')
    }

    handleDragStart(e) {
        this.dragButton = e.target;
        this.dragButton.moveToTop();
    }

    handleDragMove(e) {
        const button = e.target;
        // console.log(button)

        // console.log(shapes)
        if (button.x() < - 20) {
            button.x(-20);
        }
        if (button.y() < -20) {
            button.y(-20);
            // button.rect.fill('green');
        }
        if (button.x() <= -20 && button.y() <= -20) {
            button.rect.fill('red');
        }
        if (button.x() + button.width() > this.width() + 20) {
            button.x(Math.round(this.width() - button.width() + 20));
            // button.rect.fill('red');
        }
        if (button.y() + button.height() > this.height() + 20) {
            button.y(Math.round(this.height() - button.height() + 20));
            // button.rect.fill('green');
        }
    }

    handleDragEnd(e) {
        const button = e.target;
        if (button.x() <= -20 && button.y() <= -20) {
            this.removeButton(button);
        } else {
            if (button.y() <= -20) {
                var objrow = [];
                objrow.push(button);
                this.removeButton(button)
                this.options.splice(0, 0, objrow)
            } else {
                // console.log(button.y() + ' - ' + this.height())
                if (button.y() + button.height() > this.height()) {
                    // console.log('add bott row')
                    var objrow = [];
                    objrow.push(button);
                    this.removeButton(button)
                    this.options.push(objrow);
                }
            }
        }

        //find drop zone
        var pos = this.getStage().getPointerPosition();
        var shapes = this.getStage().getAllIntersections(pos);
        shapes.forEach(shape => {
            if (shape.attrs.type === 'matrixbtn') {
                const object = shape.getParent();
                if (object !== button) {
                    // console.log(shape.getParent().row_col)
                    //insert in row
                    this.insertButtonAfter(button, object.row_col.row, object.row_col.row)
                    //delete from row
                    this.removeButton(button)
                }
            }
        });
        this.cleanupEmptyRows();
        this.drawButtons();

    }

    insertButtonAfter(button, row, col) {
        var objrow = this.options[row];
        if (!objrow) {
            objrow = [];
            this.options.push(objrow);
        }
        objrow.splice(col + 1, 0, button)
    }

    insertButtonBefore(button, row, col) {
        var objrow = this.options[row];
        if (!objrow) {
            objrow = [];
            this.options.push(objrow);
        }
        objrow.splice(col, 0, button)
    }

    removeButton(button) {
        var butrow = this.options[button.row_col.row]
        butrow.splice(button.row_col.col, 1)
    }

    cleanupEmptyRows() {
        var rows = this.options;
        this.options = [];
        rows.forEach(row => {
            if (row.length > 0)
                this.options.push(row)

        });
    }

    buttonTextChange(button) {
        // console.log(button.row_col)
        const rc = button.row_col;
        this.options[rc.row][rc.col].text = button.text;
    }

    addItem(item) {
        if (item instanceof HaspButton) {
            // item.text = 'new';
            this.insertButtonAfter({text:'new'}, 0, 0)
            this.drawButtons();
            // return item;
        }
        return null;
    }

    objectExport(page, objectData) {
        //use /n to identify new line
        let options = [];
        this.options.forEach((row, index) => {
            row.forEach(btn => {
                options.push(btn.object.text);
            });
            if (index < this.options.length - 1)
                options.push("\n");
        });
        objectData.options = options;
    }
}