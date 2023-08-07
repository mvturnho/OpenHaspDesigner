<template>
    <span>
        <transition name="modal-fade">
            <div v-if="show"
                class="outside-modal z-10 fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div class="fixed inset-0 transition-opacity">
                    <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
                </div>
            </div>
        </transition>

        <transition name="modal">
            <div v-if="show"
                class="outside-modal z-10 fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">

                <div class="inner-modal bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full"
                    :class="{
                        'sm:max-w-lg': width === 'small',
                        'sm:max-w-xl': width === 'medium',
                        'sm:max-w-2xl': width === 'large',
                        'sm:max-w-4xl': width === 'extra-large',
                    }">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start flex-col">
                            <div @click="$emit('update:show', false)"
                                class="absolute text-xl top-0 right-0 mt-3 mr-4 cursor-pointer">
                                &#10005;
                            </div>

                            <slot></slot>
                        </div>
                    </div>
                    <div v-if="$slots['footer']" class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </transition>
    </span>
</template>

<script>
import OnClickOutside from "./OnClickOutside.vue";
export default {
    props: {
        show: {
            required: false,
            default: false
        },
        width: {
            required: false,
            default: 'small'
        }
    },
    emits:['update:show'],
    mounted() {
        window.addEventListener("keyup", this.dismissModal);
    },
    beforeDestroy() {
        window.removeEventListener("keyup", this.dismissModal);
    },
    methods: {
        dismissModal(e) {
            if (e.key === 'Escape') {
                this.$emit('update:show', false);
            }
        },
        cancel(e) {
            if (!e.target.classList.contains('outside-modal')) {
                return;
            }
            this.$emit('update:show', false);
        }
    }
}
</script>

<style>
.inner-modal {
    max-height: calc(100vh - 20px);
    overflow-y: hidden;
}

.modal-enter-active {
    transition: all .4s ease;
}

.modal-leave-active {
    transition: all .4s ease;
}

.modal-enter,
.modal-leave-to

/* .slide-fade-leave-active below version 2.1.8 */
    {
    transform: scale(0.95);
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .2s;
}

.modal-fade-enter,
.modal-fade-leave-to {
    opacity: 0;
}
</style>