window.addEventListener('DOMContentLoaded', () => {
    let myLibrary = [];
    const libraryFromStorage = window.localStorage.getItem('library');
    
    if (libraryFromStorage) {
        myLibrary = JSON.parse(libraryFromStorage) || []
        addBooksToView()
    }
    
    
    function Book(name, author, pagesCount, isRead) {
        this.name = name;
        this.author = author;
        this.pagesCount = pagesCount
        this.isRead = isRead || false
    }
    
    function addBookToLibrary(...book) {
        myLibrary.push(new Book(...book));
        return true;
    }

    function removeBooksItem() {
        const items = document.querySelectorAll('.books-item');

        if (items.length > 0) {
            items.forEach(el => el.remove());
        }
    }

    function addBooksToView() {
        const list = document.querySelector('.books-list');

        removeBooksItem();

        if (list) {
            myLibrary.forEach((book, index) => {
                const li = document.createElement('li');
                li.classList.add('books-item');
                li.setAttribute('data-book-index', index);

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-book-btn');
                deleteBtn.textContent = 'Delete book';


                for (let key in book) {
                    const value = book[key]
                    if (key === 'isRead') {
                        const toggleReadStatusBtn = document.createElement('button');
                        toggleReadStatusBtn.classList.add('toggle-read-status-btn');
                        toggleReadStatusBtn.textContent = `Read-status: ${value}`;
                        li.append(toggleReadStatusBtn);                        
                    } else {
                        const p = document.createElement('p');
                        p.textContent = `${key}: ${value}`;
                        li.append(p);
                    }
                }
                li.append(deleteBtn);
                list.append(li);
            });

        }
        addBookToLocalStorage();
    }

    function addBookToLocalStorage() {
        window.localStorage.setItem('library', JSON.stringify(myLibrary));
    }

    const form = document.querySelector('.form');

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        const formData = new FormData(ev.target);

        addBookToLibrary(
            formData.get('name'),
            formData.get('author'),
            formData.get('pagesCount'),
            formData.get('isRead') === 'on' ? true : false
        );

        addBooksToView();
    });

    const booksList = document.querySelector('.books-list');

    booksList.addEventListener('click', (ev) => {
        
        const t = ev.target;
        const isToggleBtn = t.classList.contains('toggle-read-status-btn');
        const isDeleteBtn = t.classList.contains('delete-book-btn');
        
        console.log(myLibrary, isToggleBtn, isDeleteBtn);

        if (isToggleBtn || isDeleteBtn) {
            const bookIndexToChange = +t.parentElement.getAttribute('data-book-index');
            
            if (isToggleBtn) {
                myLibrary = myLibrary.map((book, i) => (i === bookIndexToChange) ? { ...book, isRead: !book.isRead }: book)
            } else {
                myLibrary = myLibrary.filter((_, i) => i !== bookIndexToChange);
            }

            addBookToLocalStorage();
            addBooksToView();
        }
    });
});