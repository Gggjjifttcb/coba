var jmlhangkot = 20;
angkotberoperasi = 1;
for(var noangkot = 1; noangkot <= jmlhangkot; noangkot++){
    if( noangkot <= 6 || noangkot === 8 || noangkot === 10 ){
        console.log('Angkot No. ' + noangkot + ' beroperasi dengan baik.');
    } else if( noangkot === 7 || noangkot === 9 ){
        console.log('Angkot No. ' + noangkot + ' sedang lembur.');
    } else {
        console.log('Angkot No. ' + noangkot + ' sedang tidak beroperasi.');
    }
}

switch(noangkot){
    case 1:
        console.log('Angkot No. ' + noangkot + ' beroperasi dengan baik.');
        break;
    case 2:
        console.log('Angkot No. ' + noangkot + ' beroperasi dengan baik.'); 
        break;
    case 3:
        console.log('Angkot No. ' + noangkot + ' beroperasi dengan baik.');
        break;
    case 4:
        console.log('Angkot No. ' + noangkot + ' beroperasi dengan baik.');
        break;
    case 5:
        console.log('Angkot No. ' + noangkot + ' beroperasi dengan baik.');
        break;
    default:
        console.log('Angkot No. ' + noangkot + ' sedang tidak beroperasi.');
}