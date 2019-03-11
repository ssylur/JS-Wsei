class Soundkit {
    constructor() {
        window.addEventListener('keydown', this.playBit);
        window.addEventListener('keyup', this.removeActiveClass);
    }

    playBit = (e) => {
        const key = document.querySelector(`.sound-button[data-key="${e.keyCode}"]`);
        if (!key) {
            return;
        }

        key.classList.add('active');
        const bit = this.getMappedKeySound(e.keyCode);
        if (!bit) return;
        bit.currentTime = 0;
        bit.play();
    };

    removeActiveClass = (e) => {
        const key = document.querySelector(`.sound-button[data-key="${e.keyCode}"]`);
        if (!key) {
            return;
        }

        key.classList.remove('active');
    };

    getMappedKeySound = (key) => {
        let type = false;
        switch (key) {
            case 65:
                type = 'kick';
                break;
            case 81:
                type = 'snare';
                break;
            case 87:
                type = 'hihat';
                break;
            case 69:
                type = 'openhat';
                break;
            case 83:
                type = 'clap';
                break;
            case 68:
                type = 'boom';
                break;
            case 90:
                type = 'ride';
                break;
            case 88:
                type = 'tink';
                break;
            case 67:
                type = 'tom';
                break;
        }

        if (!type) return false;

        const audioHTML = document.querySelector(`audio.` + type);
        return (audioHTML) ? audioHTML : false;
    }
}