<template>
  <el-container>
    <el-header>
      <app-header :tabListM="tabListM"/>
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
      // 移动端端tab
      tabListM: [
        { id: 'analysis', label: '学情', icon: 'statistics', href: 'http://student.pigai.hexinedu.com/#/report' },
        { id: 'task', label: '任务', icon: 'task', href: 'http://student.pigai.hexinedu.com/#/tasks' },
        { id: 'read', label: '阅读', icon: 'read', href: 'http://student.pigai.hexinedu.com/#/books' },
        { id: 'write', label: '写作', icon: 'write_active' },
        { id: 'me', label: '我的', icon: 'me', href: 'http://student.pigai.hexinedu.com/#/my' }
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
