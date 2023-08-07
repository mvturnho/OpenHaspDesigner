import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import { Group } from 'konva/lib/Group';
import { componentToHex, splitColorOpa } from '../utils/color'

export default class HaspObject extends Group {
  hass_entityid = undefined;
  top_haspid = 1;
  haspid;
  uuid;
  type;
  canTransform = true;
  canDelete = true;
  gridSnap = true;
  hasAction = true;
  child_haspid;
  theme;
  // bgColor = '#111111ff';
  event = '';
  command = '';
  enabled = true;

  border_width = 0;
  radius = 5;
  bg_color;         //bgcolor is hex8
  border_color;     //color	Specifies the color of the border
  border_opa;       //uint8	Specifies opacity of the border
  border_width;     //uint8	Set the width of the border 
  border_post;      //	bool	If true the border will be drawn after all children have been drawn.
  border_side = 15; //uint8	Specifies which sides of the border to draw.A sum of these values is also possible to select specific sides.
  // 0 = none
  // 1 = bottom
  // 2 = top
  // 4 = left
  // 8 = right
  // 15 = full
  scaledX = 1;
  scaledY = 1;
  minWidth = 40;
  minHeight = 20;

  constructor(config) {
    config.x ??= 0;
    config.y ??= 0;
    config.width ??= 100;
    config.height ??= 100;
    config.radius ??= config.theme.radius;
    config.bg_color ??= config.theme.bg_color;
    config.border_color ??= config.theme.border_color;
    config.border_width ??= config.theme.border_width;

    if (config.opacity !== undefined)
      config.opacity = config.opacity;
    else
      config.opacity = 255;

    super(config);
    const uuid = uuidv4();
    this.id(uuid);
    this.uuid = uuid;

    this.haspid = config.haspid;
    this.theme = config.theme;
    this.theme.addChangeListener(this);
    this.type = config.type;
    if (config.action) {
      Object.entries(config.action).forEach(([key, value]) => {
        // console.log(key, value);
        this.action = key;
        this.command = value;
      });
    }
    //check if we have an entityid
    if (config.entity_id !== undefined) {
      this.hass_entityid = config.entity_id;
    }

    this.radius = config.radius;
    this.border_width = config.border_width;
    this.border_color = config.border_color;
    //config.bg_color is hex6 add opacity to make hex8
    this.bg_color = config.bg_color + config.opacity.toString(16);
    // console.log(this.bg_color)

    this.rect = new Konva.Rect({
      id: uuidv4(),
      uuid: uuid,
      x: 0,
      y: 0,
      width: config.width,
      height: config.height,
      fill: 'grey',
      stroke: this.border_color,
      strokeWidth: config.borderWidth,
      draggable: false,
      name: "rect",
      type: this.type,
      selectable: true,
      cornerRadius: config.radius,
      listening: true,
      opacity: 1,
    });

    //need to filter opacity
    this.setBgColor();

    this.on('transformstart', (e) => {
      // console.log('transform start');
      this.getLayer().transformStart(this)
    });

    this.on('transform', (e) => {
      // console.log('transform');
      this.scaledX = this.scaleX();
      this.scaledY = this.scaleY();
      const scaleX = this.scaleX();
      const scaleY = this.scaleY();
      const width = this.width();
      const height = this.height();

      const x = Math.round(this.x());
      const y = Math.round(this.y());
      var scaledWidth = Math.round(width * scaleX);
      var scaledHeight = Math.round(height * scaleY);

      if (scaledWidth < 0 || scaledHeight < 0)
        return

      this.x(x);
      this.y(y);

      if (scaledWidth < this.minWidth)
        scaledWidth = this.minWidth;
      if (scaledHeight < this.minHeight)
        scaledHeight = this.minHeight

      const newSize = { width: scaledWidth, height: scaledHeight };

      this.rect.size(newSize)
      this.size(newSize)

      this.getLayer().transformStart(this)

      if (this.rect.cornerRadius() > this.height() / 2) {
        this.rect.cornerRadius(this.height() / 2);
      }

      this.scaleX(1);
      this.scaleY(1);
    });

    this.on('transformend', (e) => {
      // console.log('transform end');
      this.getLayer().transformEnd(this)
    });

    this.on('showid', (e) => {
      console.log('showid');
      this.showIdHandler(e);
    });

    this.add(this.rect);
    this.addIdText(config);
    this.draggable(true);
  }

  addIdText(config) {
    this.idTextObj = new Konva.Text({
      x: 2,
      y: 2,
      verticalAlign: 'left',
      text: this.haspid,
      fill: '#fcf803',
      stroke: 'black',
      fontFamily: "Arial",
      fontStyle: "bold",
      fontSize: 18,
      strokeWidth: 0.5,
      listening: false,
      visible: config.show_id,
    });

    this.add(this.idTextObj);
    // this.idTextObj.moveToTop();
  }

  updateId(id) {
    this.haspid = id;
    this.idTextObj.setAttr('text', id);
    this.idTextObj.moveToTop();
  }

