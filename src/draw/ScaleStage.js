import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';

export default class ScaleStage extends Stage {
    currentScale = 7;
    gridLayer;
    dataLayer;
    gridSize = 30;
    container;
    callback;

    constructor(config) {
        super(config);
        this.callback = config.callback;
        // if(config.grid_size !== undefined) {
        this.gridSize = config.grid_size;
        // }

        this.gridLayer = new Layer({
            draggable: false,
        });
        this.dataLayer = new Layer({
            draggable: false,
            listening: false,
        })

        this.add(this.gridLayer);
        this.add(this.dataLayer);
        this.drawGrid();

        this.on('wheel', (e) => {
            e.evt.preventDefault();
            this.handleWheel(e);
            this.drawGrid();
        });

        this.on('dragmove', (e) => {
            this.drawGrid();
        });

        this.on('dragend', (e) => {
            e.evt.preventDefault();
            // console.log(this.x())
            this.drawGrid();
        });
    }

    unScale(val) {
        return (val / this.scaleX());
    }

    handleWheel(e) {
        let scales = [6, 5, 4, 3, 2.5, 2, 1.5, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4]
        var oldScale = this.getStage().scaleX();
        var pointer = this.getStage().getPointerPosition();
        var mousePointTo = {
            x: (pointer.x - this.x()) / oldScale,
            y: (pointer.y - this.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? -1 : 1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        if (direction > 0) {
            this.currentScale = this.currentScale > 0 ? this.currentScale - 1 : this.currentScale;
        }
        else {
            this.currentScale = this.currentScale < scales.length - 1 ? this.currentScale + 1 : this.currentScale;
        }

        let newScale = scales[this.currentScale];

        // console.log(newScale)

        this.scale({ x: newScale, y: newScale });

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        this.position(newPos);
    }

    setGridSize(gridSize) {
        this.gridSize = gridSize;
        this.drawGrid();
        this.getLayers().map(layer => {
            layer.gridSize = this.gridSize;
        })
    }

    drawScale(x,y) {
        this.dataLayer.clear();
        this.dataLayer.destroyChildren();
        const scaleVal = this.scaleX();
        const txtObj =  new Konva.Text({
            x: x,
            y: y,
            height: 20,
            text: scaleVal,
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'red',
            listening: false,
            draggable: false,
        });

        this.dataLayer.add(txtObj);
        this.dataLayer.moveToTop();
    }

    drawGrid() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.gridLayer.clear();
        this.gridLayer.destroyChildren();
        this.gridLayer.clipWidth(null); // clear any clipping

        const stageRect = {
            x1: 0,
            y1: 0,
            x2: this.width(),
            y2: this.height(),
            offset: {
                x: this.unScale(this.position().x),
                y: this.unScale(this.position().y),
            }
        };
        const viewRect = {
            x1: -stageRect.offset.x,
            y1: -stageRect.offset.y,
            x2: this.unScale(width) - stageRect.offset.x,
            y2: this.unScale(height) - stageRect.offset.y
        };

        const padding = this.gridSize;

        for (var i = 0; i < (viewRect.x2 - viewRect.x1) / padding; i++) {
            const xg = Math.floor(viewRect.x1 / padding) * padding;
            let color = '#ddd';
            if ((i * padding) + xg === 0) {
                color = 'blue';
            }
            this.gridLayer.add(new Konva.Line({
                points: [(i * padding) + xg, viewRect.y1, (i * padding) + xg, viewRect.y2],
                stroke: color,//'#ddd',
                type: 'gridline',
                strokeWidth: 0.5,
            }));
        }

        for (var j = 0; j < (viewRect.y2 - viewRect.y1) / padding; j++) {
            const yg = Math.floor(viewRect.y1 / padding) * padding;
            let color = '#ddd';
            if ((j * padding) + yg === 0)
                color = 'red';
            this.gridLayer.add(new Konva.Line({
                points: [viewRect.x1, (j * padding) + yg, viewRect.x2, (j * padding) + yg],
                stroke: color,//'#ddd',
                type: 'gridline',
                strokeWidth: 0.5,
            }));
        }


        this.gridLayer.add(new Konva.Circle({
            x: 0,
            y: 0,
            radius: 10,
            fill: 'yellow',
            stroke: 'black',
            strokeWidth: 1,
            type: "grid_center",
            draggable: false,
            listening: false,
        }));

        this.gridLayer.batchDraw();
        // this.drawScale(viewRect.x1+10,viewRect.y1+10);
        this.callback({ scale: this.scaleX() })
    }

}