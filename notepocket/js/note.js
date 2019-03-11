class Note {
    constructor() {
        this.notesList = document.getElementsByClassName('notes')[0];
    }

    renderNote = (data) => {
        if (!data.hasOwnProperty('content') || !data.hasOwnProperty('id') || (data.hasOwnProperty('deleted') && data.deleted)) {
            return false;
        }

        const noteHTML = document.createElement('div');

        const deleteHTML = document.createElement('div');
        deleteHTML.classList.add('delete-note');
        deleteHTML.innerText = '🗑️';
        deleteHTML.addEventListener('click', () => {
            noteHTML.remove();
            const notes = JSON.parse(localStorage.getItem('notes'));
            notes[data.id].deleted = true;
            localStorage.setItem('notes', JSON.stringify(notes));
        });

        noteHTML.classList.add('single-note');
        if (data.hasOwnProperty('category')) {
            noteHTML.classList.add('single-note' + data.category);
        }
        noteHTML.setAttribute('id', data.id);
        noteHTML.innerText = data.content;
        noteHTML.appendChild(deleteHTML);
        this.notesList.appendChild(noteHTML);
    };

    clearNotes = () => {
        this.notesList.innerHTML = '';
    }
}