<template>
    <div class="checkbox flex relative w-100"
         :class="{ 'checked': isChecked, 'cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
         @click="toggle"
    >
        <span class="checkbox__checkbox border border-gray-400 my-auto">
            <svg class="icon-svg checkbox__icon" viewBox="0 0 26 26">
                <path
                    d="m.3,14c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1v-8.88178e-16c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.4 0.4,1 0,1.4l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.5-0.1-0.7-0.3l-7.8-8.4-.2-.3z"/>
            </svg>
        </span>
        <template v-if="hasDefaultSlot">
            <slot></slot>
        </template>
        <template v-else>
            <label v-if="label" class="checkbox__label mx-1 my-auto"
                   :class="{'cursor-not-allowed': disabled, 'cursor-pointer': !disabled}"
                   v-html="label" >
            </label>
        </template>
    </div>
</template>

<script>
    export default {
        props: {
            modelValue: {
                type: Boolean,
                required: false
            },
            checked: {
                type: Boolean,
                required: false
            },
            label: {
                type: String,
                required: false
            },
            disabled: {
                required: false,
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isChecked: this.checked === true
            }
        },
        mounted () {
            this.isChecked = this.modelValue ? this.modelValue : false;
        },
        methods: {
            toggle(e) {
                this.$emit('click', e);
                if (this.disabled) {
                    return;
                }
                this.isChecked = !this.isChecked;
            }
        },
        watch: {
            modelValue: function (newVal) {
                this.isChecked = newVal;
            },
            checked: function (newVal) {
                this.isChecked = newVal;
            },
            isChecked: function () {
                this.$emit('change', this.isChecked);
                this.$emit('input', this.isChecked);
            }
        },
        computed: {
            hasDefaultSlot() {
                return !!this.$slots.default
            }
        }
    }
</script>

<style scoped>
    .checkbox, .checkbox label {
        transition: 200ms;
    }
    .checkbox__checkbox {
        display: flex;
        border-radius: 3px;
        background-color: white;
        transition: border .1s ease-out, background-color .1s ease-out;
        height: 1.3rem;
        width: 1.3rem;
        min-height: 1.3rem;
        min-width: 1.3rem;
        left: 0;
    }
    .checkbox:hover .checkbox__checkbox {
        border-color: #a0aec0;
    }
    .checkbox.checked .checkbox__checkbox {
        background-color: #147cb8;
        border-color: #147cb8;
    }
    .checkbox__icon {
        width: 0.7rem;
        height: 0.7rem;
        margin: auto;
        transition: transform .2s ease-out;
        fill: white;
        transform: scale(0);
    }
    .checkbox.checked .checkbox__icon {
        transform: scale(1);
    }
</style>