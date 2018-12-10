<template>
  <el-row>
    <el-col class="hidden-xs-only">
      <div class="pc-header">
        <h3 class="nav-brand">外研 AI 智能学习平台</h3>
        <el-menu default-active="write" active-text-color="#5093F0" mode="horizontal">
          <el-menu-item :index="item.id" v-for="item in tabListP" :key="item.id" @click="tabChangeHandler(item)">{{item.label}}</el-menu-item>
        </el-menu>
        <span class="user-test"><svg-icon icon-class="user"></svg-icon>合心测试</span>
      </div>
    </el-col>
    <el-col class="hidden-sm-and-up">
      <!-- <mt-header fixed :title="$route.meta.title"></mt-header> -->
      <mt-header fixed :title="$route.meta.title">
        <router-link to="/home" slot="left">
          <mt-button>
            <svg-icon icon-class="home" slot="icon"></svg-icon>首页
          </mt-button>
        </router-link>
        <router-link to="/" slot="right">
          咨询
          <mt-button>
            <svg-icon icon-class="message" slot="icon"></svg-icon>
          </mt-button>
        </router-link>
      </mt-header>
      <mt-tabbar v-if="$route.meta.showTab" v-model="activeTab" fixed>
        <mt-tab-item v-for="item in tabListM" :key="item.id" :id="item.id" @click.native="tabChangeHandler(item)">
          <svg-icon :icon-class="item.icon" slot="icon"></svg-icon>
          {{item.label}}
        </mt-tab-item>
      </mt-tabbar>
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
    tabListM: {
      type: Array
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
  .hidden-xs-only {
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
  .hidden-sm-and-up {
    .mint-header.is-fixed {
      height: 50px;
      background-color: #fff;
      font-size: 14px;
      color: #333;
      .svg-icon {
        margin: 0 5px;
        vertical-align: 0.1em;
      }
    }
    .mint-tabbar {
      background-color: #fff;
      border-top: 1px solid #eee;
      .svg-icon {
        width: inherit;
      }
      .mint-tab-item.is-selected {
        color: #FFDA44;
        background: none;
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
