import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import HaspObject from './HaspObject';

export default class HaspImage extends HaspObject {

    angle = 0;
    padding = 0;
    keepRatio = true;
    canTransform = false;

    image;
    image_src = 'http://192.168.1.63:8123/local/openhasp/info_icon.png'//'/media/hasp/haspImage.png';
    imageObj;
    zoom = 1;
    initialImageSize;

    constructor(config) {
        // console.log(config)
        config.x ??= 0;
        config.y ??= 0;
        config.zoom ??= 256;
        config.padding = 0;
        const pad = Math.max(config.pad_top, config.pad_bottom, config.pad_left, config.pad_right);
        if (!isNaN(pad))
            config.padding = pad;
        config.x -= config.padding;
        config.y -= config.padding;
        config.bg_color = config.theme.page_color // hack image is not transparent
        super(config);
        // this.rect.destroy()
        this.bg_color = undefined; //disable propperty
        config.src ??= this.image_src;
        this.haspid = config.haspid;

        var imageObj = new Image();
        this.image_src = config.src;
        this.zoom = config.zoom / 256;
        this.padding = config.padding;

        const base = this;
        var image;

        imageObj.onload = function () {
            image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
            });
            base.add(image);
            base.initialImageSize = image.size();
            base.applyZoomFactor(image);

            base.size(image.size())
            base.rect.size(image.size())
            base.redrawImage(image);
        };

        imageObj.src = config.src;
        this.imageObj = imageObj;

        this.on('transform', function () {
            this.zoom = this.height() / this.initialImageSize.height;
            // console.log(this.zoom)
            this.applyZoomFactor(image)
            // this.redrawImage(image);
        });

        this.on('transformend', (e) => {
            this.redrawImage(image);
        });

        this.on('padding', function () {
            this.redrawImage(image);
        })

        this.on('reload', function () {
            // console.log('reload event')
            //on reload reset zoom factor, padding etd
            // this.zoom = 1;
            // this.padding = 0;
            image.destroy();
            imageObj.src = this.image_src;
            this.size(image.size())
            this.rect.size(image.size())
            this.setBorderWidth();
        })
    }

    reloadImage() {
        const event = new Event("reload");
        this.dispatchEvent(event);
    }

    applyZoomFactor(image) {
        // console.log('apply zoom');
        // console.log(this.zoom);
        if (this.zoom === 1)
            return;
        // this.padding = 0;
        var imgSize = this.size();
        // this.zoom = this.zoom / 256;
        //follow the grid
        // imgSize.height = Math.round((imgSize.height * this.zoom) / this.getLayer().gridSize) * this.getLayer().gridSize;
        // imgSize.width = Math.round((imgSize.width * this.zoom) / this.getLayer().gridSize) * this.getLayer().gridSize;
        image.size(imgSize);
    }

    setPadding(padding) {
        const pad = Number(padding);
        if (pad > 0) {
            this.padding = pad;
            const event = new Event("padding");
            this.dispatchEvent(event);
        }
    }

    redrawImage(image) {
        var imageSize = image.size();
        imageSize.width += this.padding * 2 ;
        imageSize.height += this.padding * 2;
        image.x(this.padding)
        image.y(this.padding);
        this.rect.size(imageSize)
        this.size(imageSize);
    }

    objectExport(page, objectData) {
        objectData.x = this.x() + this.padding;
        objectData.y = this.y() + this.padding;
        //first fix current exportdata
        objectData.src = this.image_src.trim();
        objectData.bg_color = undefined;
        objectData.opacity = undefined;
        objectData.w = undefined; objectData.h = undefined;
        if (this.padding > 0 && this.zoom === 1) {
            objectData.pad_top = this.padding;
            objectData.pad_right = this.padding;
            objectData.pad_left = this.padding;
            objectData.pad_bottom = this.padding;
        }
        if (this.zoom > 1) {
            objectData.zoom = Math.round(this.zoom * 256);
        }
    }

}