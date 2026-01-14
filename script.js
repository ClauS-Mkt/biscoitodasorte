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
      { "ref": "Provérbios 3:5", "text": "Confie no Senhor de todo o coração, não no próprio entendimento." },
      { "ref": "Salmo 46:1", "text": "Deus é o nosso refúgio e a nossa força, socorro sempre presente na angústia." },
      { "ref": "Josué 1:9", "text": "Seja forte e corajoso! Não se apavore, pois o Senhor, o seu Deus, estará com você por onde você andar." },
      { "ref": "Salmo 121:1-2", "text": "O meu socorro vem do Senhor, que fez os céus e a terra; Ele não deixará seu pé vacilar." },
      { "ref": "Filipenses 4:13", "text": "Tudo posso naquele que me fortalece." },
      { "ref": "Mateus 28:20", "text": "E lembrem-se: eu estou com vocês todos os dias, até o fim dos tempos." },
      { "ref": "Salmo 27:1", "text": "O Senhor é a minha luz e a minha salvação; de quem terei medo?" },
      { "ref": "Naum 1:7", "text": "O Senhor é bom, um refúgio em tempos de angústia. Ele cuida dos que nele confiam." },
      { "ref": "João 14:27", "text": "Deixo-lhes a paz; a minha paz lhes dou. Não se perturbe o seu coração." },
      { "ref": "Deuteronômio 31:8", "text": "O Senhor vai adiante de você e estará com você; ele nunca o abandonará." },
      { "ref": "Romanos 8:31", "text": "Se Deus é por nós, quem será contra nós?" },
      { "ref": "Salmo 34:7", "text": "O anjo do Senhor acampa-se ao redor dos que o temem, e os livra." },
      { "ref": "2 Timóteo 1:7", "text": "Pois Deus não nos deu um espírito de medo, mas de poder, de amor e de equilíbrio." },
      { "ref": "Isaías 40:31", "text": "Aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias." },
      { "ref": "Êxodo 14:14", "text": "O Senhor lutará por vocês; tão somente acalmem-se." },
      { "ref": "Salmo 91:11", "text": "Porque a seus anjos ele dará ordens a seu respeito, para que o guardem em todos os seus caminhos." },
      { "ref": "1 Pedro 5:7", "text": "Lancem sobre Ele toda a sua ansiedade, porque Ele tem cuidado de vocês." },
      { "ref": "Sofonias 3:17", "text": "O Senhor, o seu Deus, está em seu meio, poderoso para salvar." },
      { "ref": "Salmo 23:4", "text": "Mesmo que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo." },
      { "ref": "Lamentações 3:22-23", "text": "As misericórdias do Senhor são a causa de não sermos consumidos; elas se renovam a cada manhã." },
      { "ref": "João 16:33", "text": "No mundo vocês terão aflições; contudo, tenham ânimo! Eu venci o mundo." },
      { "ref": "Gênesis 12:2", "text": "Eu o abençoarei e tornarei seu nome famoso; você será uma bênção." },
      { "ref": "Êxodo 14:14", "text": "O Senhor lutará por você; mantenha-se calmo." },
      { "ref": "Deuteronômio 31:8", "text": "O Senhor vai adiante de você e nunca o abandonará; não tenha medo." },
      { "ref": "Josué 1:9", "text": "Seja forte e corajoso; o Senhor está com você por onde quer que vá." },
      { "ref": "1 Crônicas 16:11", "text": "Busque o Senhor e o seu poder; busque sempre a sua face." },
      { "ref": "Esdras 10:4", "text": "Levante-se, pois esta tarefa é sua; seja forte e mãos à obra." },
      { "ref": "Neemias 8:10", "text": "Não fiquem tristes, pois a alegria do Senhor é a sua força." },
      { "ref": "Salmo 19:14", "text": "Que as palavras da minha boca e o meu pensamento sejam aceitáveis a Ti." },
      { "ref": "Salmo 30:5", "text": "O choro pode durar uma noite, mas a alegria vem pela manhã." },
      { "ref": "Salmo 34:8", "text": "Provem e vejam como o Senhor é bom; feliz é quem nele se refugia." },
      { "ref": "Salmo 139:14", "text": "Eu te louvo porque me fizeste de modo especial e admirável." },
      { "ref": "Provérbios 3:6", "text": "Reconheça o Senhor em todos os seus caminhos, e ele guiará seus passos." },
      { "ref": "Mateus 28:20", "text": "E lembrem-se: eu estou com vocês todos os dias, até o fim dos tempos." },
      { "ref": "João 16:24", "text": "Peçam e receberão, para que a alegria de vocês seja completa." },
      { "ref": "Romanos 8:31", "text": "Se Deus é por nós, quem será contra nós?" },
      { "ref": "Efésios 4:32", "text": "Sejam bondosos e perdoem uns aos outros, como Deus os perdoou em Cristo." },
      { "ref": "Filipenses 4:19", "text": "O meu Deus suprirá todas as necessidades de vocês conforme as suas riquezas." },
      { "ref": "Colossenses 3:14", "text": "Acima de tudo, revistam-se do amor, que é o elo perfeito." },
      { "ref": "Hebreus 12:1", "text": "Corramos com perseverança a corrida que nos foi proposta." },
      { "ref": "1 Pedro 5:10", "text": "O Deus de toda a graça os restaurará e os tornará fortes e firmes." },
      { "ref": "Sêneca", "text": "A sorte é o que acontece quando a preparação encontra a oportunidade." },
      { "ref": "Aristóteles", "text": "Nós somos o que fazemos repetidamente; a excelência, então, não é um ato, mas um hábito." },
      { "ref": "Marcus Aurelius", "text": "A felicidade da sua vida depende da qualidade dos seus pensamentos." },
      { "ref": "Lao Tzu", "text": "Uma jornada de mil milhas começa com um único passo." },
      { "ref": "Friedrich Nietzsche", "text": "Aquele que tem um porquê para viver pode suportar quase qualquer como." },
      { "ref": "Viktor Frankl", "text": "Quando não somos mais capazes de mudar uma situação, somos desafiados a mudar a nós mesmos." },
      { "ref": "Confúcio", "text": "Não importa o quão devagar você vá, desde que não pare." },
      { "ref": "Ralph Waldo Emerson", "text": "O que está atrás de nós e o que está à nossa frente são questões menores comparadas ao que está dentro de nós." },
      { "ref": "Sócrates", "text": "A vida não examinada não vale a pena ser vivida." },
      { "ref": "Albert Einstein", "text": "No meio da dificuldade encontra-se a oportunidade." },
      { "ref": "Rumi", "text": "Não seja uma gota no oceano, seja o oceano inteiro em uma gota." },
      { "ref": "Clarice Lispector", "text": "Até onde posso vou deixando o melhor de mim." },
      { "ref": "Guimarães Rosa", "text": "O que a vida quer da gente é coragem." },
      { "ref": "Blaise Pascal", "text": "O coração tem razões que a própria razão desconhece." },
      { "ref": "Sun Tzu", "text": "A maior vitória é aquela que não requer batalha." },
      { "ref": "Mahatma Gandhi", "text": "Seja a mudança que você deseja ver no mundo." },
      { "ref": "Hermann Hesse", "text": "Para que o novo nasça, o velho precisa morrer." },
      { "ref": "Søren Kierkegaard", "text": "A vida só pode ser compreendida olhando-se para trás; mas só pode ser vivida olhando-se para a frente." },
      { "ref": "Platão", "text": "A coisa mais importante não é viver, mas viver bem." },
      { "ref": "Epicuro", "text": "Não estrague o que você tem desejando o que não tem." },
      { "ref": "Albert Einstein", "text": "Insanidade é continuar fazendo a mesma coisa e esperar resultados diferentes." },
      { "ref": "Nikola Tesla", "text": "Se você quiser encontrar os segredos do universo, pense em termos de energia, frequência e vibração." },
      { "ref": "Machado de Assis", "text": "Esquecer é uma necessidade. A vida é uma lousa, em que o destino precisa apagar o escrito para escrever o novo." },
      { "ref": "Bon Jovi", "text": "Não dê as costas ao destino; você tem que viver sua vida enquanto ela é sua." },
      { "ref": "Renato Russo", "text": "É preciso amar as pessoas como se não houvesse amanhã." },
      { "ref": "Cazuza", "text": "O tempo não para. Eu vejo o futuro repetir o passado, eu vejo um museu de grandes novidades." },
      { "ref": "Chorão", "text": "O impossível é apenas uma questão de opinião." },
      { "ref": "Raul Seixas", "text": "Tente outra vez. Não diga que a vitória está perdida, se é de batalhas que se vive a vida." },
      { "ref": "Steve Jobs", "text": "Sua única maneira de fazer um excelente trabalho é amar o que você faz." },
      { "ref": "Mário Quintana", "text": "O passado não reconhece o seu lugar: está sempre presente." },
      { "ref": "Cora Coralina", "text": "O que vale na vida não é o ponto de partida e sim a caminhada." },
      { "ref": "Sêneca", "text": "Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis." },
      { "ref": "Tim Maia", "text": "Não quero dinheiro, eu quero amor sincero." },
      { "ref": "Legião Urbana", "text": "Quem acredita sempre alcança." },
      { "ref": "Cartola", "text": "O mundo é um moinho; vai triturar teus sonhos, tão mesquinho." },
      { "ref": "Dumbledore (J.K. Rowling)", "text": "São as nossas escolhas que revelam quem realmente somos, muito mais do que as nossas habilidades." },
      { "ref": "Mark Twain", "text": "O segredo de progredir é começar." },
      { "ref": "Emicida", "text": "Tudo, tudo, tudo, tudo que nóiz tem é nóiz." },
      { "ref": "Yuval Noah Harari", "text": "A história começou quando os homens inventaram os deuses e terminará quando os homens se tornarem deuses." },
      { "ref": "Gilberto Gil", "text": "A paz invadiu o meu coração. De repente, me encheu de paz." },
      { "ref": "Milton Nascimento", "text": "Qualquer maneira de amor vale a pena, qualquer maneira de amor vale amar." },
      { "ref": "Belchior", "text": "O passado é uma roupa que não nos serve mais." },
      { "ref": "Jorge Amado", "text": "Não há nada como o tempo para passar e as coisas se ajustarem." },
      { "ref": "Fernando Pessoa", "text": "Tudo vale a pena quando a alma não é pequena." },
      { "ref": "Clarice Lispector", "text": "Não quero ter a terrível limitação de quem vive apenas do que é capaz de fazer sentido." },
      { "ref": "The Beatles", "text": "No final, o amor que você recebe é igual ao amor que você dá." },
      { "ref": "Bob Marley", "text": "Não ganhe o mundo e perca sua alma; sabedoria é melhor que prata ou ouro." },
      { "ref": "Carl Sagan", "text": "Em algum lugar, algo incrível está esperando para ser conhecido." },
      { "ref": "Stephen Hawking", "text": "Enquanto houver vida, há esperança." },
      { "ref": "Marie Curie", "text": "Nada na vida deve ser temido, somente compreendido." },
      { "ref": "Walt Disney", "text": "Se você pode sonhar, você pode fazer." },
      { "ref": "Racionais MC's", "text": "Fé em Deus que Ele é justo." },
      { "ref": "Rita Lee", "text": "Um belo dia resolvi mudar e fazer tudo o que eu queria fazer." },
      { "ref": "Djavan", "text": "Amanhã, outro dia, lua sai, vento sopra." },
      { "ref": "Coldplay", "text": "Se você nunca tentar, você nunca saberá." },
      { "ref": "William Shakespeare", "text": "Nós somos feitos da mesma matéria que os nossos sonhos." },
      { "ref": "Guimarães Rosa", "text": "Mestre não é quem sempre ensina, mas quem de repente aprende." },
      { "ref": "Ayrton Senna", "text": "Se você quer ser bem-sucedido, precisa ter dedicação total e buscar o seu limite." },
      { "ref": "Malala Yousafzai", "text": "Uma criança, um professor, um livro e uma caneta podem mudar o mundo." },
      { "ref": "Paulo Coelho", "text": "Quando você quer alguma coisa, todo o universo conspira para que você realize seu desejo." },
      { "ref": "Voltaire", "text": "Posso não concordar com o que você diz, mas defenderei até a morte o seu direito de dizê-lo." },
      { "ref": "Oscar Wilde", "text": "Seja você mesmo; todos os outros já existem." },
      { "ref": "Freddie Mercury", "text": "Eu não serei uma estrela do rock. Eu serei uma lenda." },
      { "ref": "Taylor Swift", "text": "Tudo o que você precisa fazer é dar um passo de cada vez." },
      { "ref": "Charlie Brown Jr", "text": "Dias de luta, dias de glória." },
      { "ref": "Nelson Mandela", "text": "A educação é a arma mais poderosa que você pode usar para mudar o mundo." },
      { "ref": "Martin Luther King Jr", "text": "O que importa não é o tempo que você vive, mas como você vive." },
      { "ref": "Helen Keller", "text": "Sozinhos podemos fazer tão pouco; juntos podemos fazer muito." },
      { "ref": "Jota Quest", "text": "Vivemos esperando dias melhores, dias de paz, dias a mais." },
      { "ref": "O Rappa", "text": "A vida é um eco. Se você não gosta do que está recebendo, observe o que está emitindo." },
      { "ref": "Lewis Carroll", "text": "Se você não sabe para onde quer ir, qualquer caminho serve." },
      { "ref": "Saint-Exupéry", "text": "O essencial é invisível aos olhos." },
      { "ref": "Dalai Lama", "text": "Lembre-se que não conseguir o que você quer é, às vezes, um golpe de sorte maravilhoso." },
      { "ref": "Pink Floyd", "text": "Tudo o que você toca e tudo o que você vê é tudo o que sua vida será." },
      { "ref": "Caetano Veloso", "text": "Gente é pra brilhar, não pra morrer de fome." },
      { "ref": "Maria Bethânia", "text": "O que é de gosto regala a vida." },
      { "ref": "Leonardo da Vinci", "text": "O aprendizado nunca esgota a mente." },
      { "ref": "Charles Darwin", "text": "Não é o mais forte que sobrevive, mas o que melhor se adapta às mudanças." },
      { "ref": "Victor Hugo", "text": "Não há nada como o sonho para criar o futuro." },
      { "ref": "Alvo Dumbledore", "text": "A felicidade pode ser encontrada mesmo nas horas mais difíceis, se alguém se lembrar de acender a luz." },
      { "ref": "Salmo 37:4", "text": "Deleita-te no Senhor, e Ele concederá os desejos do teu coração." },
      { "ref": "Provérbios 16:3", "text": "Consagra ao Senhor tudo o que fazes, e os teus planos serão bem-sucedidos." },
      { "ref": "Salmo 119:105", "text": "A tua palavra é lâmpada para os meus pés e luz para o meu caminho." },
      { "ref": "Romanos 15:13", "text": "Que o Deus da esperança vos encha de toda a alegria e paz ao confessardes a vossa fé." },
      { "ref": "Efésios 3:20", "text": "Deus é capaz de fazer infinitamente mais do que tudo o que pedimos ou pensamos." },
      { "ref": "Colossenses 3:23", "text": "Tudo o que fizerem, façam-no de todo o coração, como para o Senhor." },
      { "ref": "1 Tessalonicenses 5:16-18", "text": "Estejam sempre alegres, orem sem cessar e deem graças em todas as circunstâncias." },
      { "ref": "Tiago 4:8", "text": "Aproximem-se de Deus, e Ele aproximar-se-á de vocês." },
      { "ref": "Hebreus 10:23", "text": "Apeguemo-nos com firmeza à esperança que professamos, pois aquele que prometeu é fiel." },
      { "ref": "1 João 5:14", "text": "Se pedirmos alguma coisa segundo a vontade de Deus, Ele ouve-nos." },
      { "ref": "Salmo 103:2", "text": "Bendiz, ó minha alma, o Senhor, e não te esqueças de nenhum dos seus benefícios." },
      { "ref": "Salmo 37:5", "text": "Entrega o teu caminho ao Senhor; confia nele, e Ele agirá." },
      { "ref": "Provérbios 18:10", "text": "O nome do Senhor é uma torre forte; os justos correm para ela e estão seguros." },
      { "ref": "Mateus 5:16", "text": "Que a vossa luz brilhe diante dos homens, para que vejam as vossas boas obras." },
      { "ref": "2 Coríntios 12:9", "text": "A minha graça é suficiente para ti, pois o meu poder aperfeiçoa-se na fraqueza." },
      { "ref": "Gálatas 6:9", "text": "Não nos cansemos de fazer o bem, pois no tempo próprio colheremos." },
      { "ref": "Salmo 118:24", "text": "Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele." },
      { "ref": "Isaías 26:3", "text": "Tu guardarás em perfeita paz aquele cujo propósito está firme em Ti." },
      { "ref": "Romanos 8:28", "text": "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus." },
      { "ref": "Hebreus 13:8", "text": "Jesus Cristo é o mesmo ontem, hoje e para sempre." },
      { "ref": "Mateus 7:7", "text": "Peçam e ser-vos-á dado; busquem e encontrarão; batam e a porta abrir-se-á." },
      { "ref": "1 Pedro 4:8", "text": "Acima de tudo, amem-se sinceramente, pois o amor perdoa muitos pecados." },
      { "ref": "Salmo 145:18", "text": "O Senhor está perto de todos os que o invocam de verdade." },
      { "ref": "Provérbios 16:9", "text": "O coração do homem planeia o seu caminho, mas o Senhor firma os seus passos." },
      { "ref": "João 15:5", "text": "Eu sou a videira; vocês são os ramos. Sem mim, nada podem fazer." },
      { "ref": "Salmo 138:8", "text": "O Senhor cumprirá o seu propósito para comigo." },
      { "ref": "Filipenses 4:7", "text": "A paz de Deus, que excede todo o entendimento, guardará os vossos corações." },
      { "ref": "Efésios 6:10", "text": "Fortaleçam-se no Senhor e no seu forte poder." },
      { "ref": "1 João 4:19", "text": "Nós amamos porque Ele nos amou primeiro." },
      { "ref": "Salmo 119:11", "text": "Guardei a tua palavra no meu coração para não pecar contra Ti." },
      { "ref": "Mateus 5:8", "text": "Bem-aventurados os limpos de coração, pois eles verão a Deus." },
      { "ref": "1 Coríntios 10:31", "text": "Quer comam, quer bebam ou façam qualquer outra coisa, façam tudo para a glória de Deus." },
      { "ref": "Salmo 126:3", "text": "Grandes coisas fez o Senhor por nós, por isso estamos alegres." },
      { "ref": "Provérbios 17:17", "text": "O amigo ama em todos os momentos; é um irmão na adversidade." },
      { "ref": "Isaías 54:10", "text": "Embora os montes sejam sacudidos, a minha bondade não será tirada de ti." },
      { "ref": "Romanos 12:21", "text": "Não te deixes vencer pelo mal, mas vence o mal com o bem." },
      { "ref": "1 Crônicas 29:12", "text": "Riquezas e honra vêm de Ti; Tu dominas sobre todas as coisas." },
      { "ref": "Salmo 55:22", "text": "Entregue as suas preocupações ao Senhor, e Ele o susterá." },
      { "ref": "Romanos 12:2", "text": "Transformem-se pela renovação da vossa mente, para que experimentem a vontade de Deus." },
      { "ref": "Habacuque 3:19", "text": "O Senhor Deus é a minha força; Ele faz os meus pés como os da corça." },
      { "ref": "Mateus 5:3", "text": "Bem-aventurados os humildes de espírito, porque deles é o Reino dos céus." },
      { "ref": "Mateus 5:4", "text": "Bem-aventurados os que choram, porque serão consolados." },
      { "ref": "Mateus 5:5", "text": "Bem-aventurados os mansos, porque herdarão a terra." },
      { "ref": "Mateus 5:6", "text": "Bem-aventurados os que têm fome e sede de justiça, porque serão fartos." },
      { "ref": "Mateus 5:7", "text": "Bem-aventurados os misericordiosos, porque alcançarão misericórdia." },
      { "ref": "Mateus 5:8", "text": "Bem-aventurados os limpos de coração, porque verão a Deus." },
      { "ref": "Mateus 5:9", "text": "Bem-aventurados os pacificadores, porque serão chamados filhos de Deus." },
      { "ref": "Mateus 5:10", "text": "Bem-aventurados os perseguidos por causa da justiça, porque deles é o Reino dos céus." },
      { "ref": "Augustus Nicodemus", "text": "Confiar na soberania de Deus é o descanso final para a alma cansada." },
      { "ref": "Hernandes Dias Lopes", "text": "A oração não muda a Deus, ela muda a nós mesmos e a nossa percepção da realidade." },
      { "ref": "Charles Spurgeon", "text": "A Bíblia é uma bigorna que já quebrou muitos martelos." },
      { "ref": "C.S. Lewis", "text": "As dificuldades preparam pessoas comuns para destinos extraordinários." },
      { "ref": "Billy Graham", "text": "Deus nunca tira algo de sua vida sem a intenção de substituí-lo por algo melhor." },
      { "ref": "Salmo 46:10", "text": "Aquietai-vos e sabei que eu sou Deus." },
      { "ref": "Romanos 12:12", "text": "Alegrem-se na esperança, sejam pacientes na tribulação e perseverem na oração." },
      { "ref": "Isaías 43:2", "text": "Quando você passar por águas profundas, eu estarei com você." },
      { "ref": "Gálatas 5:22", "text": "O fruto do Espírito é amor, alegria, paz, paciência, amabilidade, bondade e fidelidade." },
      { "ref": "Machado de Assis", "text": "O segredo é não correr atrás das borboletas, é cuidar do jardim para que elas venham até você." },
      { "ref": "Clarice Lispector", "text": "Renda-se, como eu me rendi. Mergulhe no que você não conhece como eu mergulhei." },
      { "ref": "Fernando Pessoa", "text": "Tenho em mim todos os sonhos do mundo." },
      { "ref": "Guimarães Rosa", "text": "Viver é muito perigoso, mas aprender a viver é o que é bonito." },
      { "ref": "Ariano Suassuna", "text": "O otimista é um tolo. O pessimista, um chato. Bom mesmo é ser um realista esperançoso." },
      { "ref": "Fiódor Dostoiévski", "text": "A beleza salvará o mundo." },
      { "ref": "Liev Tolstói", "text": "Se queres ser feliz, sê." },
      { "ref": "Victor Hugo", "text": "Amar outra pessoa é ver a face de Deus." },
      { "ref": "Albert Camus", "text": "No meio do inverno, eu finalmente aprendi que havia dentro de mim um verão invencível." },
      { "ref": "Sêneca", "text": "Nenhum vento sopra a favor de quem não sabe para onde ir." },
      { "ref": "Epicteto", "text": "Não são as coisas que nos perturbam, mas a nossa interpretação sobre elas." },
      { "ref": "Blaise Pascal", "text": "O coração tem razões que a própria razão desconhece." },
      { "ref": "Immanuel Kant", "text": "O céu estrelado sobre mim e a lei moral dentro de mim." },
      { "ref": "Baruch Spinoza", "text": "A felicidade é a passagem de uma perfeição menor para uma maior." },
      { "ref": "Jordan Peterson", "text": "Arrume sua casa antes de criticar o mundo." },
      { "ref": "Byung-Chul Han", "text": "A vida não é apenas um funcionamento, ela é uma celebração." },
      { "ref": "Martin Luther King Jr.", "text": "A escuridão não pode expulsar a escuridão; apenas a luz pode fazer isso." },
      { "ref": "Madre Teresa", "text": "Não usemos bombas nem armas para conquistar o mundo. Usemos o amor e a compaixão." },
      { "ref": "Dalai Lama", "text": "A paz vem de dentro. Não a procure à sua volta." },
      { "ref": "Renato Russo", "text": "Disciplina é liberdade." },
      { "ref": "Raul Seixas", "text": "Basta ser sincero e desejar profundo." },
      { "ref": "Chorão", "text": "A vida me ensinou a nunca desistir, nem ganhar, nem perder mas procurar evoluir." },
      { "ref": "Emicida", "text": "A única coisa que separa você dos seus sonhos é a sua vontade de realizar." },
      { "ref": "Leonardo da Vinci", "text": "A simplicidade é o último grau da sofisticação." },
      { "ref": "Stephen Hawking", "text": "Olhe para as estrelas e não para os seus pés." },
      { "ref": "Carl Sagan", "text": "Somos feitos de poeira de estrelas." },
      { "ref": "1 Coríntios 13:13", "text": "Agora, pois, permanecem a fé, a esperança e o amor; mas o maior destes é o amor." },
      { "ref": "Tiago 1:5", "text": "Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente." },
      { "ref": "Provérbios 4:23", "text": "Acima de tudo o que deve ser guardado, guarda o teu coração." },
      { "ref": "Tim Keller", "text": "O Evangelho diz que somos mais pecadores do que ousamos acreditar, mas mais amados do que jamais ousamos esperar." },
      { "ref": "Corrie ten Boom", "text": "Nunca tenha medo de confiar um futuro desconhecido a um Deus conhecido." },
      { "ref": "Augustus Nicodemus", "text": "Onde a Bíblia fala, Deus fala; onde ela silencia, devemos ter cautela." },
      { "ref": "Paul Washer", "text": "Deus não te ama porque você é bom; Ele te ama porque Ele é bom." },
      { "ref": "Charles Spurgeon", "text": "A esperança é como uma estrela: não se vê no brilho do sol da prosperidade, mas apenas na noite da adversidade." },
      { "ref": "C.S. Lewis", "text": "Acredito no cristianismo como acredito que o sol nasceu: não apenas porque o vejo, mas porque através dele vejo tudo o resto." },
      { "ref": "João Calvino", "text": "O coração humano é uma fábrica perpétua de ídolos." },
      { "ref": "Salmo 139:7", "text": "Para onde me ausentarei do teu Espírito? Para onde fugirei da tua face?" },
      { "ref": "Sofonias 3:17", "text": "O Senhor teu Deus está no meio de ti, poderoso para salvar; Ele se deleitará em ti com alegria." },
      { "ref": "Gálatas 2:20", "text": "Já não sou eu quem vive, mas Cristo vive em mim." },
      { "ref": "Hebreus 11:1", "text": "A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos." },
      { "ref": "Tiago 1:12", "text": "Feliz é aquele que persevera na provação, porque receberá a coroa da vida." },
      { "ref": "Machado de Assis", "text": "Lágrimas não são argumentos." },
      { "ref": "Carlos Drummond de Andrade", "text": "No meio do caminho tinha uma pedra. Tinha uma pedra no meio do caminho." },
      { "ref": "Cecília Meireles", "text": "Liberdade é uma palavra que o sonho humano alimenta, que não há ninguém que explique e ninguém que não entenda." },
      { "ref": "Jorge Amado", "text": "A amizade é o sal da vida." },
      { "ref": "Mário Quintana", "text": "O tempo é um ponto de vista. Velho é quem é um dia mais velho que a gente." },
      { "ref": "Sêneca", "text": "Apressa-te a viver bem e pensa que cada dia é, por si só, uma vida inteira." },
      { "ref": "Marco Aurélio", "text": "A melhor vingança é não ser como o teu inimigo." },
      { "ref": "Aristóteles", "text": "A esperança é o sonho do homem acordado." },
      { "ref": "Friedrich Nietzsche", "text": "O que não me mata, torna-me mais forte." },
      { "ref": "Immanuel Kant", "text": "Age de tal maneira que a máxima da tua vontade possa valer sempre como princípio de uma lei universal." },
      { "ref": "Albert Einstein", "text": "A imaginação é mais importante que o conhecimento." },
      { "ref": "Isaac Newton", "text": "Se vi mais longe, foi por estar sobre ombros de gigantes." },
      { "ref": "Thomas Edison", "text": "O génio é 1% inspiração e 99% transpiração." },
      { "ref": "Blaise Pascal", "text": "A consciência é o melhor livro de moral que temos." },
      { "ref": "Renato Russo", "text": "Quem um dia irá dizer que existe razão nas coisas feitas pelo coração?" },
      { "ref": "Gilberto Gil", "text": "Andar com fé eu vou, que a fé não costuma falhar." },
      { "ref": "Alceu Valença", "text": "Tu vens, tu vens, eu já escuto os teus sinais." },
      { "ref": "Caetano Veloso", "text": "Quando a gente gosta, é claro que a gente cuida." },
      { "ref": "Elis Regina", "text": "Viver é melhor que sonhar." },
      { "ref": "Bon Jovi", "text": "Mapas não te mostram onde você vai, eles apenas mostram onde você esteve." },
      { "ref": "Linkin Park", "text": "Tentei tanto e cheguei tão longe, mas no fim, isso não importa (se não houver propósito)." },
      { "ref": "U2 (Bono)", "text": "Onde quer que você esteja, é lá que você está." },
      { "ref": "Martin Luther", "text": "Mesmo que eu soubesse que o mundo acabaria amanhã, eu ainda plantaria a minha macieira." },
      { "ref": "Augustine of Hippo", "text": "Fizeste-nos para Ti, Senhor, e o nosso coração está inquieto enquanto não descansar em Ti." },
      { "ref": "Francis Chan", "text": "O nosso maior medo não deve ser o de fracassar, mas o de ter sucesso em algo que não importa." },
      { "ref": "John Piper", "text": "Deus é mais glorificado em nós quando estamos mais satisfeitos nEle." },
      { "ref": "Tim Keller", "text": "A religião diz: 'Eu obedeço, logo sou aceito'. O Evangelho diz: 'Eu sou aceito, logo obedeço'." },
      { "ref": "Rick Warren", "text": "Não se trata de você; trata-se do propósito de Deus para a sua vida." },
      { "ref": "Viktor Frankl", "text": "A última das liberdades humanas é escolher a sua própria atitude em qualquer circunstância." },
      { "ref": "Lao Tzu", "text": "O sábio não acumula. Quanto mais ele ajuda os outros, mais ele beneficia a si mesmo." },
      { "ref": "Autor desconhecido", "text": "Produtividade é fazer em duas horas o que levaria o dia todo para ser adiado." },
      { "ref": "Autor desconhecido", "text": "O trabalho dignifica o homem, mas um descanso bem planejado ajuda bastante." },
      { "ref": "Autor desconhecido", "text": "Sou totalmente a favor do esforço… principalmente quando é bem distribuído." },
      { "ref": "Autor desconhecido", "text": "O otimista é um pessimista mal informado." },
      { "ref": "Oscar Wilde", "text": "Posso resistir a tudo, menos à tentação." },
      { "ref": "Groucho Marx", "text": "Trabalhar nunca matou ninguém, mas por que arriscar?" },
      { "ref": "Mark Twain", "text": "Pare de se preocupar com o mundo acabar hoje. Já é amanhã na Austrália." },
      { "ref": "Woody Allen", "text": "Não sou supersticioso, mas sou um pouco precavido." },
      { "ref": "Millôr Fernandes", "text": "Dinheiro não traz felicidade, mas ajuda a sofrer em lugares melhores." },
      { "ref": "George Bernard Shaw", "text": "O álcool é um anestésico que nos permite suportar a cirurgia da vida." },
      { "ref": "Charles Bukowski", "text": "Algumas pessoas nunca enlouquecem. Que vidas horríveis devem ter." },
      { "ref": "Winston Churchill", "text": "A vida é curta demais para ser pequena." },
      { "ref": "Friedrich Nietzsche", "text": "Sem música, a vida seria um erro." },
      { "ref": "Fernando Pessoa", "text": "Tenho em mim todos os sonhos do mundo." },
      { "ref": "Mahatma Gandhi", "text": "A felicidade é quando o que você pensa, diz e faz estão em harmonia." },
      { "ref": "Albert Einstein", "text": "A imaginação é mais importante que o conhecimento." },
      { "ref": "Ernest Hemingway", "text": "O mundo quebra todo mundo, e depois alguns ficam mais fortes nos lugares quebrados." },
      { "ref": "Millôr Fernandes", "text": "Viver é desenhar sem borracha." }, 
      { "ref": "Jô Soares", "text": "Não tenho tempo para mais nada, mas para dormir sempre dou um jeito." },
      { "ref": "Jô Soares", "text": "Inteligência é saber lidar com a própria ignorância." },
      { "ref": "Stanislaw Ponte Preta", "text": "No Brasil, até o passado é imprevisível." },
      { "ref": "Luis Fernando Verissimo", "text": "A vida é dura para quem é mole." },
      { "ref": "Ziraldo", "text": "Ser adulto é viver com sono." },
      { "ref": "Paulo Leminski", "text": "Isso de querer ser exatamente aquilo que a gente é, ainda vai nos levar além." },
      { "ref": "Chico Anysio", "text": "Há tanto tempo que não mudo de opinião que já concordo comigo mesmo." },
      { "ref": "Luis Fernando Verissimo", "text": "A gente se acostuma, mas não devia." },
      { "ref": "Ziraldo", "text": "Problema todo mundo tem. Difícil é administrar." },
      { "ref": "Millôr Fernandes", "text": "Se você não falhar de vez em quando, é porque não está tentando nada novo." },
      { "ref": "Autor Desconhecido", "text": "Não sou preguiçoso, estou em modo economia de energia." },
      { "ref": "Autor desconhecido", "text": "A pressa resolve pouco, mas atrapalha bastante." },
      { "ref": "Autor desconhecido", "text": "Produtividade é fazer rápido o que poderia ser adiado." },
      { "ref": "Autor desconhecido", "text": "A experiência vem com o tempo. Os erros vêm antes." },
      { "ref": "Autor desconhecido", "text": "Nem tudo que dá trabalho vale a pena, mas quase tudo que vale a pena dá trabalho." },
      { "ref": "Friedrich Engels", "text": "Uma grama de ação, vale mais que uma tonelada de teoria." }
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
