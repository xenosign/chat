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
    '페이커 팬인',
    '노래 듣는',
    '카톡 중인',
    '커리 팬인',
    '노래 부르는',
    '곧 생일인',
    '즐거운',
    '행복한',
    '상큼한',
    '성실한',
    '솔직한',
    '진지한',
    '현명한',
    '잰틀한',
    '침착한',
    '신실한',
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
    '슬기님',
    '계환님',
    '성현님',
    '은정님',
    '정혁님',
    '호준님',
    '성재님',
    '성희님',
    '지원님',
    '진솔님',
    '민선님',
    '민영님',
    '수빈님',
    '상아님',
    '재연님',
    '윤제님',
    '유림님',
    '찬호님',
    '경은님',
    '성희님',
    '두루님',
    '인영님',
    '지영님',
    '성범님',
  ];

  const bootColor = [
    { bg: 'bg-primary', text: 'text-white' },
    { bg: 'bg-success', text: 'text-white' },
    { bg: 'bg-warning', text: 'text-black' },
    { bg: 'bg-info', text: 'text-white' },
    { bg: 'alert-primary', text: 'text-black' },
    { bg: 'alert-secondary', text: 'text-black' },
    { bg: 'alert-success', text: 'text-black' },
    { bg: 'alert-danger', text: 'text-black' },
    { bg: 'alert-warning', text: 'text-black' },
    { bg: 'alert-info', text: 'text-black' },
  ];

  function pickRandomArr(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  const nickName = `${pickRandomArr(adj)} ${pickRandomArr(member)}`;
  const thema = pickRandomArr(bootColor);

  btn.addEventListener('click', () => {
    const msg = inputEl.value;
    const data = {
      name: nickName,
      msg,
      bg: thema.bg,
      text: thema.text,
    };
    socket.send(JSON.stringify(data));
    inputEl.value = '';
  });

  inputEl.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      btn.click();
    }
  });

  const chats = [];

  function drawChats(type, data) {
    if (type === 'sync') {
      chatEl.innerHTML = '';
      chats.forEach(({ name, msg, bg, text }) => {
        const msgEl = document.createElement('p');
        msgEl.classList.add('p-2');
        msgEl.classList.add(bg);
        msgEl.classList.add(text);
        msgEl.classList.add('rounded');
        msgEl.innerText = `${name} : ${msg}`;
        chatEl.appendChild(msgEl);
        chatEl.scrollTop = chatEl.scrollHeight - chatEl.clientHeight;
      });
    } else if (type === 'chat') {
      const msgEl = document.createElement('p');
      msgEl.classList.add('p-2');
      msgEl.classList.add(data.bg);
      msgEl.classList.add(data.text);
      msgEl.classList.add('fw-bold');
      msgEl.classList.add('rounded');
      msgEl.innerText = `${data.name} : ${data.msg}`;
      chatEl.appendChild(msgEl);
      chatEl.scrollTop = chatEl.scrollHeight - chatEl.clientHeight;
    }
  }

  socket.addEventListener('message', (event) => {
    const msgData = JSON.parse(event.data);
    const { type, data } = msgData;

    if (msgData.type === 'sync') {
      const oldChats = data.chatsData;
      chats.push(...oldChats);
      drawChats(msgData.type, data);
    } else if (msgData.type === 'chat') {
      chats.push(data);
      drawChats(msgData.type, data);
    }
  });
})();
