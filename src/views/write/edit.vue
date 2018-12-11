<template>
  <el-row class="pc-main">
    <el-col class="pc-content-wrapper">
      <s-breadcrumb route-name="write" title="作文写作"></s-breadcrumb>
      <el-form ref="form" :model="form" label-position="right" label-width="75px">
        <el-form-item v-loading="loading" label="标题：">
          <el-input clearable v-model="form.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <div class="word-count">{{wordCount}} 字</div>
        <el-form-item v-loading="loading" label="内容：">
          <el-input clearable type="textarea" rows="25" v-model="form.answer" placeholder="开始写作文"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="prompt-info"><svg-icon icon-class="star"></svg-icon>为保证批改的准确性，请您输入与文章相符合的内容</div>
        </el-form-item>
      </el-form>
      <div class="submit-wrapper">
        <el-button type="default" :loading="btnLoading" @click="save">先保存</el-button>
        <el-button type="primary"
        v-loading.fullscreen.lock="submitLoading"
        element-loading-text="作文精批中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-custom-class="my-loading-color"
        @click="submit">现在提交</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import SBreadcrumb from '@/components/s-breadcrumb'
import { getArticleContentById, saveArticle, commitArticle } from '@/api'

export default {
  data () {
    return {
      form: {
        name: '',
        answer: ''
      },
      loading: true,
      btnLoading: false,
      submitLoading: false
    }
  },
  created () {
    // 从本地存储中恢复作文
    // 当且仅当当前作文id与本地存储的作文id相同时恢复
    // 本地存储中有作文
    const currentUid = this.$route.params.id || null
    const localEssay = JSON.parse(localStorage.getItem('essay'))
    if (localEssay) {
      // 存储的作文有uid且与当前uid相同，或者存储的作文没有uid，也没有当前uid
      if (currentUid === localEssay.uid || (!currentUid && !localEssay.uid && !(!localEssay.name && !localEssay.answer))) {
        this.$confirm('检测到有未提交的作文，是否恢复之前的写作进度？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = false
          this.form = localEssay
        }).catch(() => {
          if (currentUid) {
            this.getArticle()
          } else {
            this.loading = false
          }
        })
      } else {
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
    'form.name': function (val, oldVal) {
      if (oldVal !== val) {
        localStorage.setItem('essay', JSON.stringify(this.form))
      }
    },
    'form.answer': function (val, oldVal) {
      if (oldVal !== val) {
        localStorage.setItem('essay', JSON.stringify(this.form))
      }
    }
  },
  components: {
    SBreadcrumb
  },
  methods: {
    getArticle () {
      const currentUid = this.$route.params.id || null
      getArticleContentById(currentUid).then(data => {
        this.loading = false
        if (data) {
          this.form = JSON.parse(JSON.stringify(data))
        } else {
          this.$message({
            message: '获取作文信息失败',
            type: 'error'
          })
        }
      })
    },
    save () {
      this.btnLoading = true
      saveArticle(this.form).then(data => {
        this.btnLoading = false
        if (data) {
          localStorage.removeItem('essay')
          this.form = JSON.parse(JSON.stringify(data))
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '保存失败',
            type: 'error'
          })
        }
      })
    },
    submit () {
      this.submitLoading = true
      commitArticle({ ...this.form, wordsCount: this.wordCount }).then(data => {
        this.submitLoading = false
        if (data) {
          localStorage.removeItem('essay')
          this.$router.push({ name: 'write-result', params: { id: data.batch_uid } })
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '提交失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .pc-content-wrapper {
    padding: 0 20px;
    .word-count {
      padding-right: 10px;
      margin-bottom: 5px;
      text-align: right;
    }
    .prompt-info {
      margin-top: -22px;
      padding-left: 20px;
      height: 40px;
      line-height: 40px;
      background-color: #F8F8F8;
      text-align: left;
      font-size: 16px;
      border: 1px solid #dcdfe6;
      border-top: none;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      color: #999;
      .svg-icon {
        font-size: 10px;
        margin-right: 5px;
      }
    }
    .submit-wrapper {
      text-align: right;
      button {
        width: 150px;
      }
    }
  }
</style>
