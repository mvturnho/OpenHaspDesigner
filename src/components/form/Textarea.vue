<template>
    <div class="ml-2">
        <label class="block text-white text-sm font-bold mb-1">
            <template v-if="name">
                {{ name }}
            </template>
        </label>
        <textarea class="w-full py-2 px-3 border border-gray-400 bg-white text-gray-900 appearance-none inline-block
                              placeholder-opacity-100 placeholder-gray-500 border rounded focus:outline-none" ref="input"
            :disabled="disabled" :readonly="readonly" :rows="rows" :wrap="wrap" :class="{
                'border border-red-500': error, 'hover:border-red-500': error,
                'bg-gray-200': disabled, 'hover:border-gray-500': !disabled,
                'focus:border-blue-500': !readonly
            }" :type="type" :id="id" :name="name" :placeholder="placeholder" :required="required" :value="modelValue"
            v-on:input="updateValue($event.target.value)" />

        <p v-if="error" class="mt-1 text-red-500 italic">
            {{ error }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        id: String,
        name: String,
        modelValue: {
            required: false
        },
        required: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            required: false
        },
        type: {
            type: String,
            default: 'text',
            required: false
        },
        error: {
            type: String,
            required: false
        },
        wrap: {
            required: false,
            type: String,
            default: "off"
        },
        disabled: {
            required: false,
            type: Boolean,
            default: false
        },
        readonly: {
            required: false,
            type: Boolean,
            default: false
        },
        rows: {
            required: false,
            type: Number
        },
    },
    emits: ['update:modelValue'],
    mounted() {
        if (typeof this.min !== 'undefined') {
            this.$refs.input.min = this.min.toString();
        }
        if (typeof this.max !== 'undefined') {
            this.$refs.input.max = this.max.toString();
        }
    },
    methods: {
        updateValue: function (value) {
            this.$emit('update:modelValue', value);
        }
    }
}
</script>