import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspLabel extends HaspObject {

  text = 'Label';
  mode = 'expand';
  align = 'center';
  fgColor = 'white';

  constructor(config) {
    config.width ??= 100;
    config.height ??= 40;
    config.text ??= 'Label'
    config.border_width ??= 0
    super(config);
    this.haspid = config.haspid;
    this.setRadius(config.radius);
    this.rect.opacity(0);
    this.setBorderWidth(config.border_width);
    this.bgColor = undefined;
    this.text = config.text;
    this.hasp_enabled = true;

    this.textObj = new Konva.Text({
      x: 0,
      y: 8,
      verticalAlign: 'middle',
      text: this.text,
      fontSize: this.theme.font_size,
      fontFamily: 'Calibri',
      fill: this.fgColor,
      listening: false,
      draggable: false,
      align: this.align,
      strokeWidth: 0,
    });

    // this.rect.size(this.textObj.size())

    this.add(this.textObj);
    this.draggable(true);
  }

  setTextLabel(text) {
    this.text = text;
    this.textObj.setAttr('text', text);
    this.width(this.textObj.width())
  }

  setFgColor(color) {
    this.fgColor = color;
    this.textObj.fill(this.fgColor)
  }

}