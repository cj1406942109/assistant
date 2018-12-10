<template>
  <div v-loading="listLoading">
    <el-row class="hidden-xs-only pc-main">
      <el-col class="pc-content-wrapper">
        <div v-if="essayListAll.length === 0" class="no-essay">
          <img src="./images/no-essay-pc.jpg" alt="没有开始写作">
          <p>你还没有开始写作</p>
          <el-button type="primary" @click="goEdit()">开始第 1 次写作</el-button>
        </div>
        <div v-else class="essay-all">
          <div class="statistics">
            <div>
              <s-big-num :number="essayTotal" unit="篇">写作篇数</s-big-num>
              <s-big-num :number="wordsTotal" unit="词">总词数</s-big-num>
              <s-big-num :number="essayPerfect" unit="篇">完美篇章</s-big-num>
            </div>
            <el-button type="primary" @click="goEdit()">开始第 {{this.essayListAll.length + 1}} 次写作</el-button>
          </div>
          <div class="essay-list">
            <h3>作文列表</h3>
            <s-list-pc :date="item.time_create" v-for="item in essayList" :key="item.id">
              <template slot="title">
                {{item.name}}
                <s-tag v-if="item.advice_count === 0">完美</s-tag>
                <s-tag v-if="item.advice_count > 0" tagColor="#FF6E36" tagBg="#fff">{{item.advice_count}} 处可优化</s-tag>
              </template>
              <template slot="button"><el-button :plain="item.status === 2" type="primary" @click="goEdit(item)">{{item.status | formatStatusPc}}</el-button></template>
            </s-list-pc>
            <el-button class="load-more" @click="loadMore" v-show="showLoadMore">查看更多</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="hidden-sm-and-up mobile-main">
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
              <span>{{item.time_create}}</span>
              <s-tag v-if="item.advice_count === 0">完美</s-tag>
              <span v-if="item.advice_count > 0">（{{item.advice_count}} 处可优化）</span>
            </template>
            <span slot="content">{{item.name}}</span>
            <mt-button slot="button" size="small" type="primary" @click="goEdit(item)">{{item.status | formatStatusPc}}</mt-button>
          </s-list>
          <mt-button type="primary" size="large" @click="loadMore" v-show="showLoadMore">查看更多作文</mt-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SList from '@/components/s-list'
import SListPc from '@/components/s-list-pc'
import STag from '@/components/s-tag'
import SBigNum from '@/components/s-big-num'

import {
  // login,
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
    formatStatusPc (val) {
      if (val === 0) {
        return '继续写作'
      } else if (val === 1) {
        return '去看看'
      } else if (val === 2) {
        return '去看看'
      }
    }
  },
  components: {
    SList, SListPc, STag, SBigNum
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
          if (this.essayListAll.length >= 4) {
            this.essayList = this.essayListAll.slice(0, 4)
          }
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
        this.essayList = this.essayList.concat(this.essayListAll.slice(this.essayList.length, this.essayList.length + 10))
        this.showLoadMore = this.essayList.length !== this.essayListAll.length
      }
    }
  },
  created () {
    // login('owzm0wwgIDGwBabngmUAsZhkuiEg', 'owzm0wwgIDGwBabngmUAsZhkuiEg').then(data => {
    //   if (data) {
    //     this.user = data
    //     localStorage.setItem('user', JSON.stringify(data))
    //     this.getArticleList()
    //   }
    // })
    getAccountInfo().then(data => {
      if (data) {
        this.getArticleList()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .pc-content-wrapper {
    padding: 20px;
    .no-essay {
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 180px;
      }
      p {
        margin: 30px 0;
        color: #999;
        font-size: 14px;
      }
    }
    .essay-all {
      button {
        width: 150px;
      }
      .statistics {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding: 0 30px;
        div {
          width: calc(100% - 60px);
          max-width: 650px;
          padding: 0 40px 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .essay-list {
        h3 {
          margin-top: 30px;
          padding-left: 10px;
          text-align: left;
          color: #000;
          font-weight: normal;
        }
        .load-more {
          margin-top: 20px;
        }
      }
    }
  }
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
