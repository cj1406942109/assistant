<template>
  <el-row class="mobile-main">
    <el-col class="mobile-content-wrapper">
      <div class="essay-result" v-if="report">
        <div class="overall">
          <s-icon-title>作文表现</s-icon-title>
          <s-list>
            <template slot="title">
              <span>{{report.time_create.split(' ')[0]}}</span>
            </template>
            <span slot="content">{{report.name}}（{{report.words_count}} 词）</span>
          </s-list>
          <s-split-col>
            <template slot="l-col"><s-big-num :number="optimizationNum" unit="处">可优化</s-big-num></template>
            <template slot="r-col"><s-big-num :number="errorType" unit="类">写作问题</s-big-num></template>
          </s-split-col>
          <s-icon-title icon="info" :title="false" :rect="false">{{optimizationNum}} 处可优化的错误，分别属于 {{errorType}} 个类型的写作问题。</s-icon-title>
        </div>
        <div class="essay-correction">
          <s-icon-title>作文批改</s-icon-title>
          <div class="all-errors">
            <p>全部写作问题（{{optimizationNum}}）</p>
            <p class="error-type">
              <span v-for="item in errorTable" :key="item.id">{{item.type}}（{{item.errors.length}}）</span>
            </p>
          </div>
        </div>
        <div class="errors-detail">
          <p>{{report.words_count}} 词</p>
          <div class="essay-container">
            <span v-for="item in wordList" :key="item.id" :class="{highlight: item.tag!=='normal', selected: item.index === selectedIndex }" @click="showPopup(item)" @touchstart="showPopup(item)">
              <template v-if="'index' in item">
                <el-popover
                  placement="top-start"
                  width="200"
                  :title="item.error"
                  trigger="manual"
                  v-model="item.visible"
                  popper-class="essay-error-popper">
                  <span>{{item.text}}</span>
                  <!-- 首单词用于popover定位，防止内容出现换行时位置错乱 -->
                  <span v-html="escapeEnter(item.word).split(' ')[0]" slot="reference"></span>
                </el-popover>
                <span v-html="escapeEnter(item.word).split(' ').slice(1).join(' ')"></span>
              </template>
              <span v-else v-html="escapeEnter(item.word)"></span>
            </span>
          </div>
        </div>
        <div class="error-table" v-if="errorTable.length > 0">
          <s-icon-title :rect="false" icon="error">错误统计</s-icon-title>
          <div v-for="item in errorTable" :key="item.id">
            <div class="type-name" @click="item.isCollpase=!item.isCollpase" :class="{collapse: !item.isCollpase}">{{item.type}}
              <span v-if="!item.isCollpase">收起<svg-icon icon-class="arrow_top"></svg-icon></span>
              <span v-else>展开<svg-icon icon-class="arrow_down"></svg-icon></span>
            </div>
            <div class="type-errors" v-if="!item.isCollpase">
              <p v-for="err in item.errors" :key="err.id">
                {{err.word}}
                <template v-if="err.candidate !== '-'"><span> 建议改为 </span>{{err.candidate}}</template>
                <span v-else> 可能有误 </span>
              </p>
            </div>
          </div>
        </div>
        <s-icon-title :rect="false" icon="info" :title="false" class="correction-prompt">
          本次批改是由人工智能完成，已对语言的拼写、语法、语义进行检查，但依然会与教师日常批改习惯和评分标准存在不可避免的差异。
        </s-icon-title>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import SIconTitle from '@/components/s-icon-title'
import SList from '@/components/s-list'
import SSplitCol from '@/components/s-split-col'
import SBigNum from '@/components/s-big-num'

import { getArticleReportById } from '@/api'

