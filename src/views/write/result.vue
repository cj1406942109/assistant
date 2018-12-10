<template>
  <div>
    <el-row class="hidden-xs-only pc-main">
      <el-col class="pc-content-wrapper">
        <s-breadcrumb route-name="write" title="精批报告"></s-breadcrumb>
        <div class="essay-info" v-if="report">
          <s-icon-title :mobile="false">
            作文：{{report.name}}
            <template slot="info">
              {{report.time_create}}
            </template>
          </s-icon-title>
          <div class="statistics">
            <s-big-num :number="optimizationNum" unit="处">可优化</s-big-num>
            <s-big-num :number="errorType" unit="类">写作问题</s-big-num>
            <s-big-num :number="report.words_count" unit="词">书写词数</s-big-num>
          </div>
          <s-icon-title :rect="false" icon="info" :title="false">
            {{optimizationNum}} 处可优化的错误，分别属于 {{errorType}} 个类型的写作问题。
          </s-icon-title>
        </div>
        <div class="essay-correction" v-if="report">
          <s-icon-title :mobile="false">作文批改</s-icon-title>
          <div class="all-errors">
            <p>全部写作问题（{{optimizationNum}}）</p>
            <p class="error-type">
              <span v-for="item in errorTable" :key="item.id">{{item.type}}（{{item.errors.length}}）</span>
            </p>
          </div>
          <!-- 连接线 -->
          <svg id="lineCurve">
            <path fill-opacity="0" stroke="#47DAD1" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4" stroke-width="2" transform="translate(5,5)"></path>
          </svg>
          <div class="errors-detail">
            <div class="essay-container">
              <span v-for="item in wordList" :key="item.id" :class="{highlight: item.tag!=='normal', selected: item.index === selectedIndex }" @mouseenter="linkErrorWord(item)" @mouseleave="removeLink(item)">
                <span v-html="escapeEnter(item.word)"></span>
                <span v-if="item.tag!=='normal'" :id="'word_'+item.index" class="error-index" :class="{phrase: item.tag==='phrase', check: item.tag==='check'}">{{item.index + 1}}</span>
              </span>
            </div>
            <div class="error-container">
              <div class="error-info" v-for="(item, index) in errorList" :key="item.id" :class="{ selected: item.index === selectedIndex }" @mouseenter="linkErrorWord(item)" @mouseleave="removeLink(item)">
                <p><span :id="'error_'+index" :class="{phrase: item.tag==='phrase', check: item.tag==='check'}">{{index + 1}}</span>{{item.error}}</p>
                <p>{{item.text}}</p>
              </div>
            </div>
          </div>
          <div class="error-table" v-if="errorTable.length > 0">
            <s-icon-title :rect="false" icon="error" :mobile="false">错误统计</s-icon-title>
            <table cellspacing="0">
              <tr>
                <th>类型</th>
                <th>数量</th>
                <th>原文内容</th>
                <th>推荐表达</th>
              </tr>
              <tr v-for="item in errorTable" :key="item.id">
                <td>{{item.type}}</td>
                <td>{{item.errors.length}}</td>
                <td><div v-for="err in item.errors" :key="err.id">{{err.word}}</div></td>
                <td><div v-for="err in item.errors" :key="err.id">{{err.candidate}}</div></td>
              </tr>
            </table>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="hidden-sm-and-up mobile-main">
      <el-col class="mobile-content-wrapper">
        <div class="essay-result" v-if="report">
          <div class="overall">
            <s-icon-title>作文表现</s-icon-title>
            <s-list>
              <template slot="title">
                <span>{{report.time_create}}</span>
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
              <span v-for="item in wordList" :key="item.id" :class="{highlight: item.tag!=='normal', selected: item.index === selectedIndex }" @touchstart="showPopup(item)">
                <template v-if="'index' in item">
                  <el-popover
                    placement="top-start"
                    width="200"
                    :title="item.error"
                    trigger="manual"
                    v-model="item.visible"
                    popper-class="essay-error-popper"
                    :content="item.text">
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
  </div>
</template>

