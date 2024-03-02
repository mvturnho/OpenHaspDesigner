import Konva from 'konva';

import { Layer } from 'konva/lib/Layer';

import color_convert from '../utils/color';


import HaspPage from '../Hasp/HaspPage';

import { objectTypelookup } from '../utils/lookupTables';
import HaspObject from '../Hasp/HaspObject';
import ObjectMenu from './ObjectMenu';

class GridLayer extends Layer {
    gridSize = 30;
    haspobject;
    transformer;
    shadowRectangle;
    activePage;
    layerCallback;
    panel_id = 1;
    object_id = 1;
    theme;
    pageWidth;
    pageHeight;
    containers = [];
    pages = [];
    showId = false;

    constructor(config) {
        super(config);
        this.theme = config.theme;
        //calback
        this.layerCallback = config.callback;
        //create transformer
        this.transformer = new Konva.Transformer();
        this.transformer.rotationSnaps([0, 45, 90, 135, 180, 225, 270, 315]);
        this.transformer.centeredScaling(false);
        this.transformer.keepRatio(false);
        this.transformer.rotateEnabled(false)

        this.add(this.transformer);

        // if (config.grid_size !== undefined)
        this.gridSize = config.grid_size;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        const padding = this.blockSnapSize;

        this.shadowRectangle = new Konva.Rect({
            x: 0,
            y: 0,
            width: 10,
            height: 10,
            fill: '#99ccffa0',
            stroke: '#0033cc',
            strokeWidth: 2,
        });

        this.objectMenu = new ObjectMenu({ x: 0, y: 0 });
        this.add(this.objectMenu);

        this.on('dragstart', (e) => {
            this.handleDragStart(e);
        });

        this.on('dragmove', (e) => {
            this.handleDragMove(e);
        });

        this.on('dragend', (e) => {
            this.handleDragEnd(e);
        });

        this.on('mousedown', (e) => {
            this.handleMouseDown(e);
        });

        this.on('mouseup', (e) => {
            this.handleMouseUp(e);
        });
    }

    handleDragStart(e) {
        // console.log("GridLayer dragstart");
        // this.addShadowRectangle();
    }

    addShadowRectangle() {
        this.shadowRectangle.remove();
        if (this.haspobject !== undefined) {
            if (this.haspobject.isType("page")) {
                this.add(this.shadowRectangle);
            } else {
                this.haspobject.parent.add(this.shadowRectangle);
            }
            this.shadowRectangle.x(this.haspobject.x())
            this.shadowRectangle.y(this.haspobject.y())
            this.shadowRectangle.width(this.haspobject.width());
            this.shadowRectangle.height(this.haspobject.height());
            this.shadowRectangle.moveToTop();
            this.shadowRectangle.show();
        }
    }

    scaleShadowRectangle(haspObject) {
        // console.log(haspObject)
        const xt = Math.round(haspObject.x() / this.gridSize) * this.gridSize;
        const yt = Math.round(haspObject.y() / this.gridSize) * this.gridSize;
        const wt = Math.round(haspObject.width() / this.gridSize) * this.gridSize;
        const ht = Math.round(haspObject.height() / this.gridSize) * this.gridSize;

        this.shadowRectangle.x(xt);
        this.shadowRectangle.y(yt);
        this.shadowRectangle.width(wt);
        this.shadowRectangle.height(ht);
    }

    handleDragMove(e) {
        // console.log("GridLayer dragmove");
        // if (this.haspobject.isType("tab"))
        //     this.haspobject = this.haspobject.tabview;
        if (!this.haspobject.gridSnap)
            return;
        //object should be bound to parent box
        var transformObject = this.haspobject;
        if (transformObject && !transformObject.isType("page")) {
            var parentObject = transformObject.getParent();
            // console.log(transformObject);
            if (transformObject.x() < 0)
                transformObject.x(0)
            if (transformObject.y() < 0)
                transformObject.y(0)

            if (transformObject.x() + transformObject.width() > parentObject.width()) {
                transformObject.x(Math.round(parentObject.width() - transformObject.width()))
            }
            if (transformObject.y() + transformObject.height() > parentObject.height()) {
                transformObject.y(Math.round(parentObject.height() - transformObject.height()))
            }
        }
        if (this.objectMenu)
            this.objectMenu.follow();

        //update shadow rectangle
        this.scaleShadowRectangle(this.haspobject);
        this.layerCallback(this.haspobject);
    }

