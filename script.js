document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.style.opacity = 0;
        setTimeout(() => {
            card.style.transition = "0.6s";
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }, i * 200);
    });
});
