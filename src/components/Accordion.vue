<template>
    <div class="mb-2 pb-2  bg-gray-600 rounded">
        <div v-on:click="isOpen = !isOpen" class="bg-gray-600 text-white p-2 text-sm font-bold rounded cursor-pointer">{{
            title }}</div>
        <template v-if="isOpen">
            <slot></slot>
        </template>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            isOpen: false
        }
    },
    name: 'Accordion',
    props: {
        title: String,
    }
}
</script>