  showIdHandler(e) {
    // console.log(e);
    if (e.evt.showId) {
      this.idTextObj.show();
      this.idTextObj.moveToTop();
    } else {
      this.idTextObj.hide();
    }

    const event = new Event("showid");
    event.showId = e.evt.showId;
    this.getChildren().forEach(element => {
      if (element instanceof HaspObject) {
        element.dispatchEvent(event);
      }
    });
  }

  addItem(item) {
    this.top_haspid = item.haspid + 1;
    if (!this.isType("tabview") && item.isType("tab")) //tab object may only be added to tabview
      return;
    this.add(item);
    return item;
  }

  getNextId() {
    // this.top_haspid++;
    return this.top_haspid++;
  }

  isType(type) {
    return this.type === type;
  }

  isContainer() {
    return this.isType("page") || this.isType("obj") || this.isType("tabview") || this.isType("tab") || this.isType("btnmatrix")
  }

  layerMoveDown() {
    // console.log("DOWN ");
    // console.log(this.zIndex())
    // console.log(this.getParent().zIndex())
    if (this.zIndex() > this.getParent().zIndex()) {
      this.moveDown();
    }
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }

  setNewSize(size) {
    this.rect.size(size);
    this.size(size);
    // this.rect.width(size.width);
    // this.rect.height(size.height)
    // this.width(size.width);
    // this.height(size.height);
  }

  setRadius(radius) {
    this.radius = Number(radius);
    if (this.rect !== undefined) {
      if (this.radius > this.rect.height() / 2) {
        //limit radius
        this.radius = this.rect.height() / 2;
      }
      this.rect.cornerRadius(Math.round(this.radius));
    }
  }

  getRadius() {
    return this.rect.cornerRadius();
  }

  setFill(color) {
    if (this.rect !== undefined)
      this.rect.fill(color);
  }

  setObjectSize(size) {
    this.size(size);
    this.rect.size(size);
  }

  setBorderWidth(width) {
    this.border_width = Number(this.border_width);
    if (this.rect !== undefined) {
      this.rect.strokeWidth(this.border_width);
    }
  }

  getBorderWidth() {
    return this.rect.strokeWidth();
  }

  setBorderColor(color) {
    if (this.rect !== undefined) {
      this.rect.stroke(this.border_color);
    }
  }

  setHaspId(haspid) {
    this.haspid = haspid;
  }

  setActive() {
    //undefined
  }

  setBgColor(hex8color) {
    // console.log('setBgColor')
    // console.log(hex8color)
    this.rect.fill(this.bg_color);
    // const splitColors = splitColorOpa(this.bg_color)
    // console.log(splitColors)
    // this.rect.fill(splitColors.color);
    // this.rect.opacity(splitColors.opacity);
  }

  // setAction(action) {
  //   this.action = action;
  // }

  themeChange() {
  }

  objectExport() {
  }

  async hassConfigExport() {
  }

  changeColor(type, color) {
    const event = new Event(type);
    this.dispatchEvent(event);
  }

  export(page, exportData) {
    if (this.noExport)
      return;
    let objectData;
    if (this.noObjectExport === undefined) {
      objectData = {
        id: this.haspid,
        obj: this.type,
        x: Math.round(this.x()), y: Math.round(this.y()), w: Math.round(this.width()), h: Math.round(this.height()),
      }
      if (!this.hasp_enabled) objectData.enabled = this.hasp_enabled;
      const parent = this.getParent();
      if (parent instanceof HaspObject) {
        // console.log(parent)
        if (!parent.isType('page')) {
          objectData.parentid = parent.haspid;
        }
      }

      objectData.border_color = this.rect.stroke();
      objectData.border_width = this.rect.strokeWidth();
      objectData.radius = this.rect.cornerRadius();

      const splitColors = splitColorOpa(this.rect.fill())
      objectData.bg_color = splitColors.color;
      if (splitColors.opacity < 1) objectData.opacity = Number(Math.round(splitColors.opacity * 255))
      if (this.enabled === false) objectData.enabled = false;

      if (this.textObj !== undefined) {
        objectData.text = this.text;
        objectData.text_color = this.textObj.fill();
      }
      if (this.bg_color10 !== undefined) objectData.bg_color10 = this.bg_color10;
      if (this.bg_color20 !== undefined) objectData.bg_color20 = this.bg_color20;

      if (this.toggle !== undefined && this.toggle === true) objectData.toggle = true;
      if (this.hasAction && this.action) {
        var action = {};
        action[this.action] = this.command
        objectData.action = action;
      }
    } else {
      objectData = {
        id: this.haspid,
        obj: this.type,
      }
    }

    this.objectExport(page, objectData);
    if (this.hass_entityid !== undefined && this.hass_entityid !== '') {
      objectData.entity_id = this.hass_entityid;
    }

    exportData.push(objectData);
    this.getChildren().forEach(element => {
      if (element instanceof HaspObject) {
        element.export(page, exportData);
      }
    });
  }
}