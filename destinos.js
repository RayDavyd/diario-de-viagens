const TAXAS = {
    USD: 5.00,
    EUR: 5.50,
    BRL: 1.00
};

function carregar() {
    const dados = localStorage.getItem("viagens");
    return dados ? JSON.parse(dados) : [];
}

function mostrarDestinos() {

    const viagens = carregar();

    if (viagens.length === 0) {

        document.getElementById("lista-destinos").innerHTML = `

            <div class="sem-viagens">

                <h2>Nenhuma viagem cadastrada!</h2>

                <p>
                    Você ainda não registrou nenhuma viagem.
                </p>

                <p>
                    Vá para a página <a href="registrar.html" class="btn-submit"> Registrar Viagem </a> e cadastre sua primeira aventura.
                </p>

            </div>

        `;

        return;
    }

    viagens.sort((a, b) => new Date(a.dataViagem) - new Date(b.dataViagem));

    const container = document.getElementById("lista-destinos");

    container.innerHTML = "";

    viagens.forEach(function (viagem) {

        const valorReal = viagem.custo * TAXAS[viagem.moeda];

        const card = document.createElement("div");
        card.className = "card";

        let checklist = "";

        viagem.mala.forEach(function (item) {

            checklist += `
                <div>
                    <label>
                        <input type="checkbox"
                        ${item.checado ? "checked" : ""}>

                        ${item.item}
                    </label>
                </div>
            `;

        });

        card.innerHTML = `

            <h2>${viagem.destino}</h2>

            <div class="informacoes">

                <p><strong>Data:</strong> ${viagem.dataViagem}</p>

                <p><strong>Moeda Original:</strong>
                ${viagem.moeda} ${viagem.custo}</p>

                <p><strong>Valor em Real:</strong>
                R$ ${valorReal.toFixed(2)}</p>

            </div>

            <div class="checklist">

                <h3>Checklist da Mala</h3>

                ${checklist}

            </div>

            <button class="btn-excluir"
            onclick="removerViagem(${viagem.id})">

                Excluir Viagem

            </button>

        `;

        container.appendChild(card);

    });

}


function removerViagem(id) {

    if (confirm("Deseja excluir esta viagem?")) {

        const viagens = carregar();

        const novaLista = viagens.filter(function (viagem) {

            return viagem.id !== id;

        });

        localStorage.setItem("viagens", JSON.stringify(novaLista));

        mostrarDestinos();

    }

}

mostrarDestinos();