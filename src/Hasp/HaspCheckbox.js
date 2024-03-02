import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspCheckBox extends HaspObject {

  canTransform = false;
  toggle = false;
  checked = false;
  text = "Check box";

  constructor(config) {
    config.height = config.width = 30;
    config.border_width ??= 0;
    config.radius ??= 0;
    config.border_color ??= undefined;
    config.border_width ??= undefined;

    super(config);
    this.haspid = config.haspid;

    this.rect.opacity(0);
    this.setRadius(5);
    // this.border_color = this.theme.border_color;
    if (config.text) this.text = config.text;

    this.checkBoxRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: config.width,
      height: config.height,
      // fill: this.bg_color,
      stroke: this.theme.primary_color,
      strokeWidth: 2,
      cornerRadius: this.radius,
    })

    this.textObj = new Konva.Text({
      x: config.width + 5,
      y: 10,
      height: 15,
      // width: 20,
      verticalAlign: 'middle',
      text: this.text,
      fontSize: 20,
      fontFamily: 'Calibri',
      fill: 'white',
      listening: false,
      draggable: false,
      strokeWidth: 1,
      align: this.align,
    });
    this.add(this.checkBoxRect);
    this.add(this.textObj);
    this.rect.width(this.textObj.width() + this.checkBoxRect.width() + 10)
    this.width(this.rect.width())
    this.draggable(true);
  }

  setTextLabel(text) {
    this.text = text;
    this.textObj.setAttr('text', text);
    this.rect.width(this.width())
  }

  setChecked(state) {
    this.checked = state;
    if (state) {
      this.checkBoxRect.fill(this.theme.primary_color);
    } else {
      this.checkBoxRect.fill(this.theme.secondary_color);
    }
  }

  objectExport(page, objectData) {
    objectData.bg_color = undefined;
    objectData.w = undefined;
    objectData.h=undefined;
    objectData.opacity = undefined;
    // objectData.border_color = undefined;
}
}