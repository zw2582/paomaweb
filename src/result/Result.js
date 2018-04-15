import React, { Component } from 'react';
import {showResult} from '../api/room'
import './Result.css'

class Result extends Component {

    state = {
        result:[]
    }

    getResult(roomNo) {
        showResult(roomNo, (response)=>{
            this.setState({result: response.data})
        })
    }

    componentDidMount() {
        let roomNo = this.props.room_no
        console.log('result room_no:'+roomNo)
        this.getResult(roomNo)
    }

    render() {
        const result = this.state.result
        if (!result) {
            return ''
        }
        return (
            <div className="result-layer " id="phb">
                <button onClick={()=>{this.props.close()}}>关闭</button>
                <div className="result-label">GAME OVER</div>
                <div className="result-cup">
                    <div className="phb-b1">
                        <table width="100%" border="0" cellPadding="0" cellSpacing="0" className="phbbiaoge">
                            <thead>
                                <tr>
                                    <th width="120" align="center">排名</th>
                                    <th width="120" align="center">头像</th>
                                    <th align="left">昵称</th>
                                    <th width="200" align="center">
                                        <span className="phoneth">手机号码</span>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="phb-b2">
                        <table width="100%" border="0" cellPadding="0" cellSpacing="0" className="phbbiaoge">
                            <tbody>
                                {result.map((data, index)=>(
                                    <tr key={index}>
                                    <td width="120" align="center">
                                        <span className="paimin">{index+1}</span>
                                    </td>
                                    <td width="120" align="center">
                                        <img className="touxiang" width='100%' src={data.user.headimg} />
                                    </td>
                                    <td align="left">
                                        <span className="nicheng">{data.user.uname}</span>
                                    </td>
                                    <td width="200" align="center">
                                        <span className="phone">{data.user.phone}</span>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        )
    }
}

export default Result