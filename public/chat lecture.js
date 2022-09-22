// @ts-check
// IIFE
(() => {
  const socket = new WebSocket(`ws://${window.location.host}/chat`);
  const inputEl = document.getElementById('input');
  const btn = document.getElementById('btn');
  const chatEl = document.getElementById('chat');

  const adj = [
    '멋진',
    '잘생긴',
    '예쁜',
    '졸린',
    '우아한',
    '힙한',
    '배고픈',
    '집에 가기 싫은',
    '집에 가고 싶은',
    '귀여운',
    '중후한',
    '똑똑한',
    '이게 뭔가 싶은',
    '까리한',
    '프론트가 하고 싶은',
    '백엔드가 재미 있는',
    '몽고 디비 날려 먹은',
    '열심히하는',
    '피곤한',
    '눈빛이 초롱초롱한',
    '치킨이 땡기는',
    '술이 땡기는',
  ];
  const member = [
    '유림님',
    '지훈님',
    '한솔님',
    '윤비님',
    '승환님',
    '영은님',
    '수지님',
    '종익님',
    '혜영님',
    '준우님',
    '진형님',
    '민정님',
    '소민님',
    '지현님',
    '다영님',
    '세영님',
    '의진님',
    '승수님',
    '해성님',
    '허원님',
  ];

  function pickRandomArr(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  const nickName = `${pickRandomArr(adj)} ${pickRandomArr(member)}`;

  btn.addEventListener('click', () => {
    const msg = inputEl.value;
    const data = {
      name: nickName,
      msg,
    };
    socket.send(JSON.stringify(data));
    inputEl.value = '';
  });

  socket.addEventListener('message', (event) => {
    const { name, msg } = JSON.parse(event.data);

    const msgEl = document.createElement('p');
    msgEl.classList.add('p-2');
    msgEl.classList.add('bg-warning');
    msgEl.classList.add('text-black');
    msgEl.classList.add('fw-bold');
    msgEl.innerText = `${name} : ${msg}`;
    chatEl.appendChild(msgEl);
    chatEl.scrollTop = chatEl.scrollHeight - chatEl.clientHeight;
    console.log(chatEl?.scrollTop);
  });
})();
