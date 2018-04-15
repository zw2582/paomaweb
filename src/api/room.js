import axios from 'axios'
import {WEB_URL, WS_URL, WS_REQ} from './config'

axios.defaults.baseURL = WEB_URL
axios.defaults.withCredentials = true

//记录需要撤销请求的token
var CancelToken = axios.CancelToken
var cancel
axios.defaults.CancelToken = new CancelToken(function executor(c) {
  console.log('executor 函数接收一个 cancel 函数作为参数')
  cancel = c;
})

// 获取房间信息
const roomInfo = (roomNo, fn, errfn) => {
  console.log('获取房间信息')
  axios.get('room/info', {params:{
    'room_no':roomNo
  }}).then(response=>{
    fn && fn(response.data)
  }).catch(error=>{
    console.error('获取房间信息失败:'+error.message)
    errfn && errfn()
  })
}

// 获取房间用户
const roomUsers = (roomNo, fn, errfn) => {
  console.log('获取房间用户')
  axios.get('/room/users',{params:{
    'room_no':roomNo
  }}).then(response=>{
    fn && fn(response.data)
  }).catch(error=>{
    console.error('获取房间信息失败:'+error.message)
    errfn && errfn()
  })
}

/**
 * 获取个人排名和奖金
 */
const getReward = (uid, roomNo, fn, errfn) => {
  axios.get('/room/reward', {params : {
    'room_no' : roomNo,
    'uid': uid
  }}).then(response=>{
    fn && fn(response.data)
  }).catch(error=>{
    console.error('获取个人排名错误:'+error.message)
    errfn && errfn()
  })
}

/**
 * 显示比赛结果
 */
const showResult = (roomNo, fn, errfn) => {
  axios.get('/room/result', {params:{
    'room_no': roomNo
  }}).then(response=>{
    fn && fn(response.data)
  }).catch(error=>{
    console.error('显示比赛结果错误:'+error.message)
    errfn && errfn()
  })
}

// 加入房间
const enterRoom = (roomNo, fn, errfn) => {
  axios.get(WS_REQ, {params:{
    'action': 'enter',
    'room_no':roomNo
  }}).then(response=>{
    fn && fn(response.data)
  }).catch(error=>{
    console.error('加入房间错误:'+error.message)
    errfn && errfn()
  })
}

export {roomInfo,roomUsers,getReward,showResult, enterRoom,cancel}