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