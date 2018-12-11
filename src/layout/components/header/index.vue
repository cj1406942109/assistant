<template>
  <el-row>
    <el-col class="app-header-wrapper">
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
  .app-header-wrapper {
    .mint-header.is-fixed {
      height: 50px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
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
