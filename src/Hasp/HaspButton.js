import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

import mustache from 'mustache'

export default class HaspButton extends HaspObject {
  hasAction = true;
  toggle = false;
  text = 'Button';
  mode = 'expand';
  align = 'center';
  fgColor = 'white';

  constructor(config) {
    config.text_font ??= 20;

    config.width ??= 100;
    config.height ??= 40;
    config.text ??= 'Button';
    config.entity_id ??= ''; //make sure this object can set its entityid
    config.radius ??= config.theme.button_radius;
    super(config);
    this.haspid = config.haspid;
    
    this.text = config.text;
    this.hasp_enabled = true;

    this.textObj = new Konva.Text({
      x: 0,
      height: this.height(),
      width: this.width(),
      verticalAlign: 'middle',
      text: this.text,
      fontSize: config.text_font,
      fontFamily: 'Calibri',
      fill: this.fgColor,
      listening: false,
      draggable: false,
      strokeWidth: 1,
      align: this.align,
    });

    this.on('transform', function () {
      // console.log('transform TEXT');
      this.textObj.height(this.height())
      this.textObj.width(this.width())
    });

    this.on('settext', function () {
      this.textObj.setAttr('text', this.text);
    })

    this.add(this.textObj);
    this.draggable(true);
  }

  setTextLabel(text) {
    this.text = text;
    const event = new Event("settext");
    this.dispatchEvent(event);
  }

  setFgColor(color) {
    this.save_text_color = true;
    this.fgColor = color;
    this.textObj.fill(this.fgColor)
  }

  setToggle(toggle) {
    // console.log(toggle)
    this.toggle = toggle;
  }

  async hassConfigExport() {
    console.log('mustache')
    mustache.tags = ["[[", "]]"];
    return fetch('/media/templates/button.mustache').then((template) => template.text());
  }

}