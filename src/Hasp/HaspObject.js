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
  // save_bg_color = false;
  save_border_color = false;
  save_border_width = false;
  save_radius = false;
  save_text_color = false;

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
    config.bg_opa ??= 255;
    config.bg_color ??= config.theme.bg_color;

    config.opacity = config.bg_opa / 255;

    super(config);
    const uuid = uuidv4();
    this.id(uuid);
    this.uuid = uuid;

    this.haspid = config.haspid;
    this.theme = config.theme;
    this.type = config.type;
    if (config.comment !== undefined) this.comment = config.comment;
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
    //Radius
    if (config.radius !== undefined) {
      this.radius = config.radius;
      this.save_radius = true;
    } else { this.radius = this.theme.radius; }
    //border_width
    if (config.border_width !== undefined) {
      this.border_width = config.border_width;
      this.save_border_width = true;
    } else { this.border_width = this.theme.border_width; }
    //Border_color
    if (config.border_color !== undefined) {
      this.border_color = config.border_color;
      this.save_border_color = true;
    }
    else { this.border_color = this.theme.border_color; }
    //config.bg_color is hex6 add opacity to make hex8

    this.bg_color = config.bg_color; // + config.opacity.toString(16);

    this.bg_color += Number(config.bg_opa).toString(16);

    this.theme.addChangeListener(this);

    this.rect = new Konva.Rect({
      id: uuidv4(),
      uuid: uuid,
      x: 0,
      y: 0,
      width: config.width,
      height: config.height,
      fill: this.bg_color,
      stroke: this.border_color,
      strokeWidth: config.borderWidth,
      draggable: false,
      name: "rect",
      type: this.type,
      selectable: true,
      cornerRadius: this.radius,
      listening: true,
      opacity: 1,
    });

    //fix maxradius
    this.setRadius(this.radius);
    //need to filter opacity
    // this.setBgColor();

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
      // console.log('showid');
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

  changeRadius(radius) {
    // console.log("CHANGE RADIUS")
    this.save_radius = true;
    this.setRadius(radius);
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
    this.save_border_color = true;
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

  /**
   * We set the bg_color to the full rgbo color red green blue opa
   * we load bg_color from config.bg_color and add bg_opa
   * @param {*} hex8color 
   */
  setBgColor(hex8color) {
    // console.log('setBgColor')
    // console.log(hex8color)
    this.rect.fill(this.bg_color);
    const splitColors = splitColorOpa(this.bg_color)
    // console.log(splitColors)
    // this.rect.fill(splitColors.color);
    this.opacity(splitColors.opacity);
  }

  changeBgColor() {
    this.save_bg_color = true;
    this.rect.fill(this.bg_color);
  }

  themeChange() {
  }

  objectExport() {
  }

  /**
   * 
   * @param {You may implement a redraw on every object} args 
   */
  redraw(args) {
  }

  async hassConfigExport() {
  }

  changeColor(type, color) {
    const event = new Event(type);
    this.redraw(event);
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
      }
      if (this.comment !== undefined) objectData.comment = this.comment;
      objectData.x = Math.round(this.x());
      objectData.y = Math.round(this.y());
      objectData.w = Math.round(this.width());
      objectData.h = Math.round(this.height());

      if (!this.hasp_enabled) objectData.enabled = this.hasp_enabled;
      const parent = this.getParent();
      if (parent instanceof HaspObject) {
        // console.log(parent)
        if (!parent.isType('page')) {
          objectData.parentid = parent.haspid;
        }
      }

      if (this.save_border_color) objectData.border_color = this.rect.stroke();
      if (this.save_border_width) objectData.border_width = this.rect.strokeWidth();
      if (this.save_radius) objectData.radius = this.rect.cornerRadius();

      // console.log("BGCOLOR " + this.bg_color)
      if (this.bg_color != undefined) {
        const splitColors = splitColorOpa(this.bg_color)
        if (splitColors.color !== this.theme.bg_color) {
          // console.log(splitColors)
          objectData.bg_color = splitColors.color;
          if (splitColors.opacity < 1) {
            objectData.bg_opa = Number(Math.round(splitColors.opacity * 255));
          }
        }
      }
      if (this.enabled === false) objectData.enabled = false;

      if (this.textObj !== undefined) {
        objectData.text = this.text;
        if (this.save_text_color) objectData.text_color = this.textObj.fill();
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
        // console.log(element.type)
        element.export(page, exportData);
      }
    });
  }
}