    handleDragEnd(e) {
        // console.log("GridLayer dragend");
        if (this.haspobject !== undefined && this.haspobject.gridSnap) {
            const position = this.shadowRectangle.position();
            this.haspobject.position(position)
            this.haspobject.width(this.shadowRectangle.width());
            this.shadowRectangle.hide();

        }
        if (this.haspobject instanceof HaspObject)
            this.layerCallback(this.haspobject);
    }

    showObjectMenu(node) {
        // if (this.objectMenu && node.objectMenu && !this.objectMenu.isSameNode(node)) {
        //     this.objectMenu.setNode(node);
        //     this.objectMenu.follow();
        // } else {
        //     this.objectMenu.setNode(undefined);
        // }
    }

    handleMouseDown(e) {
        // console.log("GL mousedown")
        // console.log(e)
        // clicked on stage
        if (e.target === e.target.getStage()) {
            // console.log("GOT STAGE")
            this.haspobject = undefined;
            this.updateTransformer();
            return;
        }
        // clicked on transformer - move it to top layer
        if (e.target.getParent().className === 'Transformer') {
            // console.log("clickedOnTransformer")
            this.transformer.moveToTop();
            return;
        }

        const selectedNode = e.target;
        // console.log(selectedNode)
        if (selectedNode !== undefined) {
            if (selectedNode.attrs.type === 'object_menu') {
                return;
            }
            //activate selected panel
            if (selectedNode.attrs.type === "page") {
                // console.log("YES PANEL")
                if (this.activePage !== undefined) {
                    this.activePage.setActive(false);
                }
                this.haspobject = selectedNode.parent;
                this.activePage = this.haspobject;
                this.transformer.moveToTop();
                this.transformer.nodes([]);
                this.activePage.setActive(true);
            } else {
                // console.log(selectedNode);
                if (selectedNode instanceof Konva.Rect || selectedNode instanceof Konva.Image)
                    this.haspobject = selectedNode.parent;
            }
            if (selectedNode.attrs.type === "tab_button") {
                // console.log(selectedNode.attrs.tab)
                const tab = selectedNode.attrs.tab;
                this.haspobject = tab.tabview;
                this.haspobject.setSelectedTab(tab);
                this.haspobject.drawTabs();
            } else {
                //set properties
                this.transformer.moveToTop();
            }
            this.showObjectMenu(this.haspobject);
        } else {
            this.haspobject = undefined;
            // this.layerCallback(this.haspobject)
        }

        this.addShadowRectangle();
        this.updateTransformer();
    }

    handleMouseUp(e) {
        // console.log("GL mouseUp")
        if (this.haspobject !== undefined) {
            if (this.haspobject.isType("page")) {
                this.shadowRectangle.remove();
            } else {
                this.shadowRectangle.hide();
            }
        }
        //sets the property panel for the selected node
        this.layerCallback(this.haspobject)
    }

    transformStart(haspObject) {
        // const padding = this.gridSize * this.scaleX();
        this.shadowRectangle.show();
        this.shadowRectangle.moveToTop();
        this.scaleShadowRectangle(haspObject);
        this.layerCallback(haspObject);
    }

    transformEnd(haspObject) {
        // console.log("transformend")
        // console.log(this.shadowRectangle)
        haspObject.position(this.shadowRectangle.position())
        haspObject.setObjectSize(this.shadowRectangle.size());
        this.shadowRectangle.hide();
        this.layerCallback(haspObject);
        // console.log(haspObject)
        this.transformer.forceUpdate();
    }

