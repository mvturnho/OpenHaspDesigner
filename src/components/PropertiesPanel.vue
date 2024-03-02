<template>
    <div v-if="node">
        <div class="rounded-md">
            <Accordion class="pr-2" :title='node.type.toUpperCase() + " Properties"'>
                <form-input name="Hasp id" type="number" v-model="node.haspid"
                    v-on:input="node.updateId($event.target.value)" />
                <div v-if="node.type == 'page'">
                    <form-label class="ml-2 mt-2">page nav_limit</form-label>
                    <div class="flex">
                        <form-select v-model="node.page_limit_command">
                            <option :value=name v-for="(name) in ['', 'prev', 'next']" :key=name>{{
                                name
                            }}</option>
                        </form-select>
                        <form-select v-model="node.page_limit_number">
                            <option :value=name v-for="(name) in node.getLayer().getPagenumbers()" :key=name>{{
                                name
                            }}</option>
                        </form-select>
                    </div>
                </div>
                <div v-if="node.type !== 'page'">
                    <div class="flex">
                        <form-label class="ml-2 mr-2" name="x:">{{ Math.round(xPos) }}</form-label>
                        <form-label name="y:">{{ Math.round(yPos) }}</form-label>
                    </div>
                    <div class="flex ml-2">
                        <form-checkbox v-model="node.enabled" v-on:change="node.setEnabled($event)" />
                        <form-label class="ml-2">enabled</form-label>
                    </div>

                    <div class="flex ml-2" v-if="node.type === 'btn'">
                        <form-checkbox v-model="node.toggle" v-on:change="node.setToggle($event)" />
                        <form-label class="ml-2">toggle</form-label>
                    </div>

                    <div class="flex ml-2" v-if="node.type === 'checkbox'">
                        <form-checkbox v-model="node.checked" v-on:change="node.setChecked($event)" />
                        <form-label class="ml-2">checked</form-label>
                    </div>

                    <div class="flex ml-2" v-if="node.adjustable !== undefined">
                        <form-checkbox v-model="node.adjustable" v-on:change="node.setHaspAdjustable($event)" />
                        <form-label class="ml-2">adjustable</form-label>
                    </div>

                    <form-input name="text font" type="number" min="0" v-model="node.text_font"
                        v-if="node.text_font !== undefined" v-on:input="node.adjust()" />
                    <form-input name="line count" type="number" min="0" v-model="node.line_count"
                        v-if="node.line_count !== undefined" v-on:input="node.adjust()" />
                    <form-input name="label count" type="number" min="0" v-model="node.label_count"
                        v-if="node.label_count !== undefined" v-on:input="node.adjust()" />
                    <form-input name="angle" type="number" min="0" max="360" v-model="node.angle"
                        v-if="node.angle !== undefined" v-on:input="node.adjust()" />
                    <form-input name="rotation" type="number" min="0" max="360" v-model="node.hasp_rotation"
                        v-if="node.hasp_rotation !== undefined" v-on:input="node.adjust()" />
                    <form-input name="start angle" type="number" min="0" max="360" v-model="node.start_angle"
                        v-if="node.start_angle !== undefined" v-on:input="node.adjust($event.target.value)" />
                    <form-input name="end angle" type="number" min="0" max="360" v-model="node.end_angle"
                        v-if="node.end_angle !== undefined" v-on:input="node.adjust($event.target.value)" />
                    <ListOptionsTable @updateNode="updateNode" v-model:options="node.listOptions"
                        v-if="node.listOptions !== undefined" />

                    <form-select name="indicator type" v-model="node.hasp_type" v-if="node.hasp_type !== undefined"
                        v-on:change="node.adjust()">
                        <option :value=item.value v-for="(item) in node.hasp_type_options" :key=item.description>{{
                            item.description
                        }}</option>
                    </form-select>

                    <form-input name="border-width" type="number" min="0" v-model="node.border_width"
                        v-if="node.border_width !== undefined" v-on:input="node.setBorderWidth($event.target.value)" />
                </div>
                <form-input name="border-radius" type="number" min="0" v-model="node.radius"
                    v-if="node.radius !== undefined" v-on:input="node.changeRadius($event.target.value)" />
                <form-input name="padding" type="number" min="0" v-model="node.padding" v-if="node.padding !== undefined"
                    v-on:input="node.setPadding($event.target.value)" />

                <form-input name="text" type="text" v-model="node.text" v-if="node.text !== undefined"
                    v-on:input="node.setTextLabel($event.target.value)" />
                <form-input name="image url" type="text" v-model="node.image_src" v-if="node.image_src !== undefined"
                    v-on:input="node.reloadImage()" />
                <form-input name="comment" type="text" v-model="node.comment" v-if="node.comment !== undefined"/>

            </Accordion>
            <Accordion class="pr-2" title="Data" v-if="node.val !== undefined">
                <form-input name="min value" type="number" v-model="node.min" v-if="node.min !== undefined"
                    v-on:input="node.adjust()" />
                <form-input name="max value" type="number" v-model="node.max" v-if="node.max !== undefined"
                    v-on:input="node.adjust()" />
                <form-input name="critical value" type="number" min="0" v-model="node.critical_value"
                    v-if="node.critical_value !== undefined" v-on:input="node.adjust()" />
                <form-input name="current value" type="number" v-model="node.val" v-if="node.val !== undefined"
                    v-on:input="node.adjust()" />
            </Accordion>
            <HassPropertiesPanel v-bind:node="node" v-if="node.hass_entityid !== undefined" />
            <!-- <Accordion class="pr-2" title="Homeassistant" v-if="node.hass_entityid !== undefined">
                <form-input name="entity id" type="text" v-model="node.hass_entityid" v-if="node.hass_entityid !== undefined"/>
            </Accordion> -->
            <Accordion class="pr-2" title="Color">
                <div class="grid grid-cols-2 justify-items-end">
                    <template v-if="node.bg_color">
                        <form-label class="mr-2 ">bg-color</form-label>
                        <ColorPicker v-model:pureColor="node.bg_color" useType="pure" format="hex8" lang="En" shape="circle"
                            v-on:pureColorChange="node.changeBgColor($event)" />
                    </template>
                    <template v-if="node.bg_color10">
                        <form-label class="mr-2 ">bg-color 10</form-label>
                        <ColorPicker v-model:pureColor="node.bg_color10" useType="pure" format="hex" lang="En"
                            shape="circle" v-on:pureColorChange="node.changeColor('bg_color10', $event)" />
                    </template>
                    <template v-if="node.bg_color20">
                        <form-label class="mr-2 ">bg-color 20</form-label>
                        <ColorPicker v-model:pureColor="node.bg_color20" useType="pure" format="hex" lang="En"
                            shape="circle" v-on:pureColorChange="node.changeColor('bg_color20', $event)" />
                    </template>
                    <template v-if="node.fg_color">
                        <form-label class="mr-2">fg-color</form-label>
                        <ColorPicker v-model:pureColor="node.fgColor" useType="pure" format="hex" lang="En" shape="circle"
                            v-on:pureColorChange="node.setFgColor($event)" />
                    </template>
                    <template v-if="node.border_color">
                        <form-label class="mr-2">border-color</form-label>
                        <ColorPicker v-model:pureColor="node.border_color" useType="pure" format="hex" lang="En"
                            shape="circle" v-on:pureColorChange="node.setBorderColor($event)" />
                    </template>
                </div>
            </Accordion>

            <Accordion class="pr-2" title="Layer" v-if="node.type !== 'panel'">
                <div class="grid grid-cols-3 pl-2 gap-2 mt-2 mb-2">
                    <form-button v-on:click="node.layerMoveDown()">&#x2190</form-button>
                    <form-button v-on:click="node.moveToTop()">&#x2191</form-button>
                    <form-button v-on:click="node.moveUp()">&#x2192</form-button>
                </div>
            </Accordion>

            <Accordion class="pr-2" title="Action" v-if="node.hasAction">
                <form-select name="Event" v-model="node.action">
                    <option :value=name v-for="(name) in node.getLayer().getObjectEvents()" :key=name>{{ name }}</option>
                </form-select>
                <form-select name="Command" v-model="node.command">
                    <option :value=name v-for="(name) in node.getLayer().getObjectCommands(node.action)" :key=name>{{ name
                    }}</option>
                </form-select>
                <!-- <form-input type="text" v-model="node.command" /> -->
            </Accordion>
        </div>
    </div>
</template>

<script>
import { node } from 'prop-types';

import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import Accordion from './Accordion.vue';
import HassPropertiesPanel from './HassPropertiesPanel.vue';
import ListOptionsTable from './ListOptionsTable.vue';

export default {
    components: {
        Accordion,
        ColorPicker,
        HassPropertiesPanel,
        ListOptionsTable
    },
    props: {
        node: {
            type: Object,
            required: true
        }
    },
    computed: {
        xPos: function () {
            return Math.round(this.node.x());
        },
        yPos: function () {
            return Math.round(this.node.y());
        }

    },
    emits: ['updateNode', 'bg_color20'],
    mounted() {
        window.addEventListener("keyup", this.dismissModal);
    },
    beforeDestroy() {
        window.removeEventListener("keyup", this.dismissModal);
    },
    methods: {
        updateNode: function (e) {
            this.node.redraw();
        }
    }
}
</script>

