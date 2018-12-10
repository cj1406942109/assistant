<template>
  <p class="s-big-num">
    <slot></slot><br>
    <span class="number"><ICountUp :endVal="number"/></span>
    <span class="unit">{{unit}}</span>
  </p>
</template>

<script>
import ICountUp from 'vue-countup-v2'
export default {
  name: 's-big-num',
  components: {
    ICountUp
  },
  props: {
    number: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: '个'
    }
  }
}
</script>

<style lang="scss" scoped>
  .s-big-num {
    font-size: 16px;
    color: #666;
    margin: 0;
    .number {
      display: inline-block;
      font-size: 24px;
      margin-right: 10px;
      margin-top: 10px;
      color: #333;
    }
  }
</style>
