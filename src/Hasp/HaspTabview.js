import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspTabview extends HaspObject {
  canTransform = true;
  hasAction = false;

  borderColor = "white";

  tabs = [];
  activeTab;

  barHeight = 50;

  constructor(config) {
    config.width ??= 200;
    config.height ??= 200;
    // config.bg_color = config.theme.secondary_color;
    // config.border_width = 0;
    super(config);
    this.border_width = undefined;
    this.radius = undefined;
    this.border_color = undefined;

    this.rect.opacity(0);
    
    this.topBarGroup = new Konva.Group({
      x: 0,
      y: 0,
      width: this.width(),
      height: this.barHeight,
      listening: false,
    })

    this.barBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.width(),
      height: this.barHeight,
      fill: this.theme.bg_color,
      listening: false,
    })
    this.topBarGroup.add(this.barBg);

    this.on('transform', (e) => {
      this.topBarGroup.width(this.width())
      this.barBg.width(this.width());
      this.drawTabs();
    });

    this.on('transformend', (e) => {
      // console.log('transform end');
      this.drawTabs();
    });

    this.add(this.topBarGroup)
    this.draggable(true);
  }

  drawTabs() {
    // console.log("drawTabs")
    const tabButWidth = this.width() / this.tabs.length;
    this.topBarGroup.destroy();
    let selectedTab;
    this.topBarGroup = new Konva.Group({
      x: 0,
      y: 0,
      width: this.width(),
      height: this.barHeight,
      listening: true,
    })
    let pos = 0;
    if(this.tabs.length == 0) {
      const tabButt = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.width(),
        height: this.barHeight,
        fill: this.theme.bg_color,
        obj: 'emptytab',
        listening: false,
      })
      this.topBarGroup.add(tabButt);
    }
    this.tabs.map(tab => {
      const tabButt = new Konva.Rect({
        x: pos * tabButWidth,
        y: 0,
        width: tabButWidth,
        height: this.barHeight,
        fill: this.theme.bg_color,
        // stroke: 'white',
        // strokeWidth: 2,
        type: 'tab_button',
        listening: true,
        tab: tab,
      })

      this.topBarGroup.add(tabButt);
      if (tab.selected) {
        selectedTab = tab;
        this.topBarGroup.add(new Konva.Line({
          x: pos * tabButWidth,
          y: this.barHeight - 2,
          points: [0, 0, tabButWidth, 0],
          stroke: this.theme.primary_color,
          strokeWidth: 4,
        }))
      }
      // tabButt.moveToTop();

      const txtObj = new Konva.Text({
        x: pos * tabButWidth,
        height: this.barHeight,
        // width: tabButWidth,
        verticalAlign: 'middle',
        text: tab.text,
        fontSize: 14,
        fontFamily: 'Calibri',
        // fill: 'red',
        listening: false,
        draggable: false,
        strokeWidth: 1,
        stroke: 'white',
        align: this.align,
      })
      txtObj.x(txtObj.x() + (txtObj.width() / 2))
      this.topBarGroup.add(txtObj);
      tab.setSize(this.width(), (this.height() - this.barBg.height()));
      // tab.setActive(true)
      if (selectedTab !== undefined) {
        selectedTab.moveToTop();
        selectedTab.setBorderColor('red')
      }
      pos++;
    })
    this.add(this.topBarGroup);
    this.topBarGroup.moveToTop();
    this.idTextObj.moveToTop();
  }

  // updateId(id) {
  //   this.haspid = id;
  //   this.textObj.setAttr('text', id);
  // }

  addItem(item) {
    if (item.isType('tab')) {
      item.x(0);
      item.y(this.barHeight);
      item.setSize(this.width(), (this.height() - this.barBg.height()));
      item.tabview = this;
      this.add(item);
      this.tabs.push(item);
      this.setSelectedTab(item);
      if(item.text === 'Tab') {
        item.text = 'Tab'+this.tabs.length ;
      }
      this.drawTabs();
    } else {
      if (this.activeTab !== undefined) {
        this.activeTab.addItem(item);
      }
    }
    return item;
  }

  setSelectedTab(tab) {
    if(this.activeTab !== undefined)
      this.activeTab.setSelected(false);
    this.activeTab = tab;
    this.activeTab.setSelected(true);
  }

  /**
   * delete tab if active tab exists
   * @returns did delete
   */
  deleteActiveTab() {
    if (this.activeTab !== undefined) {
      // console.log('delete tab')
      this.tabs = this.tabs.filter(tab => tab.uuid != this.activeTab.uuid)
      this.activeTab.destroy();
      this.activeTab = undefined;
      this.drawTabs();
      return true;
    }
    return false;
  }

  callback(tab) {
    this.drawTabs();
  }

  objectExport(page, objectData) {
    //unset a lot of export values
    objectData.border_color = undefined;
    objectData.border_width = undefined;
    objectData.bg_color = undefined;
    objectData.radius = undefined;
    // console.log('export tabview')
    this.tabs.map((tab,index) => {
      tab.moveToTop();
    });
  }
}