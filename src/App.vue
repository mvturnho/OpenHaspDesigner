<script setup>
import './assets/tailwind.css';
import { objectTypelookup, lookupPageSize } from './utils/lookupTables';
import { GridLayer } from './draw/GridLayer';
import ScaleStage from './draw/ScaleStage';
import Exporter from './exporter/Exporter';
import Importer from './exporter/Importer';
import haspTheme from './Hasp/HaspTheme';
</script>

<template>
  <div class="flex bg-gray-900">
    <aside class="w-60 bg-gray-900 space-y-2 pl-2 pr-2">
      <div class="sticky top-0 bg-gray-900 pb-2 z-40 space-y-2 ">
        <form-label name="components" />
        <!-- <form-button icon="envelope-open-text" @click="addPage">Page</form-button> -->
        <div class="grid grid-cols-3 gap-2">
          <form-button :icon="lookupIcon['page'].icon" :docicon="lookupIcon['page'].docicon"
            :title="lookupIcon['page'].title" @click="addPage">Page</form-button>
          <div v-for="(name, obj) in objectTypelookup" :key=obj>
            <!-- <form-button color="gray" :icon=lookupIcon[obj] @click="addObject(obj)">{{ obj }}</form-button> -->
            <form-button color="gray" :icon=lookupIcon[obj].icon :docicon=lookupIcon[obj].docicon
              :title=lookupIcon[obj].title @click="addObject(obj)">{{ obj }}</form-button>
          </div>
        </div>
        <form-button color="danger" title="Select the object to be deleted first." icon="media/icons/trash.png"
          @click="deleteObject">delete</form-button>
        <div class="grid grid-cols-2 gap-2">
          <form-button color="success" icon="media/icons/import.png"
            title="Import a valid OpenHASP file. Pages and objects are automaticaly created"
            @click="$refs.file.click()">import</form-button>
          <form-button color="success" icon="media/icons/export.png" title="Export the design to an openHASP file."
            @click="exportData">export</form-button>
        </div>
        <input class="hidden" @change="importFile" ref="file" type="file">
      </div>
      <div class="w-45 space-y-2">
        <Accordion class="pr-2" title="Settings">
          <form-input name="Project name" type="text" v-model="projectName" />
          <form-select name="page-size" v-model="pageSize">
            <option v-for="spec, ref in lookupPageSize" :value="ref">{{ spec.title }}</option>
          </form-select>
          <form-input name="page width" type="number" min="240" max="800" v-model="layer.pageWidth" />
          <form-input name="page height" type="number" min="240" max="800" v-model="layer.pageHeight" />
          <form-input name="grid" type="number" min="5" max="20" step="5" v-model="gridSize"
            v-on:input="changeGridSize($event.target.value)" />
          <div class="flex ml-2 mt-2">
            <!-- <form-checkbox v-model="showid" v-on:change="showId($event)" /> -->
            <form-checkbox v-model="layer.showId" v-on:change="layer.showObjectId($event)" />
            <form-label class="ml-2">show id</form-label>
          </div>
          <!-- <form-select name="theme" v-model="haspTheme">
            <option value="haspdark">Hasp Dark</option>
            <option value="hasplight">Hasp Light</option>
            <option value="mono">Mono</option>
            <option value="materialdark">Material Dark</option>
            <option value="materiallight">Material Light</option>
          </form-select> -->
          <div class="grid grid-cols-2  justify-items-end m-2 content-end">
            <form-label>primary-color</form-label>
            <div class="justify-items-end">
              <ColorPicker v-model:pureColor="theme.primary_color" useType="pure" format="hex8" lang="En" shape="circle"
                v-on:pureColorChange="theme.colorChange('primary_color', $event)" />
            </div>
          </div>
          <div class="grid grid-cols-2  justify-items-end m-2 content-end">
            <form-label>secondary-color</form-label>
            <div class="justify-items-end">
              <ColorPicker v-model:pureColor="secondaryColor" useType="pure" format="hex8" lang="En" shape="circle" />
            </div>
          </div>
        </Accordion>
        <PropertiesPanel v-model:node="selectedNode" v-if="selectedNode" />
      </div>
    </aside>
    <div class="h-screen  sticky top-0 md:container rounded-md ml-2 bg-yellow-50 cursor-pointer " id="konva_container">
    </div>
  </div>
  <Modal v-model:show="showModal" width="large">
    <h3 class="text-xl leading-6 font-medium text-gray-900">
      Design export
    </h3>
    <form class="mt-7 w-full">
      <form-group>
        <form-checkbox label="homeassistant config" v-model=hassExport />
        <form-label>homeassistant config</form-label>
      </form-group>
      <form-group>
        <form-textarea class="mb-4 " type="text" readonly rows="20" wrap="off" v-model="exportDataText" />
      </form-group>
      <form-button @click="exportDataTofile(true)">
        Save to file &#x2192;
      </form-button>
    </form>
  </Modal>
</template>


<script>
import Konva from 'konva';

import { lookupIcon, lookupPageSize } from './utils/lookupTables';
import Modal from './components/Modal.vue';
import PropertiesPanel from './components/PropertiesPanel.vue'
import Accordion from './components/Accordion.vue';
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";


const width = window.innerWidth;
const height = window.innerHeight;
var colors = '#194d33';


