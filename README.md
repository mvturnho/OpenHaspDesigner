# openhasp-designer

Webbased OpenHasp designer. 

the project uses these frameworks;
- Vuejs
- Konva
- Tailwind
  
This is a graphical editor for OpenHASP.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

# Code explenation

## Mainui with Vue3
The UI is build on the Vue3 framework and starts in [App.vue](./src/App.vue). 
The main UI has three major components;
- sidebar with
  - Component (add delete export import)
  - Properties panel to edit selected object
- Main drawing area

The buttons in the component panel are created from a [objectTypelookup](./src/utils/lookupTables.js). The needed icons are then loaded using another lookup table called lookupIcon.

The propertiespanel changes with the selected object. so when we have no cornerradius for the object there is no editor in the properties panel.

## drawing with Konva
The Konva part makes use of One [ScaleStage](./src/draw/ScaleStage.js) and in this Stage we have a [GridLayer](./src/draw/GridLayer.js). On the Gridlayer we do all the drawing. The ScaleStage handles the zooming and panning.

All OpenHasp objects (the graphical objects) are derived from the baseobject [HaspObject](./src/Hasp/HaspObject.js). The HaspObject has the major basics that every object needs;
- id
- name
- type (Button, Tabview, Tab etc)
- x, y position (relative to its container)
- width, height
- selectable (can it be selected)
- dragable (is it dragable)
- fill (background color)
- stroke (border color)
- cornerRadius (rounded corners for the background rectangle)
- opacity (transparency)
- export, functionality to export the objects parameters

From the HaspObject we also handle the default drawing en scaling (transformer). In a number of derived objects these handlers are extenden or we override them completely.

Simple derived objects have a very simple constructor where we set the width and height, color etc. [HaspLed](./src/Hasp//HaspLed.js) is a good example of this.

[HaspLabel](./src/Hasp/HaspLabel.js) that also incorporates text is a bit more complex because we add a KonvaText object and also need to manage this.

[HaspBar](./src/Hasp/HaspBar.js) Uses extra drawing components and also functionality to support these extra Konva components. 

[HaspSlider](./src/Hasp/HaspSlider.js) is a good example of how the HaspBar is extended to make an interactive slider from the base object.

