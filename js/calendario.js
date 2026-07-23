// TAXAS DE CÂMBIO FIXAS
const TAXAS = { USD: 5.00, EUR: 5.50, BRL: 1.00 };

const mesesNomes = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Estado global do mês visualizado
let dataAtual = new Date();
let anoVisivel = dataAtual.getFullYear();
let mesVisivel = dataAtual.getMonth();

// Carrega os dados salvos pelo formulário principal
function carregarViagens() {
    const dados = localStorage.getItem("viagens");
    return dados ? JSON.parse(dados) : [];
}

// Configuração dos botões de controle das setas
document.getElementById("btn-prev").addEventListener("click", () => {
    mesVisivel--;
    if (mesVisivel < 0) {
        mesVisivel = 11;
        anoVisivel--;
    }
    sincronizarFiltrosSeletores();
    renderizarCalendario();
});

document.getElementById("btn-next").addEventListener("click", () => {
    mesVisivel++;
    if (mesVisivel > 11) {
        mesVisivel = 0;
        anoVisivel++;
    }
    sincronizarFiltrosSeletores();
    renderizarCalendario();
});

// Inicializa e popula os filtros de Dropdown (Mês e Ano)
function inicializarFiltros() {
    const selectMes = document.getElementById("select-mes");
    const selectAno = document.getElementById("select-ano");

    // Popula meses
    mesesNomes.forEach((mes, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = mes;
        selectMes.appendChild(option);
    });

    // Popula anos dinamicamente (Ex: Ano atual - 5 até Ano atual + 10 anos)
    const anoAtualCalculado = new Date().getFullYear();
    for (let i = anoAtualCalculado - 5; i <= anoAtualCalculado + 10; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectAno.appendChild(option);
    }

    // Escutadores de mudanças nos Dropdowns
    selectMes.addEventListener("change", (e) => {
        mesVisivel = parseInt(e.target.value);
        renderizarCalendario();
    });

    selectAno.addEventListener("change", (e) => {
        anoVisivel = parseInt(e.target.value);
        renderizarCalendario();
    });

    sincronizarFiltrosSeletores();
}

// Sincroniza a posição dos selects se o usuário usar as setas laterais de navegação
function sincronizarFiltrosSeletores() {
    document.getElementById("select-mes").value = mesVisivel;
    document.getElementById("select-ano").value = anoVisivel;
}

// Renderização Principal do Calendário
function renderizarCalendario() {
    const viagens = carregarViagens();
    const gridDias = document.getElementById("calendar-days");
    const tituloMesAno = document.getElementById("calendar-month-year");
    
    gridDias.innerHTML = "";
    
    // Atualiza título legível antigo por segurança
    if (tituloMesAno) {
        tituloMesAno.textContent = `${mesesNomes[mesVisivel]} ${anoVisivel}`;
    }
    
    const primeiroDiaSemana = new Date(anoVisivel, mesVisivel, 1).getDay();
    const totalDiasMes = new Date(anoVisivel, mesVisivel + 1, 0).getDate();
    
    // Criar espaços vazios para alinhar o primeiro dia
    for (let i = 0; i < primeiroDiaSemana; i++) {
        const divVazia = document.createElement("div");
        divVazia.className = "calendar-day empty";
        gridDias.appendChild(divVazia);
    }
    
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    
    // Renderiza cada dia ativo do mês
    for (let dia = 1; dia <= totalDiasMes; dia++) {
        const celulaDia = document.createElement("div");
        celulaDia.className = "calendar-day";
        celulaDia.textContent = dia;
        celulaDia.style.cursor = "default"; // Altera cursor se houver evento
        
        const mesFormatado = String(mesVisivel + 1).padStart(2, '0');
        const diaFormatado = String(dia).padStart(2, '0');
        const dataStringCelula = `${anoVisivel}-${mesFormatado}-${diaFormatado}`;
        
        // Verifica se esta célula é o dia de hoje
        const dataCelulaObjeto = new Date(anoVisivel, mesVisivel, dia);
        dataCelulaObjeto.setHours(0, 0, 0, 0);
        const ehHoje = dataCelulaObjeto.getTime() === hoje.getTime();

        // Filtra todas as viagens deste dia específico
        const viagemDoDia = viagens.find(v => v.dataViagem === dataStringCelula);
        
        if (viagemDoDia) {
            const dataViagemObjeto = new Date(viagemDoDia.dataViagem + "T00:00:00");
            
            if (dataViagemObjeto >= hoje) {
                celulaDia.classList.add("trip-future");
            } else {
                celulaDia.classList.add("trip-past");
            }
            
            celulaDia.title = `Destino: ${viagemDoDia.destino}`;
            celulaDia.style.cursor = "pointer";
            
            // Adicionado evento direto via escutador encapsulado
            celulaDia.addEventListener("click", function() {
                exibirDetalhesViagem(viagemDoDia);
            });
        }

        // Marca o dia de hoje por cima (mesmo que também tenha viagem)
        if (ehHoje) {
            celulaDia.classList.add("today");
            celulaDia.title = viagemDoDia
                ? `Hoje — Destino: ${viagemDoDia.destino}`
                : "Hoje";
        }
        
        gridDias.appendChild(celulaDia);
    }
}

// Alimenta o painel lateral com as informações detalhadas da viagem clicada
function exibirDetalhesViagem(viagem) {
    const defaultMsg = document.getElementById("summary-default-message");
    const contentBox = document.getElementById("summary-content");
    
    // Altera propriedades inline explicitamente removendo bloqueios do CSS externo
    defaultMsg.style.display = "none";
    contentBox.style.display = "block";
    
    // Formatação de exibição da data brasileira (DD/MM/AAAA)
    const partesData = viagem.dataViagem.split("-");
    const dataFormatadaBR = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
    
    // Cálculo do custo convertido para BRL
    let valorBRL = 0;
    if (viagem.custo > 0 && TAXAS[viagem.moeda]) {
        valorBRL = viagem.custo * TAXAS[viagem.moeda];
    }
    
    // Cálculo dos itens marcados na mala
    const totalItens = viagem.mala ? viagem.mala.length : 0;
    const itensProntos = viagem.mala ? viagem.mala.filter(item => item.checado).length : 0;
    
    // Atualiza os elementos de texto na tela
    document.getElementById("summary-destino").textContent = viagem.destino;
    document.getElementById("summary-data").textContent = dataFormatadaBR;
    document.getElementById("summary-custo").textContent = valorBRL > 0 
        ? `R$ ${valorBRL.toFixed(2)} (${viagem.custo} ${viagem.moeda})` 
        : "Não informado";
    document.getElementById("summary-progresso").textContent = `${itensProntos} de ${totalItens} itens prontos`;
}

// DISPARO NO CARREGAMENTO COMPLETO DO DOM
document.addEventListener("DOMContentLoaded", () => {
    inicializarFiltros();
    renderizarCalendario();
});