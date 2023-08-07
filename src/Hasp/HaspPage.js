import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';
import HaspTheme from './HaspTheme';

import mustache from 'mustache'

export default class HaspPage extends HaspObject {

  canTransform = false;
  hasAction = false;
  radius = undefined; //Page has no radius
  borderColor = undefined;

  top_haspid = 1;

  constructor(config) {
    config.radius = 0;
    config.bg_color = config.theme.page_color
    super(config);
    this.rect.strokeWidth(2);

    this.draggable(true);
  }

  setActive(active) {
    if (active)
      this.rect.stroke("red");
    else
      this.rect.stroke("black");
  }

  //page is responsible for the objectid's
  getNextId() {
    // console.log('page:' + this.haspid + ' top:' + this.top_haspid)
    return this.top_haspid++;
  }

  setNextId(nextid) {
    if (nextid > this.top_haspid) {
      console.log('page:' + this.haspid + ' top:' + this.top_haspid + ' next' + nextid)
      this.top_haspid = nextid;
    } else {
      console.log('NO page:' + this.haspid + ' top:' + this.top_haspid + ' next' + nextid)
    }
  }

  //{"page":1,"comment":"---------- Page 1 ----------"}
  export(page, exportData) {
    exportData.push({ page: this.haspid, comment: "----------- page " + this.haspid + " ------- " });
    this.getChildren().forEach(element => {
      if (element instanceof HaspObject) {
        element.export(page, exportData);
      }
    });
  }

  async hassConfigExport() {
    var expobj = [];
    this.getChildren().forEach((element) => {
      if (element instanceof HaspObject) {
        const fetchTemplate = element.hassConfigExport(this)
        if (fetchTemplate !== undefined) {
          const options = {
            page_id: this.haspid,
            haspid: element.haspid,
            hass_entityid: element.hass_entityid,
            hass_event: element.hass_event
          };
          fetchTemplate.then(text => mustache.render(text, options))
            .then((output) => {
              // console.log(output);
              expobj.push(output);
            }).catch((e) => console.log(e))
        }
        console.log('done ' + element.haspid);
      }
    });
    console.log('page exp ' + this.haspid)
    // console.log(expobj)
    return expobj;
  }



}