import qs from 'qs'

import request from './common/request'

// ************************* 用户开始 *******************************

/**
 * 根据用户名和密码进行登录
 * @param {string} username 用户名
 * @param {string} password 密码
 */
export function login (username, password) {
  return request({
    url: '/account/login',
    method: 'post',
    data: qs.stringify({
      username, password
    })
  })
}

/**
 * 获取登录账户信息
 */
export function getAccountInfo () {
  return request({
    url: '/account/own',
    method: 'get'
  })
}

// ************************* 用户结束 *******************************

// ************************* 作文开始 *******************************

/**
 * 获取作文列表
 */
export function getArticleList () {
  return request({
    url: '/open/batch/articles',
    method: 'get'
  })
}

/**
 * 根据id获取某篇已提交作文的批改报告，查看报告时使用此接口
 * @param {*} id 作文id
 */
export function getArticleReportById (id) {
  return request({
    url: '/open/batch/articles',
    method: 'get',
    params: {
      batch_uid: id
    }
  })
}

/**
 * 根据id获取谋篇尚未完成的作文内容，继续写作时使用此接口
 * @param {*} id 作文id
 */
export function getArticleContentById (id) {
  return request({
    url: '/open/batch/articles',
    method: 'get',
    params: {
      uid: id
    }
  })
}

/**
 * 保存作文但是不提交批改
 * @param {*} uid 作文uid 第一次写作不会有此参数, 从继续写作进入, 保存的时候必须携带此参数
 * @param {*} name 作文标题
 * @param {*} answer 作文内容
 */
export function saveArticle ({ uid, name, answer }) {
  let params = {}
  if (uid) {
    params = { uid, name, answer }
  } else {
    params = { name, answer }
  }
  return request({
    url: '/open/batch/articles',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * 提交批改
 * @param {*} uid 作文uid 第一次写作不会有此参数, 从继续写作进入, 保存的时候必须携带此参数
 * @param {*} name 作文标题
 * @param {*} answer 作文内容
 * @param {*} wordsCount 总词数
 */

export function commitArticle ({ uid, name, answer, wordsCount }) {
  return request({
    url: '/open/batch/articles',
    method: 'post',
    data: qs.stringify({
      op: 'commit', uid, name, answer, words_count: wordsCount
    })
  })
}
// ************************* 作文结束 *******************************
