var $messages = document.getElementById('messages');
var $form = document.getElementById('form');
var $input = document.getElementById('input');
var $typing = document.getElementById('typing');
var $clear = document.getElementById('clearBtn');
var STORAGE_KEY = 'chat-simples:messages';
function now() {
    var d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function loadMessages() {
    try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch (_a) {
        return [];
    }
}
function saveMessages(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function renderMessage(msg) {
    var wrap = document.createElement('div');
    wrap.className = 'msg ' + msg.role;
    var avatar = document.createElement('div');
    avatar.className = 'avatar ' + msg.role;
    avatar.textContent = msg.role === 'user' ? 'U' : 'B';
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    var meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = (msg.role === 'user' ? 'Você' : 'Bot') + ' • ' + msg.time;
    var text = document.createElement('div');
    text.textContent = msg.text;
    bubble.appendChild(meta);
    bubble.appendChild(text);
    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    $messages.appendChild(wrap);
    $messages.scrollTop = $messages.scrollHeight;
}
function addMessage(role, text) {
    var msg = { id: uid(), role: role, text: text, time: now() };
    renderMessage(msg);
    var list = loadMessages();
    list.push(msg);
    saveMessages(list);
}
function botReply(userText) {
    var t = userText.trim().toLowerCase();
    if (/^oi$|^ol[áa]$|^e[ai]$/.test(t))
        return 'Olá! Como posso te ajudar?';
    if (t.includes('hora'))
        return 'Agora são ' + now() + '.';
    if (t.includes('data'))
        return 'Hoje é ' + new Date().toLocaleDateString();
    if (t.includes('piada')) {
        var jokes = [
            'Por que o JavaScript foi ao médico? Porque estava com muitos bugs! 🐛',
            'Programadores não gostam de natureza: tem muitos bugs. 🌿',
            'Console.log é meu terapeuta favorito. 💬'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }
    if (t.includes('eco') || t.startsWith('repete'))
        return 'Você disse: ' + userText;
    var fallbacks = [
        'Entendi. Me conte mais!',
        'Beleza! Quer tentar outro assunto?',
        'Posso te dizer a hora, contar uma piada, ou repetir o que você disser. 😉',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
function setTyping(v) {
    $typing.classList.toggle('hidden', !v);
}
function simulateBot(userText) {
    setTyping(true);
    var ms = 600 + Math.floor(Math.random() * 900);
    setTimeout(function () {
        addMessage('bot', botReply(userText));
        setTyping(false);
    }, ms);
}
function restore() {
    var list = loadMessages();
    list.forEach(renderMessage);
    if (list.length === 0) {
        addMessage('bot', 'Olá! Sou um bot local. Faça uma pergunta ou peça uma piada. 😄');
    }
}
$form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = $input.value.trim();
    if (!text)
        return;
    addMessage('user', text);
    $input.value = '';
    simulateBot(text);
});
$clear.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_KEY);
    $messages.innerHTML = '';
    addMessage('bot', 'Histórico limpo! Começamos de novo. ✨');
});
restore();
