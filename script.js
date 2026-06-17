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