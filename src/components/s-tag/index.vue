<template>
  <span class="s-tag" v-bind:style="tagStyle">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 's-card',
  data () {
    return {
      tagStyle: {
        background: this.tagBg,
        color: this.tagColor,
        border: `1px solid ${this.borderColor}`
      }
    }
  },
  props: {
    tagBg: {
      type: String,
      default: '#FF6E36'
    },
    tagColor: {
      type: String,
      default: '#fff'
    },
    borderColor: {
      type: String,
      default: '#FF6E36'
    }
  }
}
</script>

<style lang="scss" scoped>
  .s-tag {
    margin: 0 10px;
    border-radius: 3px;
    padding: 2px 8px;
  }
</style>
