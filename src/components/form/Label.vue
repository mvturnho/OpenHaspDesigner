<template>
    <label class="block text-white text-sm font-bold mb-2">
        <template v-if="name">
            {{ name }}
        </template>
        <slot></slot>
    </label>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: false
        }
    }
}
</script>