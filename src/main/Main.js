import React, { Component } from 'react';
import Paodao from './Paodao'
import * as Room from '../api/room'
import './Main.css'
import { WS_URL } from '../api/config'
import Result from '../result/Result'

class Main extends Component {

    state = {
        users: [],
        room_no: 0,
        room: null,
        showResult: false
    }
    ws = null

    //连接swoole
    connectWs() {
        this.ws = new WebSocket(WS_URL)

        let ws = this.ws
        ws.onopen = this.onOpen

        ws.onclose = function () {
            console.log('连接已经断开')
        }
        ws.onmessage = this.onMessage
    }

    //连接成功
    onOpen = () => {
        //游客进入房间
        console.log('请求游客进入房间')
        this.ws.send(JSON.stringify({ action: 'enter', 'room_no': this.state.room_no }))
    }

    //接受到消息
    onMessage = (evt) => {
        //处理消息
        var received_msg = evt.data;
        console.log("接收到消息");
        console.log(received_msg);
        var msg = JSON.parse(received_msg);
        if (!msg.status || msg.status == 0) {
            console.log({ title: 'ws报错', content: msg.message })
        } else if (!msg.data) {
            console.log("other message:" + msg.message)
        } else {
            var data = msg.data;
            if (data.action == 'exit_room') {
                //用户离开通知
                console.log(data.user.uname + ":离开房间")
                let users = this.state.users
                for (i = 0, len = users.length; i < len; i++) {
                    if (users[i].uid == data.uid) {
                        users.splice(i, 1);
                    }
                }
                this.setState({ 'users': users })
            } else if (data.action == 'join') {
                //用户加入通知
                console.log(data.user.uname + ":加入房间")
                var exist = false;
                let users = this.state.users
                for (var i = 0, len = users.length; i < len; i++) {
                    if (users[i].uid == data.uid) {
                        exist = true;
                    }
                }
                //如果用户不存在
                if (!exist) {
                    users.push(data.user);
                    this.setState({ 'users': users })
                }
            } else if (data.action == 'prepare') {
                //房间预备通知
                console.log('准备中')
                let room = this.state.room
                room.isactive = 1
                //获取用户数据
                Room.roomUsers(this.state.room_no, (response) => {
                    this.setState({ users: response.data, 'room': room })
                })
            } else if (data.action == 'start') {
                console.log('开始比赛')
                let room = this.state.room
                room.isactive = 2
                this.setState({ 'room': room })
                // starttime(10)
            } else if (data.action == 'play') {

            } else if (data.action == 'stop') {
                console.log('比赛结束')
                let room = this.state.room
                room.isactive = 3
                this.setState({ 'room': room, 'showResult': true })
            } else if (data.action == 'result') {
                //比赛数据推送通知
                this.showRunData(data.result, data.ranks, data.max, data.min);
            } else {
                console.log("other message:" + msg.message)
            }
        }
    }

    //比赛数据显示
    showRunData(data, ranks, max, min) {
        var users = this.state.users
        var min_max_rate = min / max;
        for (var i = 0, len = users.length; i < len; i++) {
            var user = users[i];
            var left = data[user.uid] / max; // 0-1
            if (min_max_rate > 0.5) {
                left = left * 0.5; //如果跑马的最低分于最高分的比值大于0.5,则长度减去一半
            }
            user.left = left * 100 + "%";
            user.score = data[user.uid];
            user.rank = ranks[user.uid] + 1;
            users.splice(i, 1, user);
        }
        this.setState({ users, users })
    }

    componentDidMount() {
        let roomNo = this.getRequest().room_no
        this.setState({room_no: roomNo})
        //获取房间信息
        Room.roomInfo(roomNo, (response) => {
            this.setState({ 'room': response.data })

            //获取用户数据
            Room.roomUsers(roomNo, (response) => {
                this.setState({ users: response.data })

                //连接swoole
                console.log('连接swoole')
                this.connectWs()
            })
        })

        //初始化参数
        // const query = this.props.location.query
        // this.setState({'room_no':query.room_no})
    }

    getRequest() {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            let strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {

                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);

            }
        }
        return theRequest;
    }

    render = () => {
        const users = this.state.users
        const room = this.state.room
        const isactive = room ? room.isactive : 1

        if (!room) {
            return (
                <div>
                    <h1>当前房间不存在</h1>
                </div>
            )
        }

        let title = ''
        let runclass = ''
        if (isactive == 1) {
            title = '游戏准备中'
        } else if (isactive == 2) {
            title = '游戏进行中'
            runclass = 'okplay'
        } else if (isactive == 3) {
            title = '本局已结束'
        } else {
            title = '未知房间状态，请联系超级管理员'
        }

        let resultApp = null
        if (this.state.showResult) {
            resultApp = <Result room_no={this.state.room_no} close={() => { this.setState({ showResult: false }) }} />
        }

        let content = (
            <div className="yyy3d">
                {resultApp}
                <div className={"paomabeijing2 " + runclass}></div>
                <div className={"paomabeijing " + runclass}></div>

                <div className="countdown_box">
                    <div className="yyy3d_title_box" style={{ 'display': 'block' }}>
                        <span className="one">{title}</span>
                    </div>
                    参与人数: <span className="canyu">{users.length}</span>
                </div>

                <Paodao users={users} isactive={isactive} />

                <button style={{ position: 'relative' }} onClick={() => { this.setState({ 'showResult': true }) }}>显示结果</button>

            </div>
        )

        return content
    }

}
export default Main