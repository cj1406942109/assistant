<template>
  <el-container>
    <el-header>
      <app-header :tabListP="tabListP"/>
    </el-header>
    <el-main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import AppHeader from './components/header'

export default {
  data () {
    return {
      title: '',
      // PC端tab
      tabListP: [
        { id: 'dashboard', label: '首页', icon: 'home', href: 'http://study.ai.fltrp.com/#/home' },
        { id: 'read', label: '拓展阅读', icon: 'read', href: 'http://study.ai.fltrp.com/#/reading/books' },
        { id: 'word', label: '词汇满分', icon: 'word', href: 'http://study.ai.fltrp.com/#/words/home' },
        { id: 'practice', label: '个性练习', icon: 'practice', href: 'http://study.ai.fltrp.com/#/exercise/books' },
        { id: 'write', label: '写作精批', icon: 'write' }
      ]
    }
  },
  components: {
    'app-header': AppHeader
  }
}
</script>

<style lang="scss" scoped>
</style>
