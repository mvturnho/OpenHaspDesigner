<template>
    <Accordion class="pr-2" title="Homeassistant">
        <form-input name="entity id" type="text" v-model="node.hass_entityid" />
        <form-select name="Event" v-model="node.hass_event">
            <option :value=name v-for="(name) in node.getLayer().getObjectEvents()" :key=name>{{ name }}</option>
        </form-select>
        <form-input name="Service" type="text" v-model="node.hass_service" />
    </Accordion>
</template>

<script>
import { node } from 'prop-types';
import Accordion from './Accordion.vue';

export default {
    components: {
        Accordion,
    },
    props: {
        node: {
            type: Object,
            required: true
        }
    },
    emits: ['update:node'],
    methods: {
        updateNode: function (e) {
            // console.log(e)
        }
    }
}
</script>