<script>
import SBreadcrumb from '@/components/s-breadcrumb'
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
      selectedIndex: -1,
      screenWidth: document.body.clientWidth
    }
  },
  mounted () {
    const vm = this
    window.onresize = function () {
      vm.screenWidth = document.body.clientWidth
    }
  },
  computed: {
    isPc () {
      return this.screenWidth >= 768
    },
    optimizationNum () {
      return this.report.check.length + this.report.phrase.length
    },
    errorType () {
      return this.errorTable.length
    }
  },
  components: {
    SBreadcrumb, SIconTitle, SBigNum, SList, SSplitCol
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
          if (this.isPc) {
            this.$message({
              message: '获取批改结果失败',
              type: 'error'
            })
          } else {
            this.$toast({
              message: '获取批改结果失败'
            })
          }
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
    linkErrorWord (item) {
      if ('index' in item) {
        this.selectedIndex = item.index
        this.drawLine(document.querySelector('#word_' + item.index), document.querySelector('#error_' + item.index))
      }
    },
    removeLink (item) {
      this.selectedIndex = -1
      document.querySelector('#lineCurve').setAttribute('opacity', 0)
    },
    drawLine (word, error) {
      // word在左边，error在右边，画线将word的右边与error的左边相连
      // 获取元素的大小及其相对于视口的位置
      const pw = word.getBoundingClientRect()
      const pe = error.getBoundingClientRect()
      // 绝对位置
      const tempP1 = {
        x: pw.right + document.documentElement.scrollLeft,
        y: pw.bottom - (pw.bottom - pw.top) / 2 + document.documentElement.scrollTop
      }
      const tempP2 = {
        x: pe.left + document.documentElement.scrollLeft,
        y: pe.bottom - (pe.bottom - pe.top) / 2 + document.documentElement.scrollTop
      }
      let offsetLeft = document.querySelector('.pc-main').offsetLeft + 5
      let offsetTop = document.querySelector('.pc-main').offsetTop + 5
      let curve = document.querySelector('#lineCurve')
      curve.setAttribute('opacity', 1)
      const p1 = {
        x: tempP1.x - offsetLeft - 1,
        y: tempP1.y - offsetTop
      }
      const p2 = {
        x: tempP2.x - offsetLeft + 1,
        y: tempP2.y - offsetTop
      }
      let d = `M${p1.x},${p1.y} L${p2.x - 30},${p1.y} L${p2.x - 30},${p2.y} L${p2.x},${p2.y}`
      curve.children[0].setAttribute('d', d)
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
  .pc-content-wrapper {
    padding: 0 20px 100px;
    .essay-info {
      .statistics {
        width: calc(100% - 300px);
        margin: 30px auto;
        padding: 0 150px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    #lineCurve {
      position: absolute;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // 屏蔽元素的鼠标事件
      pointer-events: none;
      transition: opacity 0.5s;
      // 添加动画效果
      path {
        stroke-dashoffset: 100;
        animation: dash 3s linear infinite;
      }
      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    }
    .essay-correction {
      margin-top: 10px;
      .phrase {
        background-color: #8BD0FA;
      }
      .check {
        background-color: #F2D256;
      }
      .all-errors {
        padding: 0 20px;
        background-color: #F8F8F8;
        border: 1px solid #eee;
        text-align: left;
        p {
          color: #666;
          font-size: 16px;
        }
        .error-type {
          display: flex;
          flex-wrap: wrap;
          span {
            color: #333;
            line-height: 24px;
            margin-right: 40px;
            font-weight: bold;
          }
        }
      }
      .errors-detail {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 20px;
        .essay-container {
          margin-right: 40px;
          width: 500px;
          text-align: justify;
          font-size: 16px;
          color: #666;
          line-height: 40px;
          background-color: #FBFDFE;
          padding: 20px;
          border-radius: 5px;
          border: 1px solid #eee;
          .highlight {
            position: relative;
            color: #F68578;
            cursor: pointer;
            .error-index {
              left: 0;
              top: -24px;
              position: absolute;
              border-radius: 50%;
              display: inline-block;
              color: #fff;
              line-height: 20px;
              font-size: 14px;
              padding: 2px;
              text-align: center;
              width: 20px;
              height: 20px;
            }
          }
          .highlight.selected {
            background-color: rgba(246, 133, 120, 0.3);
          }
        }
        .error-container {
          width: 500px;
          .error-info {
            cursor: pointer;
            border-radius: 3px;
            margin-bottom: 10px;
            border: 1px solid #eee;
            p {
              padding: 0 10px;
              line-height: 40px;
              text-align: left;
              margin: 0;
              span {
                border-radius: 50%;
                display: inline-block;
                color: #fff;
                line-height: 20px;
                font-size: 14px;
                padding: 2px;
                text-align: center;
                width: 20px;
                height: 20px;
                margin-right: 10px;
              }
              &:nth-of-type(1) {
                height: 40px;
                font-weight: bold;
                background-color: #fff;
                border-bottom: 1px solid #eee;
              }
              &:nth-last-of-type(1) {
                background-color: #FBFDFE;
                min-height: 40px;
              }
            }
          }
          .error-info.selected {
            box-shadow: 2px 2px 2px #ccc;
          }
        }
      }
      .error-table {
        table {
          margin-top: 10px;
          line-height: 30px;
          width: 100%;
          text-align: left;
          border: 1px solid #eee;
          th {
            padding: 10px 40px;
            background-color: #F5F9FD;
            border-bottom: 1px solid #eee;
          }
          td {
            padding: 10px 40px;
            border-bottom: 1px solid #eee;
            vertical-align: baseline;
          }
          tr:nth-last-of-type(1) {
            td {
              border-bottom: none;
            }
          }
        }
      }
    }
  }
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
      min-height: calc(100vh - 50px);
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
