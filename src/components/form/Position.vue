<template>
    <form-label name="position"/>

    <slot></slot>
</template>

<script>
export default {
    props: {
        position: {
            type: String,
            required: false
        }
    },
    
}
</script>