<template>
  <div v-loading="listLoading">
    <el-row class="mobile-main">
      <el-col class="mobile-content-wrapper">
        <div v-if="essayListAll.length === 0" class="no-essay">
          <div class="help"><a href="#"><svg-icon icon-class="help"></svg-icon>学习如何使用？</a></div>
          <img src="./images/no-essay-mobile.jpg" alt="没有开始写作">
          <p>你还没有写过作文，<br>完成作文，助教君为您批改。</p>
          <el-button type="primary" @click="goEdit()">开始第 1 次写作</el-button>
        </div>
        <div v-else class="essay-all">
          <mt-button type="primary" size="large" @click="goEdit()">开始写作</mt-button>
          <s-list v-for="item in essayList" :key="item.id">
            <template slot="title">
              <span>{{item.time_create.split(' ')[0]}}</span>
              <s-tag v-if="item.advice_count === 0">完美</s-tag>
              <span v-if="item.advice_count > 0">（{{item.advice_count}} 处可优化）</span>
            </template>
            <span slot="content">{{item.name}}</span>
            <mt-button slot="button" size="small" type="primary" @click="goEdit(item)">{{item.status | formatStatus}}</mt-button>
          </s-list>
          <mt-button type="primary" size="large" @click="loadMore" v-show="showLoadMore">查看更多作文</mt-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SList from '@/components/s-list'
import STag from '@/components/s-tag'

import {
  login,
  getAccountInfo,
  getArticleList
} from '@/api'

export default {
  data () {
    return {
      essayList: [],
      essayListAll: [],
      listLoading: true,
      user: '',
      essayTotal: 0,
      wordsTotal: 0,
      essayPerfect: 0,
      showLoadMore: true
    }
  },
  filters: {
    formatStatus (val) {
      if (val === 0) {
        return '继续写作'
      } else {
        return '查看'
      }
    }
  },
  components: {
    SList, STag
  },
  methods: {
    getArticleList () {
      this.listLoading = true
      getArticleList().then(data => {
        this.listLoading = false
        if (data) {
          this.essayListAll = data
          this.essayTotal = this.essayListAll.length
          this.essayListAll.forEach(ele => {
            if (ele.status === 2) {
              this.wordsTotal += ele.words_count
              if (ele.advice_count === 0) {
                this.essayPerfect += 1
              }
            }
          })
          // 默认显示前7条
          this.essayList = this.essayListAll.slice(0, 7)
        }
      })
    },
    goEdit (essay) {
      if (essay) {
        if (essay.status === 0) {
          this.$router.push({ name: 'write-edit', params: { id: essay.uid } })
        } else {
          this.$router.push({ name: 'write-result', params: { id: essay.batch_uid } })
        }
      } else {
        this.$router.push({ name: 'write-edit' })
      }
    },
    loadMore () {
      if (this.essayList.length < this.essayListAll.length) {
        this.essayList = this.essayList.concat(this.essayListAll.slice(this.essayList.length, this.essayList.length + 7))
        this.showLoadMore = this.essayList.length !== this.essayListAll.length
      }
    }
  },
  created () {
    login('owzm0wwgIDGwBabngmUAsZhkuiEg', 'owzm0wwgIDGwBabngmUAsZhkuiEg').then(data => {
      if (data) {
        this.user = data
        localStorage.setItem('user', JSON.stringify(data))
        this.getArticleList()
      }
    })
    // getAccountInfo().then(data => {
    //   if (data) {
    //     this.getArticleList()
    //   }
    // })
  }
}
</script>

<style lang="scss" scoped>
  .mobile-content-wrapper {
    color: #666;
    .no-essay {
      background-color: #fff;
      margin: -20px -10px;
      min-height: calc(100vh - 106px);
      display: flex;
      flex-direction: column;
      align-items: center;
      .help {
        margin-top: 10px;
        width: 100%;
        text-align: right;
        padding-right: 20px;
        font-size: 14px;
        a {
          color: #409EFF;
        }
        .svg-icon {
          vertical-align: -0.2em;
          margin-right: 5px;
        }
      }
      img {
        margin-top: 30px;
        width: 150px;
        display: block;
      }
      p {
        margin: 30px 0 10px;
        line-height: 30px;
      }
    }
    .essay-all {
      margin: -10px 0 -20px;
      & > button {
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
  }
</style>
