<template>
  <div class="s-split-col">
    <div><slot name="l-col"></slot></div>
    <div><slot name="r-col"></slot></div>
  </div>
</template>

<script>
export default {
  name: 's-split-col'
}
</script>

<style lang="scss" scoped>
  .s-split-col {
    padding: 10px;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    div:nth-of-type(1) {
      border-right: 1px solid #eee;
      padding-right: 50px;
    }
    div:nth-last-of-type(1) {
      padding-left: 50px;
    }
  }
</style>
