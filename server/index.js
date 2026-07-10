import { WebSocketExpress, Router } from "websocket-express";


const app = new WebSocketExpress()

app.ws('/socket', async (req, res) => {
    const ws = await res.accept()
    ws.onmessage = msg => ws.send(`echo ${msg.data}`)
    ws.send('hello')
    setTimeout(() => {
        ws.close(1012, 'server shutdown')
    }, 2000)
})

const server = app.createServer()
server.listen(8000, '0.0.0.0', () => {
    console.log('Server started on 0.0.0.0 with port 8000')
})
