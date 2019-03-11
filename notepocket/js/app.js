const note = new Note();
const notesStorage = (localStorage.getItem('notes') === null) ? [] : JSON.parse(localStorage.getItem('notes'));

const addNewNoteButton = document.getElementsByClassName('add-button')[0];
const newNoteTextContainer = document.getElementsByClassName('new-note')[0];
const textareaNote = document.getElementsByClassName('note-area')[0];


window.onload = () => {
    notesStorage.map((noteData, id) => {
        note.renderNote({content: noteData.content, id, deleted: noteData.deleted});
    })
};

addNewNoteButton.addEventListener('click', () => {
    if (newNoteTextContainer.classList.contains('new-note--active') && textareaNote.value.length > 0) {
        notesStorage.push({content: textareaNote.value});
        localStorage.setItem('notes', JSON.stringify(notesStorage));
        note.renderNote({content: textareaNote.value, id: notesStorage.length - 1});
        alert('Dodano nową notkę. Wiem, że alerty są passe, ale brak czasu.');
        newNoteTextContainer.classList.remove('new-note--active');
        textareaNote.value = '';
        textareaNote.blur();
    } else {
        newNoteTextContainer.classList.toggle('new-note--active');
    }
});

const listHTML = document.getElementsByClassName('js--categories')[0];

listHTML.addEventListener('click', (e) => {
    const clickedEl = e.target;
    if (e.target.classList.contains('category')) {
        if (clickedEl.classList.contains('category--active')) {
            return false;
        }

        listHTML.getElementsByClassName("category--active")[0].classList.remove('category--active');
        clickedEl.classList.add('category--active');

        const type = clickedEl.getAttribute('data-category');
        const elements = JSON.parse(localStorage.getItem('notes'));
        switch (type) {
            case 'all':
                note.clearNotes();
                elements.map((noteData, id) => {
                    note.renderNote({content: noteData.content, id, deleted: noteData.deleted});
                });
                break;
            case 'deleted':
                note.clearNotes();
                elements.map((noteData, id) => {
                    if (noteData.hasOwnProperty('deleted') && noteData.deleted) {
                        note.renderNote({content: noteData.content, id});
                    }
                });
                break;
        }

    }
});