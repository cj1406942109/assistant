<template>
  <div class="mobile-home">
    <mt-header fixed :title="$route.meta.title">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <router-link to="/" slot="right">
        <mt-button>
          <svg-icon icon-class="forward" slot="icon"></svg-icon>
        </mt-button>
      </router-link>
    </mt-header>
    <div class="container">
      <div class="title">
        <span>作文精批样例示范</span>
      </div>
      <s-card title="随时书写作文">
        <p class="sub-title">创建并保存作文</p>
        <mt-button type="primary" size="large" @click="goEdit()">开始写作</mt-button>
        <s-list>
          <template slot="title">
            <span>2018-11-11</span>
          </template>
          <span slot="content">A good day in summer </span>
          <mt-button slot="button" size="small" type="primary" @click="goEdit()">继续写作</mt-button>
        </s-list>
        <s-list>
          <template slot="title">
            <span>2018-11-05</span>
            <span>（10 处可优化）</span>
          </template>
          <span slot="content">A good day in summer </span>
          <mt-button slot="button" size="small" type="primary" @click="goEdit()">查看</mt-button>
        </s-list>
        <s-list>
          <template slot="title">
            <span>2018-10-23</span>
            <span><s-tag>完美</s-tag></span>
          </template>
          <span slot="content">A good day in summer </span>
          <mt-button slot="button" size="small" type="primary" @click="goEdit()">查看</mt-button>
        </s-list>
        <mt-button type="primary" size="large">查看更多作文</mt-button>
      </s-card>
      <s-card title="查看精批结果 发现问题">
        <s-icon-title :title="false">作文表现</s-icon-title>
        <s-list>
          <template slot="title">
            <span>2018-11-11</span>
          </template>
          <span slot="content">A good day in summer （120词）</span>
        </s-list>
        <s-split-col>
          <template slot="l-col"><s-big-num :number="12" unit="处">可优化</s-big-num></template>
          <template slot="r-col"><s-big-num :number="4" unit="个">写作问题</s-big-num></template>
        </s-split-col>
        <s-icon-title icon="info" :title="false" :rect="false">12 处可优化的错误，分别属于 4 个类型的写作问题。</s-icon-title>
      </s-card>
      <s-card title="学生端体验更佳">
        <s-icon-title :title="false">使用电脑浏览器打开学生端 <a href="http://ai.fltrp.com">ai.fltrp.com</a></s-icon-title>
        <div class="pc-info">
          <p>进入作文精批页面，点击开始写作。</p>
        </div>
      </s-card>
    </div>
    <div class="home-footer">
      <mt-button type="danger" size="large" @click="goEdit()">立即开通</mt-button>
    </div>
  </div>
</template>

<script>
import SCard from '@/components/s-card'
import SList from '@/components/s-list'
import STag from '@/components/s-tag'
import SIconTitle from '@/components/s-icon-title'
import SSplitCol from '@/components/s-split-col'
import SBigNum from '@/components/s-big-num'
export default {
  components: {
    SCard, SList, STag, SIconTitle, SSplitCol, SBigNum
  },
  methods: {
    goEdit () {
      console.log('hello')
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-home {
    .s-icon-title a {
      text-decoration: none;
      color: #333;
    }
    .mint-button.mint-button--primary{
      background-color: #48B3FF;
    }
    .mint-button.mint-button--large {
      font-size: 16px;
    }
    .mint-button.mint-button--small {
      font-size: 14px;
    }
    background-color: #48B3FF;
    color: #fff;
    .mint-header.is-fixed {
      height: 50px;
      font-size: 16px;
      background-color: #48B3FF;
    }
    .container {
      padding: 0 10px;
      margin-top: 50px;
      font-size: 16px;
      .title {
        min-height: 100px;
        background: url('./images/home_1.png') no-repeat center 20px;
        background-size: 300px;
        span {
          line-height: 82px;
        }
      }
      .sub-title {
        font-size: 18px;
        color: #666;
        margin: 0 0 20px 0;
      }
      .pc-info {
        max-width: 420px;
        margin: 20px auto 0;
        padding: 50px 0 30px;
        background: url('./images/home_4.png') no-repeat right top;
        background-size: contain;
        p {
          width: calc(50% - 20px);
          color: #666;
          padding: 0;
          text-align: justify;
          font-size: 14px;
        }
      }
    }
    .home-footer {
      padding: 10px;
      background-color: #fff;
      button {
        background-color: #FD5722;
      }
    }
  }
</style>
