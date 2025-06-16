const journalForm = document.getElementById('journal-form');
const entryTitle = document.getElementById('entry-title');
const entryContent = document.getElementById('entry-content');
const entryList = document.getElementById('entry-list');

let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
let editEntryId = null;

function renderEntries() {
  entryList.innerHTML = '';

  entries.forEach(entry => {
    const entryCard = document.createElement('div');
    entryCard.className = 'entry-card';

    entryCard.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.content}</p>
      <p class="entry-date">${entry.date}</p>
      <button class="edit-btn" data-id="${entry.id}">Edit</button>
      <button class="delete-btn" data-id="${entry.id}">Delete</button>
    `;

    entryList.appendChild(entryCard);
  });

  // Delete buttons
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function () {
      const idToDelete = Number(button.getAttribute('data-id'));
      entries = entries.filter(entry => entry.id !== idToDelete);
      localStorage.setItem('journalEntries', JSON.stringify(entries));
      renderEntries();
    });
  });

  // Edit buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function () {
      const idToEdit = Number(button.getAttribute('data-id'));
      const entry = entries.find(entry => entry.id === idToEdit);

      if (entry) {
        entryTitle.value = entry.title;
        entryContent.value = entry.content;
        editEntryId = entry.id;
      }
    });
  });
}

journalForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = entryTitle.value.trim();
  const content = entryContent.value.trim();

  if (title && content) {
    if (editEntryId !== null) {
      entries = entries.map(entry =>
        entry.id === editEntryId
          ? { ...entry, title, content, date: new Date().toLocaleString() }
          : entry
      );
      editEntryId = null;
    } else {
      const newEntry = {
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleString()
      };
      entries.unshift(newEntry);
    }

    localStorage.setItem('journalEntries', JSON.stringify(entries));
    renderEntries();
    entryTitle.value = '';
    entryContent.value = '';
  }
  
});

renderEntries();

document.addEventListener('DOMContentLoaded', () => {
  entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
  renderEntries();
});
