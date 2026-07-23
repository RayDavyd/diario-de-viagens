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

// Semeia o localStorage apenas se ainda não existir nada salvo
(function inicializarDados() {
  if (!localStorage.getItem("viagens")) {
    localStorage.setItem("viagens", JSON.stringify(dadosIniciais));
  }
})();
