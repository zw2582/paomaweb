import React, { Component } from 'react';
import './Paodao.css'

/**
 * 跑道样式
 */
class Paodao extends Component {

    render = () => {
        const users = this.props.users
        const isactive = this.props.isactive;
        if (!users) {
            return <span/>
        }
        let runClass = ''
        if (isactive === 2) {
            runClass = 'okplay'
        }
        return (
            <div className={"tracklist "+runClass} id="play-area">
            {users.map((user, index)=>(
                <div className="trackline" key={index}>
                    <div className="track-start">{index+1}</div>
                    <div className="track-end">{user.score}</div>
        
                    <div className="road">
                    <div className="player" style={{top:`${(index)*47.3}px`, left:user.left}}>
                        <div className="yyytp">
                            <div className={"lunzib car0 "+runClass}></div>
                        </div>
                        <div className="pnctx">
                            <div className="head shake" style={{backgroundImage: `url(${user.headimg})`}}></div>
                            <div className="nickname">{user.uname}</div>
                        </div>
                    </div>
                    </div>
                </div>
            ))}
            </div>
        )
    }
}

export default Paodao