export default {
  data () {
    return {
      report: '',
      wordList: '',
      errorList: '',
      errorTable: '',
      selectedIndex: -1
    }
  },
  computed: {
    optimizationNum () {
      return this.report.check.length + this.report.phrase.length
    },
    errorType () {
      return this.errorTable.length
    }
  },
  components: {
    SIconTitle, SBigNum, SList, SSplitCol
  },
  created () {
    // 获取作文的批改报告信息
    this.getArticleReport()
  },
  methods: {
    getArticleReport () {
      getArticleReportById(this.$route.params.id).then(data => {
        if (data) {
          if (data.status === 2) {
            this.report = JSON.parse(JSON.stringify(data))
            // 作文内容
            const article = data.answer
            // 修改建议
            const phrase = data.phrase
            // 错误
            const check = data.check

            // 合并数组
            let errorsArray = []
            if (phrase.length > 0) {
              phrase.forEach(ele => {
                ele.tag = 'phrase'
                if (ele.candidates.length > 0) {
                  ele.text = `建议将“${ele.word}”替换为“${ele.candidates[0]}”。`
                } else {
                  ele.text = `“${ele.word}”可能有误。`
                }
                errorsArray.push(ele)
              })
            }
            if (check.length > 0) {
              check.forEach(ele => {
                ele.tag = 'check'
                errorsArray.push(ele)
              })
            }
            // 按起始位置排序
            errorsArray = errorsArray.sort((a, b) => {
              return a.start - b.start
            })
            // 分割文章生成短语数组
            let wordsArray = []
            let startIndex = 0
            let errorTable = []
            errorsArray.forEach((ele, index) => {
              ele.error = this.formateErrorType(ele.explain)
              ele.index = index
              if (errorTable.length > 0) {
                // 错误表格中有元素，遍历进行判断
                // 用于标记，是否要作为新元素添加
                let pushFlag = true
                errorTable.forEach(type => {
                  if (ele.error === type.type) {
                    // 如果与当前元素错误类型相同，添加到已有类型下
                    pushFlag = false
                    type.errors.push({ word: ele.word, candidate: ele.candidates.length > 0 ? ele.candidates[0] : '-' })
                  }
                })
                if (pushFlag) {
                  // 与所有已有元素的错误类型都不同，新加元素
                  errorTable.push({
                    type: ele.error,
                    // 用于移动端的显示，展开收起
                    isCollpase: true,
                    errors: [
                      { word: ele.word, candidate: ele.candidates.length > 0 ? ele.candidates[0] : '-' }
                    ]
                  })
                }
              } else {
                // 错误表格中无元素，直接添加新元素
                errorTable.push({
                  type: ele.error,
                  // 用于移动端的显示，展开收起
                  isCollpase: true,
                  errors: [
                    { word: ele.word, candidate: ele.candidates.length > 0 ? ele.candidates[0] : '-' }
                  ]
                })
              }
              wordsArray.push({
                word: article.slice(startIndex, ele.start),
                tag: 'normal'
              })
              wordsArray.push({
                word: article.slice(ele.start, ele.end),
                tag: ele.tag,
                text: ele.text,
                error: ele.error,
                index: index
              })
              startIndex = ele.end
            })
            this.errorTable = errorTable
            wordsArray.push({
              word: article.slice(startIndex),
              tag: 'normal'
            })
            this.errorList = JSON.parse(JSON.stringify(errorsArray))
            this.wordList = JSON.parse(JSON.stringify(wordsArray))
          } else {
            setTimeout(this.getArticleReport(), 500)
          }
        } else {
          this.$toast({
            message: '获取批改结果失败'
          })
        }
      })
    },
    formateErrorType (val) {
      const errorTable = {
        '2': {
          'error': '拼写错误',
          'advice': '单词拼写'
        },
        '5': {
          'error': '拼写错误',
          'advice': '单词拼写'
        },
        '1.1.1': {
          'error': '拼写错误',
          'advice': '单词拼写'
        },
        '1.1.2': {
          'error': '拼写错误',
          'advice': '单词拼写'
        },
        '1.1.3': {
          'error': '构词法错误',
          'advice': '构词法'
        },
        '2.1': {
          'error': '标点错误',
          'advice': '标点使用'
        },
        '3.1': {
          'error': '用词错误',
          'advice': '恰当用词'
        },
        '3.2': {
          'error': '用词错误',
          'advice': '恰当用词'
        },
        '3.3': {
          'error': '用词错误',
          'advice': '恰当用词'
        },
        '4.1': {
          'error': '形容词错误',
          'advice': '形容词使用'
        },
        '4.11.1': {
          'error': '时态误用',
          'advice': '时态的恰当使用'
        },
        '4.11.2': {
          'error': '时态误用',
          'advice': '时态的恰当使用'
        },
        '4.11.3': {
          'error': '时态误用',
          'advice': '时态的恰当使用'
        },
        '4.2': {
          'error': '动词错误',
          'advice': '动词使用'
        },
        '4.3.1': {
          'error': '语态结构错误',
          'advice': '语态结构'
        },
        '4.3.2': {
          'error': '动词错误',
          'advice': '动词使用'
        },
        '4.3.3': {
          'error': '动词错误',
          'advice': '动词使用'
        },
        '4.3.4': {
          'error': '动词错误',
          'advice': '动词使用'
        },
        '4.4': {
          'error': '冠词错误',
          'advice': '冠词使用'
        },
        '4.5': {
          'error': '构词法错误',
          'advice': '构词法'
        },
        '4.6.1': {
          'error': '时态结构错误',
          'advice': '语态结构'
        },
        '4.6.2': {
          'error': '时态结构错误',
          'advice': '语态结构'
        },
        '4.6.3': {
          'error': '时态结构错误',
          'advice': '语态结构'
        },
        '4.7': {
          'error': '名词错误',
          'advice': '名词'
        },
        '4.8': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '4.9.1': {
          'error': '介词错误',
          'advice': '介词使用'
        },
        '4.9.2': {
          'error': '介词错误',
          'advice': '介词使用'
        },
        '4.9': {
          'error': '介词错误',
          'advice': '介词使用'
        },
        '7.1': {
          'error': '句子结构错误',
          'advice': '句子结构'
        },
        '7.2': {
          'error': '句子结构错误',
          'advice': '句子结构'
        },
        '7.3': {
          'error': '句子结构错误',
          'advice': '句子结构'
        },
        '9.1': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '9.12': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '9.13': {
          'error': '形容词错误',
          'advice': '形容词使用'
        },
        '9.14': {
          'error': '限定词错误',
          'advice': '限定词'
        },
        '9.17': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '9.19': {
          'error': '动词错误',
          'advice': '动词使用'
        },
        '9.2': {
          'error': '限定词错误',
          'advice': '限定词'
        },
        '9.25': {
          'error': '拼写错误',
          'advice': '单词拼写'
        },
        '9.26': {
          'error': '名词错误',
          'advice': '名词'
        },
        '9.27': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '9.28': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '9.29': {
          'error': '拼写错误',
          'advice': '单词拼写'
        },
        '9.3': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '9.31': {
          'error': '形容词错误',
          'advice': '形容词使用'
        },
        '9.33.1': {
          'error': '限定词错误',
          'advice': '限定词'
        },
        '9.33.2': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '9.33': {
          'error': '句子成分错误',
          'advice': '句子成分'
        },
        '9.34': {
          'error': '标点错误',
          'advice': '标点使用'
        },
        '9.4': {
          'error': '时态错误',
          'advice': '时态'
        },
        '9.5': {
          'error': '动词错误',
          'advice': '动词使用'
        },
        '9.6': {
          'error': '拼写错误',
          'advice': '单词拼写'
        },
        '9.9': {
          'error': '拼写错误',
          'advice': '单词拼写'
        },
        '10.1': {
          'error': '标点错误',
          'advice': '标点使用'
        },
        '10.2': {
          'error': '标点错误',
          'advice': '标点使用'
        },
        '10.3.1': {
          'error': '标点错误',
          'advice': '标点使用'
        },
        '10.3.2': {
          'error': '标点错误',
          'advice': '标点使用'
        },
        '10.3': {
          'error': '标点错误',
          'advice': '标点使用'
        }
      }
      for (let key in errorTable) {
        if (val === key) {
          return errorTable[key].error
        }
      }
      // 遗漏error，修改建议
      if (val === 'REPLACE') return '修改建议'
      return '未知错误'
    },
    escapeEnter (val) {
      return val.replace(/\n/g, '<br>')
    },
    showPopup (item) {
      // item.visible = true
      this.wordList.forEach(ele => {
        if ('index' in ele) {
          ele.visible = false
        }
      })
      item.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-main {
    background-color: #fff!important;
    height: calc(100% - 50px);
    margin-bottom: 20px!important;
  }
  .mobile-content-wrapper {
    border-top: 1px solid #eee;
    .essay-result {
      background-color: #fff;
      margin: -20px -10px;
      padding: 20px 10px;
      .overall {
        border-bottom: 1px dashed #ccc;
        padding-bottom: 20px;
      }
      .essay-correction {
        margin-top: 20px;
        .all-errors {
          padding: 0 10px;
          border: 1px solid #eee;
          border-radius: 5px;
          text-align: left;
          p {
            color: #666;
            font-size: 16px;
          }
          .error-type {
            display: flex;
            flex-wrap: wrap;
            span {
              font-size: 14px;
              color: #333;
              line-height: 24px;
              margin-right: 5px;
              font-weight: bold;
            }
          }
        }
      }
      .errors-detail {
        & > p {
          padding-right: 20px;
          margin-bottom: 5px;
          text-align: right;
        }
        .essay-container {
          text-align: justify;
          font-size: 14px;
          color: #333;
          line-height: 30px;
          background-color: #FBFDFE;
          padding: 20px;
          border-radius: 5px;
          border: 1px solid #eee;
          .highlight {
            color: #FD6064;
            cursor: pointer;
          }
        }
      }
      .error-table {
        .type-name {
          padding: 20px;
          font-size: 18px;
          border-radius: 5px;
          border: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          span {
            color: #48B3FF;
            .svg-icon {
              margin-left: 10px;
              font-size: 14px;
            }
          }
          &.collapse {
            border: 1px solid #48B3FF;
          }
        }
        .type-errors {
          margin: 10px 0;
          border: 1px solid #eee;
          padding: 10px 20px;
          border-radius: 5px;
          text-align: left;
          p {
            margin: 0;
            line-height: 30px;
            &::before {
              content: '\02022';
              margin-right: 10px;
            }
          }
          span {
            color: #2AD5CA;
          }
        }
      }
      .correction-prompt {
        margin-top: 20px;
        font-size: 16px;
        line-height: 24px;
        padding: 0 10px 0 20px;
        text-indent: -20px;
        text-align: justify;
      }
    }
  }
</style>
