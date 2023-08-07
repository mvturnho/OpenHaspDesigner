<template>
    <div class="card border-gray-300" :class="{ 'p-4 md:p-8': padding }">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            padding: {
                type: Boolean,
                required: false,
                default: true
            }
        }
    }
</script>

<style>
    .card {
        background-color: white;
        border-radius: .25rem;
        border-width: 1px;
        box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)
    }
</style>