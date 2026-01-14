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

// === CONFIG DO UPLOAD (AJUSTE AQUI) ===
const WORKER_UPLOAD_URL = "https://fotopainelmdl.clauber.workers.dev/upload"; // <-- troque
const PUBLISH_TOKEN = "uygfw78fh7sv8093rfb"; // <-- troque (o mesmo do Worker)
// ======================================

function setUploadStatus(container, text, ok = false) {
  let el = container.querySelector("#uploadStatus");
  if (!el) {
    el = document.createElement("div");
    el.id = "uploadStatus";
    el.style.marginTop = "10px";
    el.style.fontWeight = "800";
    el.style.fontFamily = "monospace";
    container.appendChild(el);
  }
  el.textContent = text;
  el.style.color = ok ? "#00C756" : "#123955";
}

async function uploadToWorker(blob, caption) {
  const fd = new FormData();
  fd.append("file", new File([blob], "polaroid.jpg", { type: "image/jpeg" }));
  fd.append("caption", caption || "");

  const res = await fetch(WORKER_UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${PUBLISH_TOKEN}` },
    body: fd,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${txt}`);
  }
  return res.json().catch(() => ({}));
}

// desenha a foto no estilo "cover" dentro de uma área
function drawCover(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;

  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale;
  const sh = h / scale;

  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// escreve a frase em até 2 linhas dentro da área 46px
function drawCaption(ctx, text, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // tenta tamanhos (cabe melhor)
  const sizes = [13, 12, 11, 10];
  let lines = [text];

  for (const fs of sizes) {
    ctx.font = `700 ${fs}px monospace`;

    // quebra em palavras e limita em 2 linhas
    const words = (text || "").split(/\s+/).filter(Boolean);
    const maxLines = 2;
    const out = [];
    let line = "";

    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width <= w) {
        line = test;
      } else {
        if (line) out.push(line);
        line = word;
        if (out.length === maxLines - 1) break;
      }
    }
    if (line && out.length < maxLines) out.push(line);

    // se sobrou palavra, coloca reticências na última linha
    let final = out;
    if (words.join(" ").length > out.join(" ").length) {
      const last = out[out.length - 1] || "";
      let cut = last;
      while (ctx.measureText(cut + "…").width > w && cut.length > 0) {
        cut = cut.slice(0, -1);
      }
      final = out.slice(0, -1).concat((cut || "").trim() + "…");
    }

    // checa se 2 linhas cabem na altura
    const lineH = fs + 2;
    if (final.length * lineH <= h) {
      lines = final;
      break;
    }
  }

  // desenha centralizado verticalmente dentro do h
  const fsMatch = /(\d+)px/.exec(ctx.font);
  const fs = fsMatch ? parseInt(fsMatch[1], 10) : 12;
  const lineH = fs + 2;

  const totalH = lines.length * lineH;
  let cy = y + h / 2 - totalH / 2 + lineH / 2;

  for (const l of lines) {
    ctx.fillText(l, x + w / 2, cy);
    cy += lineH;
  }

  ctx.restore();
}

if (photoShareBtn && photoInput) {
  photoShareBtn.addEventListener('click', () => {
    photoInput.value = '';
    photoInput.click();
  });

  photoInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const previewContainer = document.getElementById("photoPreviewContainer");
  previewContainer.style.display = "flex";
  previewContainer.innerHTML = "";

  // Texto que vai dentro da polaroid (se quiser só a frase sem referência, troque para messageText.textContent)
  const text = (messageText.textContent || "").trim();
  const ref = (messageRef.textContent || "").trim();
  const captionInside = ref ? `${text} — ${ref}` : text;

  // carrega imagem capturada
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    // CANVAS no tamanho exato da polaroid do painel
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 230;
    const ctx = canvas.getContext("2d");

    // fundo branco
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 200, 230);

    // foto (182x175) em (9,9) com cover
    drawCover(ctx, img, 9, 9, 182, 175);

    // frase na faixa inferior (46px)
    // área começa em y=230-46=184
    drawCaption(ctx, captionInside, 0, 184, 200, 46);

    // preview da polaroid pronta
    const previewImg = document.createElement("img");
    previewImg.src = canvas.toDataURL("image/jpeg", 0.92);
    previewImg.alt = "Prévia polaroid";
    previewImg.style.width = "200px";
    previewImg.style.height = "230px";
    previewImg.style.borderRadius = "8px";
    previewImg.style.boxShadow = "0 10px 25px rgba(0,0,0,.35)";
    previewContainer.appendChild(previewImg);

    // botão PUBLICAR (só aparece depois da prévia)
    const publishBtn = document.createElement("button");
    publishBtn.className = "btn";
    publishBtn.textContent = "📺 Publicar no painel";
    previewContainer.appendChild(publishBtn);

    // status
    setUploadStatus(previewContainer, "Pronto para publicar.");

    publishBtn.onclick = async () => {
      publishBtn.disabled = true;
      publishBtn.textContent = "Enviando…";
      setUploadStatus(previewContainer, "Enviando para o painel…");

      canvas.toBlob(async (blob) => {
        try {
          // opcional: também manda caption separado no feed
          const result = await uploadToWorker(blob, captionInside);
          setUploadStatus(previewContainer, "Enviado ✅", true);
          publishBtn.textContent = "Publicado ✅";
          // limpa input para permitir outra foto
          photoInput.value = "";
          console.log("Upload OK:", result);
        } catch (err) {
          console.error(err);
          setUploadStatus(previewContainer, "Erro ao enviar ❌ (veja o console)");
          publishBtn.disabled = false;
          publishBtn.textContent = "📺 Publicar no painel";
        }
      }, "image/jpeg", 0.92);
    };
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