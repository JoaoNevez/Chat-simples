type Role = 'user' | 'bot';
type ChatMessage = { id: string; role: Role; text: string; time: string; };

const $messages = document.getElementById('messages') as HTMLDivElement;
const $form = document.getElementById('form') as HTMLFormElement;
const $input = document.getElementById('input') as HTMLInputElement;
const $typing = document.getElementById('typing') as HTMLDivElement;
const $clear = document.getElementById('clearBtn') as HTMLButtonElement;

const STORAGE_KEY = 'chat-simples:messages';

function now(): string {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as ChatMessage[] : [];
  } catch {
    return [];
  }
}

function saveMessages(list: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderMessage(msg: ChatMessage) {
  const wrap = document.createElement('div');
  wrap.className = 'msg ' + msg.role;

  const avatar = document.createElement('div');
  avatar.className = 'avatar ' + msg.role;
  avatar.textContent = msg.role === 'user' ? 'U' : 'B';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = (msg.role === 'user' ? 'Você' : 'Bot') + ' • ' + msg.time;

  const text = document.createElement('div');
  text.textContent = msg.text;

  bubble.appendChild(meta);
  bubble.appendChild(text);

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  $messages.appendChild(wrap);
  $messages.scrollTop = $messages.scrollHeight;
}

function addMessage(role: Role, text: string) {
  const msg: ChatMessage = { id: uid(), role, text, time: now() };
  renderMessage(msg);
  const list = loadMessages();
  list.push(msg);
  saveMessages(list);
}

function botReply(userText: string): string {
  const t = userText.trim().toLowerCase();

  if (/^oi$|^ol[áa]$|^e[ai]$/.test(t)) return 'Olá! Como posso te ajudar?';
  if (t.includes('hora')) return 'Agora são ' + now() + '.';
  if (t.includes('data')) return 'Hoje é ' + new Date().toLocaleDateString();
  if (t.includes('piada')) {
    const jokes = [
      'Por que o JavaScript foi ao médico? Porque estava com muitos bugs! 🐛',
      'Programadores não gostam de natureza: tem muitos bugs. 🌿',
      'Console.log é meu terapeuta favorito. 💬'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  if (t.includes('eco') || t.startsWith('repete')) return 'Você disse: ' + userText;

  const fallbacks = [
    'Entendi. Me conte mais!',
    'Beleza! Quer tentar outro assunto?',
    'Posso te dizer a hora, contar uma piada, ou repetir o que você disser. 😉',
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function setTyping(v: boolean) {
  $typing.classList.toggle('hidden', !v);
}

function simulateBot(userText: string) {
  setTyping(true);
  const ms = 600 + Math.floor(Math.random() * 900);
  setTimeout(() => {
    addMessage('bot', botReply(userText));
    setTyping(false);
  }, ms);
}

function restore() {
  const list = loadMessages();
  list.forEach(renderMessage);
  if (list.length === 0) {
    addMessage('bot', 'Olá! Sou um bot local. Faça uma pergunta ou peça uma piada. 😄');
  }
}

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = $input.value.trim();
  if (!text) return;
  addMessage('user', text);
  $input.value = '';
  simulateBot(text);
});

$clear.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  $messages.innerHTML = '';
  addMessage('bot', 'Histórico limpo! Começamos de novo. ✨');
});

restore();
