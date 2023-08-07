<template>
    <div class="ml-2">
        <label class="block text-white text-sm font-bold mb-1">
            <template v-if="name">
                {{ name }}
            </template>
        </label>
        <select
            class="r-select w-full py-1 px-3 border border-gray-400 hover:border-gray-500 focus:border-blue-500 bg-white
                          text-gray-900 appearance-none inline-block w-full text-gray-900 border rounded focus:outline-none"
            :class="{ 'border border-red-500': error, 'hover:border-red-500': error }" :id="id" :required="required"
            v-model="computedValue">
            <template v-if="placeholder">
                <option>
                    {{ placeholder }}
                </option>
            </template>
            <slot></slot>
        </select>

        <p v-if="error" class="mt-1 text-red-500 italic">
            {{ error }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String
        },
        modelValue: {
            type: [String, Number, Boolean, Object, Array, Function],
            default: null
        },
        name: {
            type: String,
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
        error: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            selected: this.modelValue
        }
    },
    emits: ['update:modelValue'],
    computed: {
        computedValue: {
            get() {
                return this.selected
            },
            set(value) {
                this.selected = value;
                this.$emit('update:modelValue', value);
            }
        },
    },
    watch: {
        modelValue(value) {
            this.selected = value;
        }
    }
}
</script>