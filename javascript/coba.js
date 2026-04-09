var item = prompt("Masukkan nama item:\nContoh: daging, sayur, buah atau lainnya");

switch (item) {
    case "daging":
        alert("Harga daging adalah Rp 120.000 per kg");
        break;
    case "sayur":
        alert("Harga sayur adalah Rp 30.000 per kg");
        break;
    case "buah":
        alert("Harga buah adalah Rp 50.000 per kg");
        break;
    default:
        alert("Harga item tidak tersedia");
        break;
}