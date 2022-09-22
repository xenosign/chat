const Koa = require('koa');
const websockify = require('koa-websocket');
const route = require('koa-route');
const Pug = require('koa-pug');
const path = require('path');
const serve = require('koa-static');
const mount = require('koa-mount');

const mongoClient = require('./public/mongo');

// eslint-disable-next-line no-underscore-dangle
const _client = mongoClient.connect();

const app = websockify(new Koa());
const PORT = 4500;

const pug = new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
});

// 다른 코드들
app.use(mount('/public', serve('public')));

app.ws.use(
  route.all('/chat', (ctx) => {
    const { server } = app.ws;

    ctx.websocket.on('message', (message) => {
      server.clients.forEach((client) => {
        client.send(message.toString());
      });
    });
  })
);

app.use(async (ctx) => {
  await ctx.render('chat');
});

app.listen(PORT, () => {
  console.log(`서버는 ${PORT} 번 포트에서 실행 중입니다!`);
});
