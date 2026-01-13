# Biscoito da Sorte Bíblico

Site simples que mostra uma mensagem bíblica aleatória quando o usuário clica em um biscoito. Projeto responsivo, pronto para publicar no GitHub Pages.

Como usar
1. Crie um repositório no GitHub (ex.: `biscoito-da-sorte-biblico`).
2. Faça commit dos arquivos: `index.html`, `styles.css`, `script.js`, `messages.json`.
3. Ative o GitHub Pages nas configurações do repositório: selecione a branch `main` (ou `master`) e pasta `/ (root)`.
4. Acesse `https://<seu-usuario>.github.io/<nome-do-repo>/`.

Personalização
- Edite `messages.json` para adicionar/remover mensagens. Cada item deve ter `text` e `ref`. Você pode incluir campo `source` com link para a versão da Bíblia que usar.
- Para usar versos completos, certifique-se da licença da tradução escolhida (prefira traduções de domínio público ou com permissão).

Acessibilidade e performance
- O botão do biscoito é um elemento `<button>` com foco e label para leitores de tela.
- O site é mobile-first e adaptável para desktop.
- Para performance extra:
  - Minifique CSS/JS em produção.
  - Adicione cache-control via GitHub Pages (ou use um CDN).
  - Pode adicionar um Service Worker simples para offline.

Melhorias possíveis
- Adicionar animação mais elaborada de "quebrar" biscoito (dividir em duas metades).
- Suporte multilíngue (i18n).
- Integração com imagem de fundo dinâmica ou tema noturno.
- Adicionar um contador de curtidas/compartilhamentos (requer backend).

Se quiser, eu posso:
- Gerar um layout alternativo (escuro / mais minimalista).
- Fazer deploy automático com GitHub Actions.
- Adicionar um Service Worker para permitir uso offline.
- Traduzir/formatar as mensagens para uma tradução específica da Bíblia (se você informar qual).