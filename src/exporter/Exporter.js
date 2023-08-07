import HaspPage from '../Hasp/HaspPage'
import FileSaver from "file-saver";
import json2jsonl from '../utils/jsonl'
import jsyaml from 'js-yaml'

export default class Exporter {
  doExport(settings, layer, save) {
    let exportData = [];
    const pages = [];

    exportData.push({ "comment": "---- Config ---- ", "page_size": settings.page_size, "project_name": settings.project_name });
    layer.getChildren().forEach(element => {
      if (element instanceof HaspPage) {
        pages.push(element)
      }
    });
    pages.sort(function (a, b) {
      return a.attrs.haspid - b.attrs.haspid;
    });

    pages.map(page => {
      page.export(page, exportData);
    })

    const jsonl = json2jsonl(exportData, save);

    if (save) {
      var blob = new Blob([jsonl], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, settings.project_name + ".jsonl");
    }

    return { jsonl: jsonl };
  }

  hassExport(settings, layer) {
    const hassObjects = [];
    const pages = [];
    //sort pages
    layer.getChildren().forEach(element => {
      if (element instanceof HaspPage) {
        pages.push(element)
      }
    });
    pages.sort(function (a, b) {
      return a.attrs.haspid - b.attrs.haspid;
    });

    //TODO functionality to create homeassistant yaml for exported pages
    //Use mustache templates to create the yaml.
    
    // console.log('start export')

    // pages.forEach(async page => {
    //   hassObjects.push(page.hassConfigExport());
    // });
    // console.log(hassObjects.length)
    // hassObjects.forEach(obj => {
    //   console.log(obj.length)
    // });
    // console.log(hassObjects);

    // const hassYaml = jsyaml.dump({ objects: hassObjects });
    // console.log(hassYaml)
    // var blob = new Blob([hassYaml], { type: "text/plain;charset=utf-8" });
    // FileSaver.saveAs(blob, settings.project_name + ".yaml");
    // });

    // console.log('exporter')

    // console.log('DONE export')

    // const hassYaml = jsyaml.dump({ objects: hassObjects });
    // console.log(hassYaml)

    // var blob = new Blob([hassYaml], { type: "text/plain;charset=utf-8" });
    // FileSaver.saveAs(blob, settings.project_name + ".yaml");
  }

  // async pexp(pages) {
  //   let hassObjects = [];
  //   pages.forEach(async (page) => {
  //     await page.hassConfigExport().then((pageExp) => {
  //       console.log(pageExp)
  //       hassObjects.push(pageExp)
  //     });
  //   });
  //   return hassObjects;
  // }

}