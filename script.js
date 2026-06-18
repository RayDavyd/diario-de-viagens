const TAXAS = { USD: 5.00, EUR: 5.50, BRL: 1.00 };

const dadosIniciais = [
  {
    id: 1,
    destino: "Paris",
    dataViagem: "2025-10-15",
    moeda: "EUR",
    custo: 1200,
    mala: [
      { item: "Passaporte", checado: true },
      { item: "Casaco", checado: false }
    ]
  },
  {
    id: 2,
    destino: "Santiago",
    dataViagem: "2025-07-20",
    moeda: "USD",
    custo: 800,
    mala: [
      { item: "RG", checado: false },
      { item: "Bota de neve", checado: false }
    ]
  }
];

let malaTemp = [];

function carregar() {
  const dados = localStorage.getItem("viagens");
  return dados ? JSON.parse(dados) : dadosIniciais;
}

function salvar(lista) {
  localStorage.setItem("viagens", JSON.stringify(lista));
}

document.getElementById("btnAdicionarItem").addEventListener("click", adicionarItemForm);

function adicionarItemForm() {
  const input = document.getElementById("inputItemMala");
  const texto = input.value.trim();
  if (texto === "") return;
  malaTemp.push({ item: texto, checado: false });
  input.value = "";
  mostrarPreviewMala();
}

function mostrarPreviewMala() {
  const box = document.getElementById("listaMalaTemporaria");
  box.innerHTML = "";
  malaTemp.forEach(function(item, i) {
    box.innerHTML += "<li style='color:#cce0ec; margin-bottom:4px;'>" + item.item +
      " <b style='cursor:pointer; color:#e05252; font-size:1.1rem;' onclick='removerTemp(" + i + ")'>×</b></li>";
  });
}

function removerTemp(i) {
  malaTemp.splice(i, 1);
  mostrarPreviewMala();
}

document.getElementById("formNovaViagem").addEventListener("submit", function(e) {
  e.preventDefault();

  const destino = document.getElementById("inputDestino").value.trim();
  const data    = document.getElementById("inputData").value;
  const moeda   = document.getElementById("selectMoeda").value;
  const custo   = parseFloat(document.getElementById("inputCusto").value) || 0;

  if (destino.length < 2) { alert("Coloque um destino válido."); return; }
  if (data === "")        { alert("Coloque a data da viagem.");   return; }

  const lista = carregar();
  lista.push({ id: Date.now(), destino, dataViagem: data, moeda, custo, mala: malaTemp });
  salvar(lista);

  e.target.reset();
  malaTemp = [];
  mostrarPreviewMala();
  alert("Viagem salva com sucesso!");
  mostrarViagens();
});

function mostrarViagens() {
  const lista = carregar();

  lista.sort((a, b) => new Date(a.dataViagem) - new Date(b.dataViagem));

  const listaConvertida = lista.map(function(v) {
    let valorBRL = v.custo > 0 && TAXAS[v.moeda] ? v.custo * TAXAS[v.moeda] : 0;
    const textoCusto = v.custo > 0
      ? v.custo + " " + v.moeda + " = R$ " + valorBRL.toFixed(2)
      : "Custo não informado";
    return { ...v, textoCusto };
  });

  const container = document.getElementById("lista-viagens");
  container.innerHTML = "";

  listaConvertida.forEach(function(viagem) {
    const card = document.createElement("div");
    card.id = "card-" + viagem.id;
    card.className = "trip-card";

    card.innerHTML =
      "<h2>" + viagem.destino + "</h2>" +
      "<div class='currency-box' style='margin-bottom:15px;'>" +
        "<p><b>Data:</b> " + viagem.dataViagem + "</p>" +
        "<p><b>Custo Estimado:</b><br>" + viagem.textoCusto + "</p>" +
      "</div>" +
      "<div class='input-group'>" +
        "<label style='color:#A8D8EA'>Checklist de Mala (<span id='progresso-" + viagem.id + "'></span>)</label>" +
        "<div id='mala-" + viagem.id + "' style='background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-bottom:10px;'></div>" +
      "</div>" +
      "<div class='input-group'>" +
        "<div class='item-box'>" +
          "<input id='novo-item-" + viagem.id + "' type='text' placeholder='Novo item na mala'>" +
          "<button type='button' onclick='addItemMala(" + viagem.id + ")'>+</button>" +
        "</div>" +
      "</div>" +
      "<button class='btn-excluir' onclick='removerViagem(" + viagem.id + ")'>Excluir Viagem</button>";

    container.appendChild(card);
    mostrarMala(viagem.id, viagem.mala);
  });
}

function mostrarMala(id, mala) {
  const box = document.getElementById("mala-" + id);
  if (!box) return;
  box.innerHTML = "";

  mala.forEach(function(item, idx) {
    const el = document.createElement("div");
    el.style.cssText = "display:flex; align-items:center; gap:8px; margin-bottom:5px;";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = item.checado;
    cb.style.cursor = "pointer";

    const lbl = document.createElement("span");
    lbl.textContent = item.item;
    lbl.style.color = item.checado ? "#888" : "#ddd";
    lbl.style.textDecoration = item.checado ? "line-through" : "none";

    cb.addEventListener("change", () => marcarItem(id, idx));

    el.appendChild(cb);
    el.appendChild(lbl);
    box.appendChild(el);
  });

  const total    = mala.length;
  const marcados = mala.filter(i => i.checado).length;
  document.getElementById("progresso-" + id).textContent = marcados + " / " + total;
}

function marcarItem(idViagem, idx) {
  const lista  = carregar();
  const viagem = lista.find(v => v.id === idViagem);
  viagem.mala[idx].checado = !viagem.mala[idx].checado;
  salvar(lista);
  mostrarMala(idViagem, viagem.mala);
}

function addItemMala(id) {
  const input = document.getElementById("novo-item-" + id);
  const texto = input.value.trim();
  if (texto === "") return;
  const lista  = carregar();
  const viagem = lista.find(v => v.id === id);
  viagem.mala.push({ item: texto, checado: false });
  salvar(lista);
  input.value = "";
  mostrarMala(id, viagem.mala);
}