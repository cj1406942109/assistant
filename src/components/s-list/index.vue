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
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      p {
        max-width: calc(100% -250px);
        overflow: hidden;
        // 设置之后发现出现的省略号与文本中部对齐，而不是正常的与底部对齐
        // 研究良久之后发现是因为字体设置为“等线”引起的
        // 并非css问题
        text-overflow: ellipsis;
        white-space:nowrap;
      }
      button {
        margin-left: 10px;
        min-width: 80px;
        height: 30px;
      }
    }
  }
</style>
