<h1 align="center">Chat simples com Node+TS</h1>

## Principais Tecnologias Usadas 📓
<ul>
    <li>Node</li>
    <li>TypeScript</li>
    <li>Express</li>
    <li>Socket.io</li>    
</ul>

## Projeto 💻
Este projeto foi feito para fins de estudos e tem como objetivo simular um chat onde foi usado a biblioteca socket.io, ela permite a conexão entre servidor/client em tempo real. O front-end foi feito com HTML e CSS, e é totalmente responsivo, ou seja, se adapta para qualquer dispositivo que acessar.

## Para rodar o projeto ⏯
### Pré-requisitos globais:
```npm i -g typescript ts-node```

### Instalação de dependências:
```npm install```

### Configuração do arquivo .env (exemplo):
```
//porta onde o projeto irá rodar
PORT=5000

//url base
BASE=http://localhost:5000
```

### Para rodar o projeto:
```npm start```

## Erros ❌😵
Durante testes foram observados alguns erros:
<ul>
  <li>quando entram com nomes iguais gera erros no chat</li>
  <li>dispositivos iOS não conseguem sair da tela de identificação para acessar o chat pois é necessário apertar na tecla ENTER após digitar o nome</li>
</ul>

## Heroku
A aplicação já se encontra em nuvem e em funcionameto no Heroku para uso e testes, <a href="https://fierce-caverns-94737.herokuapp.com/">clique aqui</a> para acessar.
