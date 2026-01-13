// script.js (index) - carrega messages.json, escolhe uma mensagem aleatória,
// tenta salvar em sessionStorage; se não for possível, passa text/ref na querystring.
// Em seguida navega para message.html.

const cookieBtn = document.getElementById('cookieBtn');

let messages = [];

// Carrega mensagens do JSON (com fallback embutido em caso de erro)
async function loadMessages() {
  try {
    const res = await fetch('messages.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const msgs = await res.json();
    if (Array.isArray(msgs) && msgs.length > 0) {
      messages = msgs;
      return;
    }
    throw new Error('messages.json vazio ou formato inválido');
  } catch (e) {
    console.warn('Falha ao carregar messages.json, usando fallback embutido:', e);
    messages = [
      { text: "Confie no Senhor de todo o seu coração.", ref: "Provérbios 3:5" },
      { text: "Tudo coopera para o bem daqueles que amam a Deus.", ref: "Romanos 8:28" },
      { text: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmo 23:1" },
      { text: "Posso todas as coisas naquele que me fortalece.", ref: "Filipenses 4:13" }
    ];
  }
}

function crackCookieAnimation(){
  cookieBtn.classList.add('cracked');
  setTimeout(()=> cookieBtn.classList.remove('cracked'), 1200);
}

function pickRandomIndex() {
  if (!messages || messages.length === 0) return 0;
  return Math.floor(Math.random() * messages.length);
}

// Testa se sessionStorage é utilizável
function canUseSessionStorage() {
  try {
    const key = '__test_ss__';
    sessionStorage.setItem(key, '1');
    sessionStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

cookieBtn.addEventListener('click', async () => {
  if (!messages || messages.length === 0) await loadMessages();

  const idx = pickRandomIndex();
  const selected = messages[idx];

  // tenta salvar em sessionStorage
  let usedSession = false;
  if (canUseSessionStorage()) {
    try {
      sessionStorage.setItem('selectedMessage', JSON.stringify(selected));
      usedSession = true;
    } catch (e) {
      console.warn('Erro ao gravar sessionStorage:', e);
      usedSession = false;
    }
  }

  crackCookieAnimation();

  // espera a animação e navega:
  setTimeout(() => {
    if (usedSession) {
      // URL simples com índice apenas (opcional)
      window.location.href = `message.html?i=${idx}`;
    } else {
      // sessionStorage indisponível: passa texto e ref na querystring (encoded)
      // cuidado com tamanho da URL — mensagens longas podem truncar; esse é fallback
      const qs = new URLSearchParams();
      if (selected && selected.text) qs.set('text', selected.text);
      if (selected && selected.ref) qs.set('ref', selected.ref);
      window.location.href = `message.html?${qs.toString()}`;
    }
  }, 650);
});

// inicialização
(async function init(){
  await loadMessages();
})();