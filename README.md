# SuperVideo JavaScript SDK

SDK leve e sem dependencias para embutir videoconferencias do SuperVideo em aplicacoes web de terceiros via iframe, permitindo ouvir eventos de ciclo de vida em tempo real.

## Instalacao

### Opcao 1: Via NPM
```bash
npm install @supervideo/js-sdk
```

Depois, importe no seu projeto:
```javascript
import { SuperVideo } from '@supervideo/js-sdk';
```

### Opcao 2: Via CDN (jsDelivr)
Incorpore o script diretamente no cabecalho ou fim do corpo do seu HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/@supervideo/js-sdk/dist/supervideo.min.js"></script>
```

---

## Como Usar

### 1. Criar um Container no HTML
```html
<div id="video-container" style="width: 100%; height: 600px;"></div>
```

### 2. Inicializar o Player
```javascript
const call = SuperVideo.embed({
  container: '#video-container',
  // Passe a URL de embed retornada pela chamada de criacao de salas da API B2B
  embedUrl: 'https://supervideo.com.br/embed/ROOM_ID?token=TOKEN',
  width: '100%',
  height: '100%',
  
  // Callbacks de ciclo de vida
  onReady: () => {
    console.log('Player carregado e pronto para uso.');
  },
  onJoined: (payload) => {
    console.log(`Participante entrou: ${payload.participantName} (Papel: ${payload.role})`);
  },
  onCallEnded: (payload) => {
    console.log('A videochamada foi finalizada pelo operador.');
  },
  onError: (error) => {
    console.error('Erro na transmissao:', error.message);
  }
});
```

### 3. Encerrar ou Destruir o Player
Para fechar a conexao e remover o iframe do DOM de forma limpa:
```javascript
call.destroy();
```

---

## Desenvolvimento e Build

Caso queira contribuir para o desenvolvimento deste SDK:

### Instalar dependencias
```bash
npm install
```

### Compilar o script minificado
```bash
npm run build
```
Os arquivos gerados estarao disponiveis na pasta `dist/`.
