<template>
  <el-row>
    <el-col class="app-header-wrapper">
      <div class="pc-header">
        <h3 class="nav-brand">外研 AI 智能学习平台</h3>
        <el-menu default-active="write" active-text-color="#5093F0" mode="horizontal">
          <el-menu-item :index="item.id" v-for="item in tabListP" :key="item.id" @click="tabChangeHandler(item)">{{item.label}}</el-menu-item>
        </el-menu>
        <span class="user-test"><svg-icon icon-class="user"></svg-icon>合心测试</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      activeTab: 'write'
    }
  },
  props: {
    title: {
      type: String
    },
    tabListP: {
      type: Array
    }
  },
  methods: {
    tabChangeHandler (tab) {
      if (tab.id !== 'write') {
        window.location.href = tab.href
      } else {
        this.$router.push({ name: tab.id })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-header-wrapper {
    border-bottom: 1px solid #eee;
    .pc-header {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
      .nav-brand {
        height: 60px;
        line-height: 60px;
        margin: 0;
        color: #5093F0;
      }
      .el-menu {
        border-bottom: none;
        .el-menu-item {
          color: #666;
          &:hover {
            color: #333;
          }
          &.isactive {
            color: #5093F0;
          }
        }
      }
      .user-test {
        color: #666;
        font-size: 14px;
        line-height: 60px;
        cursor: pointer;
        &:hover {
          color: #333;
        }
        .svg-icon {
          color: #D8E0EB;
          vertical-align: -0.2em;
          margin-right: 5px;
        }
      }
    }
  }
  @media screen and (min-width: 1200px){
    .pc-header {
      width: 1160px;
      margin: 0 auto;
    }
  }
</style>
