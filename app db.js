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

app.use(mount('/public', serve('public')));

app.ws.use(
  route.all('/chat', async (ctx) => {
    const { server } = app.ws;

    const client = await _client;
    const cursor = client.db('kdt1').collection('chats');
    const chats = cursor.find(
      {},
      {
        sort: {
          createdAt: 1,
        },
      }
    );
    const chatsData = await chats.toArray();

    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        data: {
          chatsData,
        },
      })
    );

    server.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: 'chat',
          data: {
            name: '서버',
            msg: `새로운 유저가 참여 했습니다. 현재 유저 수 ${server.clients.size}`,
            bg: 'bg-danger',
            text: 'text-white',
          },
        })
      );
    });

    ctx.websocket.on('message', async (message) => {
      const chat = JSON.parse(message);
      const insertClient = await _client;
      const chatCursor = insertClient.db('kdt1').collection('chats');
      await chatCursor.insertOne({
        ...chat,
        createdAt: new Date(),
      });

      // const { name, msg, bg, text } = chat;

      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            data: {
              ...chat,
            },
          })
        );
      });
    });

    ctx.websocket.on('close', () => {
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            data: {
              name: '서버',
              msg: `유저 한명이 나갔습니다. 현재 유저 수 ${server.clients.size}`,
              bg: 'bg-black',
              text: 'text-white',
            },
          })
        );
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
