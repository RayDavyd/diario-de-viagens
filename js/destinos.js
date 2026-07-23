const TAXAS = {
    USD: 5.00,
    EUR: 5.50,
    BRL: 1.00
};

function carregar() {
    const dados = localStorage.getItem("viagens");
    return dados ? JSON.parse(dados) : [];
}

function salvar(lista) {
    localStorage.setItem("viagens", JSON.stringify(lista));
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
                    Vá para a página <a href="paginaRegistrar.html" class="btn-submit"> Registrar Viagem </a> e cadastre sua primeira aventura.
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

                <h3>Checklist da Mala (<span class="progresso-mala" id="progresso-${viagem.id}"></span>)</h3>

                <div id="mala-${viagem.id}"></div>

            </div>

            <button class="btn-excluir"
            onclick="removerViagem(${viagem.id})">

                Excluir Viagem

            </button>

        `;

        container.appendChild(card);

        renderizarMala(viagem.id, viagem.mala);

    });

}

// Renderiza os checkboxes da mala e liga o evento "change" que salva no localStorage
function renderizarMala(viagemId, mala) {

    const box = document.getElementById("mala-" + viagemId);
    if (!box) return;

    box.innerHTML = "";

    mala.forEach(function (item, idx) {

        const linha = document.createElement("div");
        linha.className = "item-mala";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.checado;
        checkbox.id = `chk-${viagemId}-${idx}`;

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.className = "item-mala-label" + (item.checado ? " item-riscado" : "");
        label.textContent = item.item;

        // Evento change: marca/desmarca, risca o texto via classList e salva
        checkbox.addEventListener("change", function () {
            atualizarItemMala(viagemId, idx, checkbox.checked, label);
        });

        linha.appendChild(checkbox);
        linha.appendChild(label);
        box.appendChild(linha);
    });

    atualizarProgresso(viagemId, mala);
}

// Atualiza o estado do item marcado, salva no localStorage e atualiza a interface
function atualizarItemMala(viagemId, itemIdx, marcado, labelEl) {

    const lista = carregar();
    const viagem = lista.find(v => v.id === viagemId);
    if (!viagem) return;

    viagem.mala[itemIdx].checado = marcado;
    salvar(lista);

    // Risca/desrisca o texto via classe CSS (não estilo inline)
    labelEl.classList.toggle("item-riscado", marcado);

    atualizarProgresso(viagemId, viagem.mala);
}

// Atualiza o contador "X / Y itens prontos" de uma viagem
function atualizarProgresso(viagemId, mala) {
    const total = mala.length;
    const prontos = mala.filter(i => i.checado).length;
    const span = document.getElementById("progresso-" + viagemId);
    if (span) span.textContent = `${prontos} / ${total} prontos`;
}

function removerViagem(id) {

    if (confirm("Deseja excluir esta viagem?")) {

        const viagens = carregar();

        const novaLista = viagens.filter(function (viagem) {

            return viagem.id !== id;

        });

        salvar(novaLista);

        mostrarDestinos();

    }

}

mostrarDestinos();