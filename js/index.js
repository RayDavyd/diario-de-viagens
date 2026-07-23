// Exibe a próxima viagem cadastrada no localStorage
const TAXAS = { USD: 5.00, EUR: 5.50, BRL: 1.00 };

document.addEventListener("DOMContentLoaded", function () {
  const dados = localStorage.getItem("viagens");
  if (!dados) return;

  const viagens = JSON.parse(dados);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Filtra só viagens futuras e ordena pela mais próxima
  const futuras = viagens
    .filter(v => new Date(v.dataViagem + "T00:00:00") >= hoje)
    .sort((a, b) => new Date(a.dataViagem) - new Date(b.dataViagem));

  const container = document.getElementById("proxima-viagem-container");

  if (futuras.length === 0) {
    container.innerHTML =
      "<p class='sem-viagem'>Nenhuma viagem futura cadastrada. " +
      "<a href='paginaRegistrar.html'>Registre agora!</a></p>";
    return;
  }

  const proxima = futuras[0];

  // Calcula dias restantes
  const dataViagem = new Date(proxima.dataViagem + "T00:00:00");
  const diff = Math.ceil((dataViagem - hoje) / (1000 * 60 * 60 * 24));
  const diasTexto = diff === 0 ? "Hoje!" : diff === 1 ? "Amanhã!" : `em ${diff} dias`;

  // Converte custo para BRL
  const valorBRL = proxima.custo > 0 && TAXAS[proxima.moeda]
    ? (proxima.custo * TAXAS[proxima.moeda]).toFixed(2)
    : null;

  const custoTexto = valorBRL
    ? `${proxima.custo} ${proxima.moeda} = R$ ${valorBRL}`
    : "Não informado";

  // Formata data BR
  const partes = proxima.dataViagem.split("-");
  const dataBR = `${partes[2]}/${partes[1]}/${partes[0]}`;

  // Progresso da mala
  const total = proxima.mala ? proxima.mala.length : 0;
  const prontos = proxima.mala ? proxima.mala.filter(i => i.checado).length : 0;

  container.innerHTML =
    "<div class='proxima-card'>" +
      "<div class='destino-nome'><i class='fa-solid fa-plane'></i> " + proxima.destino + "</div>" +
      "<div class='proxima-info'>" +
        "<div><i class='fa-regular fa-calendar'></i> " + dataBR + "</div>" +
        "<div><i class='fa-solid fa-wallet'></i> " + custoTexto + "</div>" +
        "<div><i class='fa-solid fa-suitcase'></i> Mala: " + prontos + " / " + total + " itens prontos</div>" +
      "</div>" +
      "<span class='dias-restantes'><i class='fa-solid fa-clock'></i> " + diasTexto + "</span><br>" +
      "<a href='pages/destinos.html' class='btn-ver'>" +
        "<i class='fa-solid fa-arrow-right'></i> Ver todas as viagens" +
      "</a>" +
    "</div>";
});