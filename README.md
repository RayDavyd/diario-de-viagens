# Travel Diary

O Travel Diary é uma aplicação web desenvolvida para auxiliar viajantes no planejamento, organização e registro de suas viagens. A plataforma permite cadastrar novos destinos, gerenciar o checklist da mala, acompanhar custos em diferentes moedas e visualizar viagens agendadas em um calendário interativo.

---

## Acesso e Demonstração

Acesse a versão publicada da aplicação através do link:
* **GitHub Pages:** https://raydavyd.github.io/diario-de-viagens/

---

## Funcionalidades Principais

* **Página Inicial (Home):** Exibe um resumo da próxima viagem agendada, métricas gerais do sistema e informações sobre o funcionamento da plataforma.
* **Registro de Viagens:** Formulário para inclusão de novos destinos, datas, estimativa de custos e montagem de checklist da mala.
* **Gestão de Destinos:** Lista todas as viagens cadastradas ordenadas por data, exibindo o custo convertido para Real (BRL), progresso do checklist e opção de exclusão.
* **Calendário Interativo:** Visualização em grade dos dias do mês com destaque para datas com viagens futuras, passadas e o dia atual, acompanhado de um painel de detalhes do dia selecionado.
* **Conversão de Câmbio:** Suporte a diferentes moedas (USD, EUR, BRL) com cálculo automático para a moeda local.
* **Navegação Dinâmica:** Menu de navegação com indicação visual da página ativa e links ajustados para rotas relativas.

---

## Estrutura do Projeto

O projeto está organizado com a seguinte estrutura de arquivos:

```text
diario-de-viagens/
├── index.html
├── assets/
│   └── aviao-aereo.png
├── css/
│   └── style.css
├── js/
│   ├── dados.js
│   ├── destinos.js
│   ├── index.js
│   ├── script.js
│   └── calendario.js
└── pages/
    ├── calendario.html
    ├── destinos.html
    └── paginaRegistrar.html
