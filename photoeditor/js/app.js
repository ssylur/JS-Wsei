const sendButton = document.getElementsByClassName('add-image')[0];
sendButton.addEventListener('click', addImage);

function editImage() {
    let gs = document.getElementById('gs').value; // grayscale
    let blur = document.getElementById('blur').value;
    let br = document.getElementById('br').value; // brightness
    let ct = document.getElementById('ct').value; // contrast
    let huer = document.getElementById('huer').value; //hue-rotate
    let opacity = document.getElementById('opacity').value; //opacity
    let invert = document.getElementById('invert').value; //invert
    let saturate = document.getElementById('saturate').value; //saturate
    let sepia = document.getElementById('sepia').value; //sepia

    const image = document.querySelector('.image-container img');
    image.style.filter = 'grayscale(' + gs +
        '%) blur(' + blur +
        'px) brightness(' + br +
        '%) contrast(' + ct +
        '%) hue-rotate(' + huer +
        'deg) opacity(' + opacity +
        '%) invert(' + invert +
        '%) saturate(' + saturate +
        '%) sepia(' + sepia + '%)';
}

const inputs = document.querySelectorAll("input[type=range]");
inputs.forEach((item) => {
    item.addEventListener('change', editImage);
});

document.getElementById('imageSlidersForm').addEventListener('reset', () => {
    setTimeout(() => {
        editImage();
    }, 0);
});

function addImage(e) {
    console.warn('image changed.');
    let imgUrl = document.getElementsByClassName("url-box")[0].value;
    if (imgUrl.length) {
        document.querySelector(".image-container img").setAttribute("src", imgUrl);
    }
    e.preventDefault();
}