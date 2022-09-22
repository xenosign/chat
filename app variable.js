const Koa = require('koa');
const websockify = require('koa-websocket');
const route = require('koa-route');
const Pug = require('koa-pug');
const path = require('path');
const serve = require('koa-static');
const mount = require('koa-mount');

const app = websockify(new Koa());
const PORT = 4500;

const pug = new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
});

app.use(mount('/public', serve('public')));

app.ws.use(
  route.all('/chat', (ctx) => {
    const { server } = app.ws;

    server.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          name: '서버',
          msg: `새로운 유저가 참여 했습니다. 현재 유저 수 ${server.clients.size}`,
          bg: 'bg-danger',
          text: 'text-white',
        })
      );
    });

    ctx.websocket.on('message', (message) => {
      const { name, msg, bg, text } = JSON.parse(message);

      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            name,
            msg,
            bg,
            text,
          })
        );
      });
    });

    ctx.websocket.on('close', () => {
      console.log(
        `유저 한명이 나갔습니다. 현재 유저 수 ${server.clients.size}`
      );
    });
  })
);

app.use(async (ctx) => {
  await ctx.render('chat');
});

app.listen(PORT, () => {
  console.log(`서버는 ${PORT} 번 포트에서 실행 중입니다!`);
});
