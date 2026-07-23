(function () {

  console.log("[script.js] carregado com sucesso.");

  const TAXAS = { USD: 5.00, EUR: 5.50, BRL: 1.00 };

  // LISTA TEMPORÁRIA DA MALA DO FORMULÁRIO
  let malaTemp = [];

  // LOCALSTORAGE — carregar e salvar
  function carregar() {
    const dados = localStorage.getItem("viagens");
    return dados ? JSON.parse(dados) : [];
  }

  function salvar(lista) {
    localStorage.setItem("viagens", JSON.stringify(lista));
  }

  // Referências dos elementos (com verificação de existência)
  const btnAdicionarItem   = document.getElementById("btnAdicionarItem");
  const inputItemMala      = document.getElementById("inputItemMala");
  const listaMalaTemp      = document.getElementById("listaMalaTemporaria");
  const form               = document.getElementById("formNovaViagem");
  const feedbackBox        = document.getElementById("form-feedback");

  if (!form) {
    console.error("[script.js] ERRO: elemento #formNovaViagem não encontrado no HTML.");
    return;
  }

  // MALA TEMPORÁRIA DO FORMULÁRIO
  if (btnAdicionarItem) {
    btnAdicionarItem.addEventListener("click", adicionarItemForm);
  } else {
    console.error("[script.js] ERRO: elemento #btnAdicionarItem não encontrado no HTML.");
  }

  function adicionarItemForm() {
    const texto = inputItemMala.value.trim();
    if (texto === "") return;

    malaTemp.push({ item: texto, checado: false });
    inputItemMala.value = "";
    mostrarPreviewMala();
  }

  function mostrarPreviewMala() {
    if (!listaMalaTemp) return;
    listaMalaTemp.innerHTML = "";

    malaTemp.forEach(function (item, i) {
      listaMalaTemp.innerHTML +=
        "<li style='color:#cce0ec; margin-bottom:4px;'>" + item.item +
        " <b style='cursor:pointer; color:#e05252; font-size:1.1rem;' onclick='removerTemp(" + i + ")'>×</b></li>";
    });
  }

  // Precisa ficar acessível globalmente pois é chamada via onclick inline no HTML gerado
  window.removerTemp = function (i) {
    malaTemp.splice(i, 1);
    mostrarPreviewMala();
  };

  // FEEDBACK NA INTERFACE (em vez de alert)
  let timerFeedback = null;
  function mostrarFeedback(mensagem, tipo) {
    if (!feedbackBox) {
      console.error("[script.js] ERRO: elemento #form-feedback não encontrado no HTML.");
      return;
    }

    feedbackBox.textContent = mensagem;
    feedbackBox.className = "form-feedback " + tipo;
    feedbackBox.style.display = "block";

    if (tipo === "sucesso") {
      clearTimeout(timerFeedback);
      timerFeedback = setTimeout(() => {
        feedbackBox.style.display = "none";
      }, 4000);
    }
  }

  // SUBMIT DO FORMULÁRIO — registrar viagem
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("[script.js] submit do formulário capturado.");

    const destino = document.getElementById("inputDestino").value.trim();
    const data    = document.getElementById("inputData").value;
    const moeda   = document.getElementById("selectMoeda").value;
    const custo   = parseFloat(document.getElementById("inputCusto").value) || 0;

    if (destino.length < 2)    { mostrarFeedback("Coloque um destino válido (mínimo 2 caracteres).", "erro"); return; }
    if (data === "")           { mostrarFeedback("Coloque a data da viagem.", "erro"); return; }
    if (moeda === "Selecione") { mostrarFeedback("Selecione a moeda.", "erro"); return; }

    const lista = carregar();
    lista.push({
      id: Date.now(),
      destino,
      dataViagem: data,
      moeda,
      custo,
      mala: [...malaTemp]
    });
    salvar(lista);

    form.reset();
    malaTemp = [];
    mostrarPreviewMala();
    mostrarFeedback(`Viagem para ${destino} registrada com sucesso! ✈️`, "sucesso");
  });

})();