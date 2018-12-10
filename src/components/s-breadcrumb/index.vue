<template>
  <div class="s-breadcrumb">
    <router-link :to="{ name: routeName }"><span><svg-icon icon-class="back"></svg-icon>返回</span></router-link>
    {{title}}
  </div>
</template>

<script>
export default {
  name: 's-breadcrumb',
  props: {
    routeName: {
      type: String
    },
    title: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .s-breadcrumb {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    color: #606266;
    text-align: left;
    span {
      display: inline-block;
      margin-right: 20px;
    }
    .svg-icon {
      vertical-align: -0.25em;
      margin-right: 5px;
    }
  }
</style>