    resetTransformer() {
        this.haspobject = undefined;
        this.updateTransformer();
    }

    updateTransformer() {
        // console.log('update transformer')
        // console.log(this.haspobject)
        if (this.haspobject !== undefined && this.haspobject.canTransform) {
            this.transformer.nodes([this.haspobject]);
            this.transformer.moveToTop();
            if (this.haspobject.keepRatio) {
                // console.log('keepratio')
                this.transformer.keepRatio(true);
                this.transformer.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right',])
            } else {
                this.transformer.keepRatio(false);
                this.transformer.enabledAnchors(['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']);
            }
        } else {
            this.transformer.enabledAnchors([])
        }
        if (this.haspobject)
            this.transformer.nodes([this.haspobject]);
    }

    deleteSelectedNodes() {
        if (this.haspobject.isType('tab')) {
            this.haspobject.tabview.deleteActiveTab()
        }
        // console.log(this.haspobject)
        const nodes = this.transformer.nodes();
        nodes.map(node => {
            // console.log(node)
            this.haspobject = node.getParent();
            node.destroy();
        })
        this.transformer.nodes([]);
    }

    showObjectId(show) {
        // console.log('showid ' + show)
        this.showId = show;
        const event = new Event("showid");
        event.showId = show;
        this.getChildren().forEach(element => {
            if (element instanceof HaspObject) {
                element.dispatchEvent(event);
            }
        });

    }

    setNodeProperties(properties) {
        // console.log(properties)
        if (this.haspobject) {
            if (properties.radius)
                this.haspobject.setRadius(properties.radius);
            if (properties.border_width)
                this.haspobject.setBorderWidth(properties.border_width);
            if (properties.haspid != undefined) {
                this.haspobject.setHaspId(properties.haspid);
                if (this.haspobject.isType("page"))
                    this.haspobject.updateId(properties.haspid);
            } if (properties.text != undefined) {
                this.haspobject.setTextLabel(properties.text)
            }
        } else {
            console.log("NO ACTIVE OBJECT")
        }
    }

    clearAll() {
        const children = this.getChildren();
        // console.log(children)
        //we first need to get all pages befor destroying
        children.forEach(element => {
            if (element instanceof HaspPage) {
                // console.log('DESTOY ' + element.haspid)
                this.pages.push(element);
            }
        });
        // now destroy
        this.pages.map(page => {
            page.destroy();
        })
        //clear all 
        this.containers = [];
        this.pages = [];
        this.activePage = undefined;
        this.haspobject = undefined;
    }

    addPage(config) {
        // this.object_id = 1;
        // console.log("AddPage " + config.page)
        if (config.page !== undefined)
            this.panel_id = config.page
        config.haspid = this.panel_id++;
        config.theme = this.theme;
        config.width = this.pageWidth;
        config.height = this.pageHeight;
        config.show_id = this.showId;
        var newPage = new HaspPage(config);
        if (this.activePage !== undefined) {
            this.activePage.setActive(false);
            newPage.x((this.activePage.x() + this.activePage.width() + 20))

            if (!(newPage.haspid % 5)) {
                newPage.y(this.activePage.y() + this.activePage.height() + 20)
                newPage.x(0);
            } else {
                newPage.y(this.activePage.y())
            }
        }
        this.add(newPage);

        this.haspobject = newPage;
        this.activePage = newPage;
        this.activePage.setActive(true);
        this.activePage.moveToTop();
    }

    getObjectEvents() {
        var actions = ['down', 'up', 'long', 'hold', 'release', 'changed'];
        // this.getChildren().forEach(page => {
        //     if (page instanceof HaspPage) {
        //         actions.push('p' + page.haspid);
        //     }
        // });
        return actions;
    }

