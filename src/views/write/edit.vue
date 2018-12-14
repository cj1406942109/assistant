<template>
  <div>
    <el-row class="mobile-main">
      <el-col class="mobile-content-wrapper">
        <el-form ref="form" :model="form">
          <el-form-item v-loading="loading">
            <el-input clearable v-model="form.name" placeholder="作文标题"></el-input>
          </el-form-item>
          <div class="word-count">{{wordCount}} 词</div>
          <el-form-item v-loading="loading">
            <el-input clearable type="textarea" v-model="form.answer" placeholder="开始写作文"></el-input>
          </el-form-item>
          <div class="prompt-info">使用电脑浏览器打开学生端 <a href="http://ai.fltrp.com">ai.fltrp.com</a>，获得更好的书写体验。</div>
        </el-form>
        <mt-tabbar fixed>
          <mt-tab-item><mt-button :loading="btnLoading" type="default" size="large" plain @click="save">先保存</mt-button></mt-tab-item>
          <mt-tab-item><mt-button type="primary" size="large" @click="submit">现在提交</mt-button></mt-tab-item>
        </mt-tabbar>
        <div class="mobile-full-screen-mask" v-if="submitLoading">
          <app-header/>
          <img src="./images/loading.gif" alt="">
          <p>作文精批中...</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getArticleContentById, saveArticle, commitArticle } from '@/api'
import AppHeader from '@/layout/components/header'

export default {
  data () {
    return {
      form: {
        name: '',
        answer: ''
      },
      localEssayList: [],
      loading: true,
      btnLoading: false,
      submitLoading: false
    }
  },
  created () {
    this.localEssayList = JSON.parse(localStorage.getItem('essayList')) || []
    const currentUid = this.$route.params.id || null
    // 如果本地存储文章列表有文章
    if (this.localEssayList.length > 0) {
      // 判断当前文章是否在本地存储中
      let isSaved = false
      this.localEssayList.forEach(ele => {
        // 如果当前作文有uid，且正在书写的作文有uid，且两者相同
        // 或者
        // 当前作文没有uid，且正在书写的作文没有uid，且当前作文存储的标题和内容不同时为空
        // 则，弹窗确认，是否恢复本地文章
        if (('uid' in ele && ele.uid === currentUid) || (!('uid' in ele) && !currentUid && !(!ele.name && !ele.answer))) {
          isSaved = true
          this.$messagebox.confirm('检测到有未提交的作文，是否恢复之前的写作进度？').then(action => {
            this.loading = false
            this.form = ele
          }).then(() => {
            this.loading = false
            this.form = ele
          }).catch(() => {
            if (currentUid) {
              this.getArticle()
            } else {
              this.loading = false
            }
          })
        }
      })
      // 如果本地存储没有该文章
      if (!isSaved) {
        if (currentUid) {
          this.getArticle()
        } else {
          this.loading = false
        }
      }
    } else {
      if (currentUid) {
        this.getArticle()
      } else {
        this.loading = false
      }
    }
  },
  computed: {
    wordCount () {
      let text = this.form.answer
      // 中文字符替换为空格
      text = text.replace(/[\u4e00-\u9fa5]+/g, ' ')
      // 将换行符，前后空格不计算为单词数
      text = text.replace(/\n|\r|^\s+|\s+$/gi, '')
      // 多个空格替换成一个空格
      text = text.replace(/\s+/gi, ' ')
      let match = text.match(/\s/g)
      if (match) {
        return match.length + 1
      } else if (text) {
        return 1
      }
      return 0
    }
  },
  watch: {
    // localstorage 实时存储
    // 修改存储逻辑为存储作文列表
    'form.name': function (val, oldVal) {
      if (oldVal !== val) {
        this.saveLocalEssay()
      }
    },
    'form.answer': function (val, oldVal) {
      if (oldVal !== val) {
        this.saveLocalEssay()
      }
    }
  },
  components: {
    AppHeader
  },
  methods: {
    // 将文章保存到本地存储
    saveLocalEssay () {
      // 判断本地存储作文列表中是否有当前作文
      let isSaved = false
      this.localEssayList.forEach(ele => {
        // 当前作文有uid 且 页面正在书写的作文有uid 且 两者相同， 则为同一篇作文
        if ('uid' in ele && 'uid' in this.form && ele.uid === this.form.uid) {
          ele = this.form
          isSaved = true
        } else {
          // 当前作文没有uid，并且页面正在书写的作文也没有uid，则为同一篇作文（新添加的作文）
          if (!('uid' in ele) && !('uid' in this.form)) {
            ele = this.form
            isSaved = true
          }
        }
      })
      if (!isSaved) {
        this.localEssayList.push(this.form)
      }
      localStorage.setItem('essayList', JSON.stringify(this.localEssayList))
    },
    // 保存和提交某篇文章之后，则将其从本地存储移除
    removeLocalEssay () {
      this.localEssayList.forEach((ele, index) => {
        if ('uid' in this.form) {
          if (ele.uid === this.form.uid) {
            this.localEssayList.splice(index, 1)
          }
        } else {
          if (!('uid' in ele)) {
            this.localEssayList.splice(index, 1)
          }
        }
      })
      localStorage.setItem('essayList', JSON.stringify(this.localEssayList))
    },
    getArticle () {
      const currentUid = this.$route.params.id || null
      getArticleContentById(currentUid).then(data => {
        this.loading = false
        if (data) {
          this.form = JSON.parse(JSON.stringify(data))
        } else {
          this.$toast({
            message: '获取作文信息失败'
          })
        }
      })
    },
    save () {
      this.btnLoading = true
      saveArticle(this.form).then(data => {
        this.btnLoading = false
        if (data) {
          this.removeLocalEssay()
          this.form = JSON.parse(JSON.stringify(data))
          this.$toast({
            message: '保存成功'
          })
        } else {
          this.$toast({
            message: '保存失败'
          })
        }
      })
    },
    submit () {
      this.submitLoading = true
      commitArticle({ ...this.form, wordsCount: this.wordCount }).then(data => {
        this.submitLoading = false
        if (data) {
          this.removeLocalEssay()
          this.$router.push({ name: 'write-result', params: { id: data.batch_uid } })
          this.$toast({
            message: '提交成功'
          })
        } else {
          this.$toast({
            message: '提交失败'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-content-wrapper {
    .mobile-full-screen-mask {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      position: fixed;
      z-index: 999999;
      background: #fff;
      color: #666;
      img {
        margin-top: 50px;
        width: 250px;
      }
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .word-count {
      padding-right: 10px;
      margin-bottom: 5px;
      text-align: right;
    }
    .prompt-info {
      padding: 0 10px;
      text-align: left;
      font-size: 14px;
      color: #666;
      a {
        color: #409EFF;
      }
    }
    .mint-tabbar {
      border-top: 1px solid #eee;
      .mint-tab-item {
        background-color: #fff;
        padding: 10px;
        button {
          height: 40px;
          font-size: 14px;
        }
      }
      .mint-button.mint-button--default.is-plain {
        border: 1px solid #808080;
      }
    }
  }
</style>
