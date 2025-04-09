class BooksList {
    constructor() {
        const thisBookList = this;

        thisBookList.select = {
            templateOf: {
                book: "#template-book",
            },
            containerOf: {
                books: ".books-list",
                filters: ".filters",
            },
            book: {
                image: ".book__image",
            },
        };

        thisBookList.templates = {
            book: Handlebars.compile(
                document.querySelector(thisBookList.select.templateOf.book).innerHTML
            ),
        };

        thisBookList.classNames = {
            bookFavorite: "favorite",
            imageHidden: "hidden",
            bookImg: "book__image",
        };

        thisBookList.favoriteBooks = [];
        thisBookList.filters = [];
        thisBookList.data = dataSource.books;
        thisBookList.init();
    }

    getElements() {
        const thisBookList = this;
        thisBookList.bookContainer = document.querySelector(
            thisBookList.select.containerOf.books
        );
        thisBookList.bookImages = document.querySelectorAll(
            thisBookList.select.book.image
        );
        thisBookList.bookFilterContainer = document.querySelector(
            thisBookList.select.containerOf.filters
        );
    }

    render() {
        const thisBookList = this;
        for (let book in thisBookList.data) {
            const bookData = thisBookList.data[book];
            bookData.ratingBgc = thisBookList.determineRatingBgc(bookData.rating);
            bookData.ratingWidth = (bookData.rating / 10) * 100;
            const generatedHTML = thisBookList.templates.book(bookData);
            const element = utils.createDOMFromHTML(generatedHTML);
            document
                .querySelector(thisBookList.select.containerOf.books)
                .appendChild(element);
        }
    }

    determineRatingBgc(rating) {
        if (rating < 6) {
            return "linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);";
        } else if (rating <= 8) {
            return "linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%);";
        } else if (rating <= 9) {
            return "linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);";
        } else {
            return "linear-gradient(to bottom, #ff0084 0%, #ff0084 100%);";
        }
    }

    filterBooks() {
        const thisBookList = this;
        if (thisBookList.filters.length > 0) {
            for (let book in thisBookList.data) {
                let shouldbeHidden = false;
                for (let filter of thisBookList.filters) {
                    if (!thisBookList.data[book].details[filter]) {
                        shouldbeHidden = true;
                        break;
                    }
                }
                const bookImg = thisBookList.bookContainer.querySelector(
                    `[data-id="${thisBookList.data[book].id}"]`
                );
                if (shouldbeHidden) {
                    bookImg.classList.add(thisBookList.classNames.imageHidden);
                } else {
                    bookImg.classList.remove(thisBookList.classNames.imageHidden);
                }
            }
        } else {
            for (let bookImg of thisBookList.bookImages) {
                bookImg.classList.remove(thisBookList.classNames.imageHidden);
            }
        }
    }

    initActions() {
        const thisBookList = this;
        thisBookList.bookContainer.addEventListener("dblclick", function (event) {
            event.preventDefault();
            const bookElement = event.target.offsetParent;
            if (bookElement.classList.contains(thisBookList.classNames.bookImg)) {
                const id = bookElement.getAttribute("data-id");
                if (thisBookList.favoriteBooks.includes(id)) {
                    const index = thisBookList.favoriteBooks.indexOf(id);
                    thisBookList.favoriteBooks.splice(index, 1);
                } else {
                    thisBookList.favoriteBooks.push(id);
                }
                bookElement.classList.toggle(thisBookList.classNames.bookFavorite);
            }
        });

        thisBookList.bookFilterContainer.addEventListener(
            "click",
            function (event) {
                if (
                    event.target.tagName === "INPUT" &&
                    event.target.type === "checkbox" &&
                    event.target.name === "filter"
                ) {
                    if (event.target.checked) {
                        thisBookList.filters.push(event.target.value);
                    } else {
                        const index = thisBookList.filters.indexOf(event.target.value);
                        thisBookList.filters.splice(index, 1);
                    }
                    thisBookList.filterBooks();
                }
            }
        );
    }

    init() {
        const thisBookList = this;
        thisBookList.render();
        thisBookList.getElements();
        thisBookList.initActions();
    }
}

const app = new BooksList();