    getPagenumbers() {
        var commands = [];
        this.getChildren().forEach(page => {
            if (page instanceof HaspPage) {
                commands.push(page.haspid);
            }
        });
        return commands;
    }

    getObjectCommands(objectEvent) {
        // console.log(objectEvent)
        var commands = [
            'backlight off', 'backlight on',
            'discovery', 'restart', 'reboot', 'screenshot',
            'sensors', 'calibrate', 'factoryreset',
            'statusupdate',
            'idle off', 'idle short', 'idle long',
            'page next', 'page prev', 'page back', 'clearpage all'
        ];
        this.getChildren().forEach(page => {
            if (page instanceof HaspPage) {
                commands.push('page ' + page.haspid);
                commands.push('clearpage' + page.haspid);
            }
        });
        return commands.sort();
    }

    findPage(id) {
        // console.log("Search page: " + id)
        var fpage = undefined;
        this.getChildren().forEach(page => {
            if (page instanceof HaspPage) {
                // console.log(page)
                if (page.haspid == id) {
                    // console.log("FOUND PAGE " + page.haspid)
                    fpage = page;
                    return;
                }
            }
        });
        return fpage;
    }

    addObject(config) {
        if (this.haspobject !== undefined) {
            // console.log(this.haspobject);
            //first we make sure we add to a container
            while (this.haspobject && !this.haspobject.isContainer())
                this.haspobject = this.haspobject.getParent();
            if (!this.haspobject)
                return
            //here we should ask the page for a new id
            config.haspid = this.activePage.getNextId();
            // console.log(this.activePage)
            config.theme = this.theme;
            config.show_id = this.showId;
            let newObject;
            // console.log(config)
            newObject = new objectTypelookup[config.type](config)
            if (newObject) {
                // console.log('no')
                const item = this.haspobject.addItem(newObject);
                // if (newObject.isContainer() && !newObject.isType('tab'))
                if (item instanceof HaspObject) {
                    this.haspobject = newObject;
                    this.haspobject.moveToTop();
                }
            }
        }
    }


    importObject(config) {
        config.haspid = config.id;
        config.width = config.w;
        config.height = config.h;
        config.type = config.obj;
        config.theme = this.theme;
        let newObject;
        config.id = undefined //otherwise the Konva object get messed up
        if (config.page === undefined) {
            config.page = this.activePage.haspid;
        }

        //find parent
        if (config.parentid) {
            //find the container by the parent_id
            const parents = this.containers.filter(container => container.haspid == config.parentid && container.pageid == config.page);
            if (parents) {
                this.haspobject = parents[0].container
            }
        } else if (config.page !== undefined) {
            //find the page as the parent
            // console.log("FIND PAGE")
            const page = this.findPage(config.page);
            // console.log("THIS: " + page)
            if (page)
                this.haspobject = page;
            else {
                this.addPage({ "page": config.page })
            }
            // console.log(this.haspobject)
        } else {
            //if no parent container or specific page was found then use the activepage
            console.log("NO Parent")
            this.haspobject = this.activePage;
        }
        //now we know where to add the new object
        //create the new object
        console.log("NEW OBJECT " + config.type)
        if (config.type in objectTypelookup) {
            newObject = new objectTypelookup[config.type](config)
        } else {
            newObject = new HaspObject(config);

        }
        if (newObject) {
            if (newObject.isContainer()) {
                //when we have a container object save it to the containers store
                const pageid = config.page;
                const haspid = config.haspid;
                const container = newObject;
                //containers are needed to find the object when we have a parent_id
                this.containers.push({ pageid, haspid, container });
            }
            //now add the new object
            this.haspobject.addItem(newObject);
            this.activePage.setNextId(newObject.haspid + 1);
        }
    }

    setObjectColor(color) {
        // console.log(color)
        if (this.haspobject !== undefined) {
            this.haspobject.setColor(color);
        }
    }
}

export { GridLayer, objectTypelookup }

