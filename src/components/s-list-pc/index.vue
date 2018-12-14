<template>
  <div class="s-list-pc">
    <div class="list-title">
      <p><slot name="title"></slot></p>
      <svg-icon icon-class="time"></svg-icon>{{date}}
    </div>
    <slot name="button"></slot>
  </div>
</template>

<script>
export default {
  name: 's-list-pc',
  props: {
    date: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .s-list-pc {
    margin: 10px 0;
    height: 100px;
    padding: 0 30px;
    border: 1px solid #eee;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .list-title {
      text-align: left;
      color: #666;
      max-width: calc(100% - 200px);
      overflow: hidden;
      p {
        margin: 10px 0;
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: normal;
        font-size: 20px;
        color: #333;
        span {
          font-size: 12px;
          vertical-align: middle;
        }
      }
      .svg-icon {
        margin-right: 10px;
      }
    }
  }
</style>
