# Chat Simples (Fake Local)

Um chat local sem backend feito com **TypeScript**, **HTML** e **CSS**.
Ele simula respostas de um bot, alternando entre **usuário** e **bot**, com indicador de digitação e histórico em `localStorage`.

## ✨ Recursos
- Envio de mensagens (Enter / botão)
- Resposta automática do bot com delay
- Indicador de digitando
- Histórico persistido no `localStorage`
- Bot com regras simples: `oi/olá`, `hora`, `data`, `piada`, `repete/eco`

## ▶️ Como rodar
1. Abra `index.html` no navegador — já incluímos `dist/main.js` para funcionar **sem compilar**.
2. (Opcional) Para desenvolver em TypeScript:
   ```bash
   npm init -y
   npm install typescript --save-dev
   npx tsc --init
   npx tsc --watch
   ```
   O arquivo fonte é `main.ts` e o compilado sai em `dist/main.js`.

## 🗂️ Estrutura
```
chat-simples-fake-local/
 ├─ index.html
 ├─ style.css
 ├─ main.ts
 ├─ tsconfig.json
 └─ dist/
     └─ main.js
```

## 🧠 Dica de estudo
Tente adicionar:
- Avatares personalizados e temas (claro/escuro)
- Exportar / importar histórico em JSON
- Suporte a múltiplas conversas (salvar por salas)
