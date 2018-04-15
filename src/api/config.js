let WS_URL='ws://120.79.30.72:9502'	//websocket地址
let WS_REQ='http://120.79.30.72:9502'	//websocket request请求地址
let WEB_URL='http://paoma.iillyy.com'	//服务端地址

if (process.env.NODE_ENV === "development") {
    WEB_URL = 'http://127.0.0.1'
    WS_URL = 'ws://127.0.0.1:9502'
    WS_REQ = 'http://127.0.0.1'
} 
export {WEB_URL, WS_URL, WS_REQ}