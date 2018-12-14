<template>
  <div class="s-icon-title" v-bind:class="{ 'is-title': title, rect_mobile: rect && mobile, rect_pc: rect && !mobile }">
    <p>
      <svg-icon :icon-class="icon" v-if="icon"></svg-icon>
      <slot></slot>
    </p>
    <span><slot name="info"></slot></span>
  </div>
</template>

<script>
export default {
  name: 's-icon-title',
  props: {
    title: {
      type: Boolean,
      default: true
    },
    rect: {
      type: Boolean,
      default: true
    },
    mobile: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .s-icon-title {
    text-align: left;
    margin: 0;
    padding: 10px 0;
    color: #333;
    display: flex;
    justify-content: space-between;
    &.is-title {
      p {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        .svg-icon {
          margin: 0 5px;
        }
      }
    }
    &.rect_mobile {
      background: #fff url('./images/rect_mobile.svg') no-repeat 0;
      background-size: 4px auto;
      margin-left: 10px;
      padding-left: 15px;
    }
    &.rect_pc {
      background: #fff url('./images/rect_pc.svg') no-repeat 0;
      background-size: auto 20px;
      margin-left: 10px;
      padding-left: 15px;
    }
    p {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      color: #666;
    }
    span {
      font-size: 14px;
      font-weight: normal;
      line-height: 20px;
    }
  }
</style>
