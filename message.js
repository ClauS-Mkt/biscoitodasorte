// message.js - exibe a mensagem enviada por sessionStorage (preferencial).
// Fallbacks: querystring (text/ref) ou carregamento de messages.json com ?i=<idx>.
// Exibe mensagens de erro úteis no UI e logs no console.

const messageText = document.getElementById('messageText');
const messageRef = document.getElementById('messageRef');
const shareBtn = document.getElementById('shareBtn');
const note = document.getElementById('note');

// Elementos para compartilhar com foto
const photoShareBtn = document.getElementById('photoShareBtn');
const photoInput = document.getElementById('photoInput');

if (photoShareBtn && photoInput) {
  photoShareBtn.addEventListener('click', () => {
    photoInput.value = '';
    photoInput.click();
  });

  photoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Cria canvas do tamanho da foto
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Monta texto (mensagem + referência)
      const text = messageText.textContent || '';
      const ref = messageRef.textContent || '';
      const fullText = ref ? `${text} — ${ref}` : text;

      // Quebra em linhas se necessário
      ctx.font = `bold ${Math.floor(canvas.width/18)}px Segoe UI, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const maxWidth = canvas.width * 0.85;
      const words = fullText.split(' ');
      let line = '';
      let linesArr = [];
      for (let word of words) {
        let testLine = line + word + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          linesArr.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      linesArr.push(line);

      // Fundo branco semi-transparente para contraste
      const padding = 24;
      const lineHeight = Math.floor(canvas.width/18) + 10;
      const totalHeight = linesArr.length * lineHeight;
      const yStart = canvas.height/2 - totalHeight/2;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(
        canvas.width*0.05,
        yStart - padding/2,
        canvas.width*0.9,
        totalHeight + padding
      );

      // Texto principal
      ctx.fillStyle = '#123955';
      linesArr.forEach((l, i) => {
        ctx.fillText(l.trim(), canvas.width/2, yStart + i*lineHeight);
      });

      // Mostra preview na tela
      const previewContainer = document.getElementById('photoPreviewContainer');
      previewContainer.innerHTML = '';
      const previewImg = document.createElement('img');
      previewImg.src = canvas.toDataURL('image/jpeg', 0.92);
      previewImg.alt = 'Prévia da foto com mensagem';
      previewImg.style.maxWidth = '100%';
      previewImg.style.borderRadius = '12px';
      previewImg.style.boxShadow = '0 2px 12px #b6d6f2';
      previewContainer.appendChild(previewImg);

      // Botão de baixar
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = '⬇️ Baixar imagem';
      downloadBtn.className = 'btn outline';
      downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = previewImg.src;
        a.download = 'biscoito-mensagem.jpg';
        a.click();
      };
      previewContainer.appendChild(downloadBtn);

      // Botão de compartilhar (se suportado)
      if (navigator.canShare) {
        const shareBtn = document.createElement('button');
        shareBtn.textContent = '📤 Compartilhar imagem';
        shareBtn.className = 'btn';
        shareBtn.onclick = async () => {
          canvas.toBlob(async (blob) => {
            const fileToShare = new File([blob], 'biscoito-mensagem.jpg', { type: blob.type });
            try {
              await navigator.share({
                files: [fileToShare],
                title: 'Minha mensagem do Biscoito da Sorte'
              });
            } catch (e) {
              alert('Não foi possível compartilhar a imagem.');
            }
          }, 'image/jpeg', 0.92);
        };
        previewContainer.appendChild(shareBtn);
      }

      previewContainer.style.display = 'flex';
    };
  });
}

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