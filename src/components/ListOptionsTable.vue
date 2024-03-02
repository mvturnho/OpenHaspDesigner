<template>
    <div class="flex mt-2 relative">
        <form-label class="ml-2">List options</form-label>
        <button class="absolute right-0" @click="addOption()"><font-awesome-icon icon="fa-solid fa-plus-circle"
                style="color: white;" /></button>
    </div>

    <div v-for="(val, index) in  options ">
        <div class="flex">
            <form-input type="text" v-model="options[index]" />
            <button class="pl-2 " @click="deleteOption(index)"><font-awesome-icon icon="fa-solid fa-trash-can"
                    style="color: white;" /></button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true
        }
    },
    emits: ['updateNode'],
    methods: {
        addOption: function (e) {
            const num = this.options.length+1;
            this.options.push("Option" + num);
            this.$emit('updateNode')
        },
        deleteOption: function (index) {
            this.options.splice(index, 1);
            this.$emit('updateNode')
        }
    }
}
</script>