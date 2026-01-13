// message.js - exibe a mensagem enviada por sessionStorage (preferencial).
// Fallbacks: querystring (text/ref) ou carregamento de messages.json com ?i=<idx>.
// Exibe mensagens de erro úteis no UI e logs no console.

const messageText = document.getElementById('messageText');
const messageRef = document.getElementById('messageRef');
const shareBtn = document.getElementById('shareBtn');
const note = document.getElementById('note');

function getParams() {
  return new URLSearchParams(window.location.search);
}

function showMessageObject(m) {
  if (!m) {
    messageText.textContent = 'Mensagem indisponível.';
    messageRef.textContent = '';
    return;
  }
  messageText.textContent = m.text || 'Mensagem vazia.';
  messageRef.textContent = m.ref || '';
}

// tenta obter mensagem de sessionStorage (e remove em seguida)
function getMessageFromSession() {
  try {
    const raw = sessionStorage.getItem('selectedMessage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // remove para evitar reutilização futura indesejada
    sessionStorage.removeItem('selectedMessage');
    return parsed;
  } catch (e) {
    console.warn('Erro lendo selectedMessage no sessionStorage:', e);
    return null;
  }
}

// tenta obter mensagem pela querystring text/ref (fallback quando storage indisponível)
function getMessageFromQuery() {
  const params = getParams();
  const text = params.get('text');
  const ref = params.get('ref') || params.get('reference') || params.get('r');
  if (text) return { text: decodeURIComponent(text), ref: ref ? decodeURIComponent(ref) : '' };
  return null;
}

// tenta carregar messages.json e usar índice ?i= (último recurso)
async function getMessageFromJsonByIndex() {
  try {
    const res = await fetch('messages.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const messages = await res.json();
    if (!Array.isArray(messages) || messages.length === 0) return null;
    const params = getParams();
    const rawIdx = params.get('i');
    const idx = rawIdx !== null ? Number(rawIdx) : NaN;
    if (Number.isInteger(idx) && idx >= 0 && idx < messages.length) {
      return messages[idx];
    }
    // se não houver índice válido, retorna aleatória
    return messages[Math.floor(Math.random() * messages.length)];
  } catch (e) {
    console.error('Erro ao carregar messages.json:', e);
    return null;
  }
}

async function loadAndShowMessage() {
  // 1) sessionStorage (preferência)
  const fromSession = getMessageFromSession();
  if (fromSession) {
    showMessageObject(fromSession);
    return;
  }

  // 2) querystring (text/ref)
  const fromQuery = getMessageFromQuery();
  if (fromQuery) {
    // querystring pode vir codificada — ensure proper decode
    showMessageObject(fromQuery);
    return;
  }

  // 3) messages.json por índice ou aleatória
  const fromJson = await getMessageFromJsonByIndex();
  if (fromJson) {
    showMessageObject(fromJson);
    return;
  }

  // 4) erro final
  messageText.textContent = 'Erro ao carregar a mensagem. Verifique se messages.json está presente e o site está sendo servido por HTTP.';
  messageRef.textContent = '';
  note.textContent = 'Dica: teste servindo localmente com um servidor (python -m http.server) ou publique no GitHub Pages.';
}

shareBtn.addEventListener('click', async () => {
  const text = `${messageText.textContent} — ${messageRef.textContent}`;
  try {
    if (navigator.share) {
      await navigator.share({ text });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      shareBtn.textContent = 'Copiado';
      setTimeout(()=> shareBtn.textContent = 'Copiar', 1400);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      shareBtn.textContent = 'Copiado';
      setTimeout(()=> shareBtn.textContent = 'Copiar', 1400);
    }
  } catch (e) {
    console.error('Erro ao compartilhar:', e);
  }
});

// inicialização
(async function init(){
  await loadAndShowMessage();
})();