export default {
  components: {
    Modal,
    Accordion,
    ColorPicker,
  },
  data() {
    return {
      projectName: 'openhasp',
      pageSize: "large_portrait",
      // pageWidth: 320,
      // pageHeight: 480,
      haspTheme: 'materialdark',
      pageColor: '#4b4b4bff',
      primaryColor: '#42a5f6ff',
      secondaryColor: '#fb8c00ff',
      stage: undefined,
      stageScale: 1,
      position: { x: 0, y: 0 },
      layer: undefined,
      text: '',
      gridSize: 10,
      haspId: 0,
      showModal: false,
      selectedNode: null,
      theme: new haspTheme(),
      exportDataText: '',
      hassExport: false,
      showid: false,
    };
  },
  mounted: function () {
    let container = document.querySelector('#konva_container');
    this.stage = new ScaleStage({
      container: 'konva_container',
      width: container.offsetWidth,
      height: container.offsetHeight,
      draggable: true,
      grid_size: this.gridSize,
      callback: this.stageCallback,
    });

    this.layer = new GridLayer({
      x: 0,
      y: 0,
      draggable: false,
      grid_size: this.gridSize,
      callback: this.layerCallback,
      theme: this.theme,
    });
    this.setPageSize();
    this.stage.add(this.layer);
    // window.addEventListener('resize', this.fitStageIntoParentContainer);
  },
  watch: {
    readiusProperty: function () {
      if (this.readiusProperty < 0)
        this.readiusProperty = 0;
      this.layer.setNodeProperties({ radius: Number(this.readiusProperty) });

    },
    borderWidthProperty: function () {
      if (this.borderWidthProperty < 0)
        this.borderWidthProperty = 0;
      this.layer.setNodeProperties({ border_width: Number(this.borderWidthProperty) })
    },
    haspId: function () {
      this.layer.setNodeProperties({ haspid: Number(this.haspId) })
    },
    text: function () {
      this.layer.setNodeProperties({ text: this.text })
    },
    color: function () {
      this.layer.setObjectColor(this.color);
    },
    selectedNode: function () {
      // console.log(this.selectedNode)
    },
    pageSize: {
      handler: function () {
        this.setPageSize();
      }
    },
  },
  methods: {
    setPageSize: function () {
      const size = lookupPageSize[this.pageSize];
      if (this.layer) {
        this.layer.pageWidth = size.w;
        this.layer.pageHeight = size.h;
      }
    },
    changeGridSize: function () {
      if (this.stage != undefined)
        this.stage.setGridSize(this.gridSize);
    },
    closeModal() {
      this.showModal = false;
    },
    exportData(e) {
      const exp = this.exportDataTofile(false);
      this.exportDataText = exp.jsonl;
      this.showModal = true;
    },
    exportDataTofile(doSave) {
      this.showModal = false;
      const settings = {
        project_name: this.projectName,
        page_size: this.pageSize,
      }

      const exporter = new Exporter();
      // console.log(this.hassExport)
      let exp = exporter.doExport(settings, this.layer, doSave);
      
      exporter.hassExport(settings,this.layer);
      return exp
    },
    callback(result) {
      // console.log(result)
      if (result.project_name)
        this.projectName = result.project_name;
      if (result.page_size)
        this.pageSize = result.page_size
    },
    importFile() {
      this.file = this.$refs.file.files[0];
      if (!this.file) {
        return this.parseError('Selecteer een bestand om deze te importeren.');
      }
      const importer = new Importer()
      importer.doImport(this.file, this.layer, this.callback);

    },
    addPage(e) {
      this.layer.addPage({ type: "page", bg_color: this.pageColor });
    },
    addObject(type) {
      // console.log('ADD')
      // console.log(type)
      this.layer.addObject({ type: type })
    },

    deleteObject(e) {
      if (this.selectedNode.canDelete) {
        this.layer.deleteSelectedNodes();
        this.selectedNode = undefined;
      }
    },
    showId(e) {
      this.layer.showObjectId(e);
    },
    stageCallback(data) {
      if (data.scale)
        this.stageScale = data.scale;
    },
    layerCallback(node) {
      this.selectedNode = undefined;
      this.selectedNode = node;
      if (node.isType("page")) {
        this.haspId = node.haspid;
        this.showPanel = true;
      } else {
        // console.log('set properties')
        this.showPanel = false;
        this.readiusProperty = node.getRadius();
        this.borderWidthProperty = node.getBorderWidth();
        this.position = { pos: node.position(), size: node.getSize() };
        if (node.isType('btn')) {
          this.text = node.text;
        }
      }
    },
    fitStageIntoContainer() {
      const container = document.querySelector('#konva_container');
      // console.log(container)
      this.stage.width(container.offsetWidth);
      this.stage.height(container.offsetHeight);
    },
    addServerNode(n) {
      // console.log("tata");
      if (n.children && n.children.length > 0) return;
      const id = `${Date.now()}`;
      const newNode = {
        text: `loaded from server`,
        children: [],
        state: {},
      };
      // add the node to nodes
      this.nodes[id] = newNode;
      // set children
      n.children = [id];
      // end loading
      n.state.isLoading = false;
    },
  },
};
</script>

<style>
.container {
  position: relative;
  width: 50%;
}

.image {
  display: block;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: .3s ease;
  background-color: #275bec;
  color: white;
  border-radius: 10px;
}

.container:hover .overlay {
  opacity: 0.8;
}
</style>

