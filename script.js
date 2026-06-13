const cards = document.querySelectorAll(".card");

cards.forEach(function(card, indice) {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(function() {
        card.style.opacity = "1";
        card.style.transition = "0.8s";
        card.style.transform = "translateY(0)";
    }, indice * 300);

});