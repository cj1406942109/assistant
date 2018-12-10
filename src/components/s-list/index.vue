<template>
  <div class="s-list">
    <div class="list-title">
      <slot name="title"></slot>
    </div>
    <div class="list-body">
      <p><slot name="content"></slot></p>
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 's-list'
}
</script>

<style lang="scss" scoped>
  .s-list {
    border-radius: 5px;
    margin: 10px 0;
    font-size: 14px;
    background-color: #fff;
    border: 1px solid #eee;
    box-shadow: 2px 2px 2px #eee;
    .list-title {
      padding: 0 20px;
      height: 40px;
      color: #666;
      line-height: 40px;
      text-align: left;
    }
    .list-body {
      color: #333;
      text-align: justify;
      padding: 5px 20px;
      border-top: 1px solid #eee;
      min-height: 40px;
      line-height: 25px;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      button {
        margin-left: 10px;
        min-width: 80px;
        height: 30px;
      }
    }
  }
</style>
