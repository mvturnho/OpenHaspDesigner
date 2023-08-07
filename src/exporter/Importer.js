
import HaspPage from '../Hasp/HaspPage'

import { lookupPageSize } from '../utils/lookupTables';

export default class Importer {

    projectName = 'openhasp';

    //async function needs callback to inform main ui
    async doImport(file, layer, callback) {
        this.layer = layer;
        const fileReader = new FileReader();
        fileReader.onload = function () {
            layer.clearAll();
            const content = fileReader.result;
            let result = {};
            var lines = content.split('\n');
            for (var line = 0; line < lines.length; line++) {
                console.log(line + ':  ' + lines[line]);
                try {
                    if (lines[line].length < 4)
                        continue
                    const config = JSON.parse(lines[line]);
                    if (config.rotation !== undefined) {
                        config.hasp_rotation = config.rotation;
                        config.rotation = undefined;
                    }
                    if (config.obj === 'tabview') {
                        // console.log('TABVIEW')
                        config.width ??= layer.pageWidth;
                        config.height ??= layer.pageHeight;
                    }
                    // console.log(config);
                    if (config.id === undefined && config.page === undefined) {
                        if (config.page_size !== undefined) {
                            console.log("page_size to " + config.page_size)
                            this.pageSize = config.page_size;
                            const size = lookupPageSize[this.pageSize];
                            console.log(size)
                            layer.pageWidth = size.w;
                            layer.pageHeight = size.h;
                        }
                        result = config;
                    }
                    else if (config.obj === undefined && config.page !== undefined){
                        config.id = undefined;
                        layer.addPage({ type: "page", haspid: config.page, width: this.pageWidth, height: this.pageHeight, bg_color: this.pageColor });
                    }  else {
                        layer.importObject(config);
                    }
                } catch (e) {
                    console.log(e)
                }

            }
            callback(result)
        }
        fileReader.readAsText(file);
    }

}