<template>
    <div class="flex flex-wrap">
        <button :type="type" :class="{
            'border border-transparent bg-blue-600 text-white hover:bg-blue-500 focus:border-blue-700': color === 'primary',
            'border border-transparent bg-red-600 text-white hover:bg-red-500 focus:border-red-700': color === 'danger',
            'border border-transparent bg-orange-600 text-white hover:bg-orange-500 focus:border-orange-700': color === 'warning',
            'border border-transparent bg-green-600 text-white hover:bg-green-500 focus:border-green-700': color === 'success',
            'border border-transparent bg-grey-600 text-white hover:bg-grey-500 focus:border-grey-700': color === 'dark',
            'border border-transparent bg-gray-700 text-white hover:bg-gray-400 focus:border-gray-500 ': color === 'gray',
            'border border-gray-400 bg-white text-gray-700 hover:text-gray-500 focus:border-blue-300': color === 'light',
            'border border-gray-400 bg-white text-gray-700 opacity-50 pointer-events-none': color === 'disabled',
            'flex justify-center items-center w-full h-9 rounded-md px-2 py-1 text-base leading-6 font-medium shadow-sm focus:outline-none focus:ring-red transition ease-in-out duration-150 sm:text-xs sm:leading-5': color !== 'rooster',
            'flex justify-center items-center w-full h-12 bg-blue-600 hover:bg-blue-700 border-b-4 border-blue-700 rounded text-white font-bold focus:outline-none': color === 'rooster'
        }" :style="{ height: height ? height : null }" ref="btnRef" v-on:mouseenter="toggleTooltip()" v-on:mouseleave="toggleTooltip()">
            <template v-if="icon !== undefined">
                <img :src=this.icon width="30">
            </template>
            <template v-else>
                <slot></slot>
            </template>
        </button>

        <div ref="tooltipRef" v-bind:class="{ 'hidden': !tooltipShow, 'block': tooltipShow }"
            class="bg-gray-800 opacity-90 border-2 border-blue-300  block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg">
            <div>
                <div class="bg-gray-400 text-white opacity-75 font-semibold p-1 pl-3 mb-0 border-b border-solid border-slate-100 ">
                    <slot></slot>
                </div>
                <div class="text-white p-3">
                    <img :src=this.docicon />
                    {{ title }}
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
export default {
    props: {
        type: {
            required: false,
            type: String,
            default: 'button'
        },
        color: {
            required: false,
            type: String,
            default: 'primary'
        },
        title: {
            required: false,
            type: String,
            default: ''
        },
        height: {
            required: false,
            type: String
        },
        src: {
            required: false,
            type: String
        },
        icon: {
            required: false,
            type: String
        },
        docicon: {
            required: false,
            type: String
        }
    },
    data() {
        return {
            tooltipShow: false,
        }
    },
    methods: {
        toggleTooltip: function () {
            if (this.tooltipShow) {
                this.tooltipShow = false;
            } else {
                this.tooltipShow = true;
                createPopper(this.$refs.btnRef, this.$refs.tooltipRef, {
                    placement: "right"
                });
            }
        }
    }
}
</script>