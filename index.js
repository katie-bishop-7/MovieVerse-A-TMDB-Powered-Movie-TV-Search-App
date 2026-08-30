const queryObj = queryStringToJson(window.location.search);
const queryStr = decodeURIComponent(queryObj.query)
const page = parseInt(queryObj.page)

const searchInput = document.getElementById("search-text");
const movieButton = document.getElementById("movie-button");
const tvButton = document.getElementById("tv-button");
const personButton = document.getElementById("person-button");
const navButton = document.getElementById("nav-button");
const drawer = document.getElementById("drawer")
const findButton = document.getElementById("find-button")
const sortBy = document.getElementById("sort-by")
const pageDescription = document.getElementById("page-description")
const closeIcon = document.getElementById("close-icon")
const nextPageMovies = document.getElementById("next-page-movies")
const nextPageTV = document.getElementById("next-page-tv")
const nextPagePeople = document.getElementById("next-page-people")
const prevPageMovies = document.getElementById("prev-page-movies")
const prevPageTV = document.getElementById("prev-page-tv")
const prevPagePeople = document.getElementById("prev-page-people")
let drawerIsOpen = false;

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        window.location.href = `${findButton.href}?query=${searchInput.value}&page=${1}`;
    }
});



// Remove search input on close icon click
closeIcon.addEventListener("click", (e) => {
    searchInput.value = ""
})

sortBy.addEventListener("change", (e) => {
    findButton.href = e.target.value
})

// Nav drawer open and close
navButton.addEventListener("click", e => {
    drawerIsOpen = !drawerIsOpen;
    drawer.dataset.open = `${drawerIsOpen}`
});

// Navigate with a query string
function searchEventListeners(element) {
    element.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = `${element.href}?query=${searchInput.value}&page=${1}`;
    })
}
searchEventListeners(findButton)

nextPageMovies.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${nextPageMovies.href}?query=${searchInput.value}&page=${page + 1}`;
})
nextPageTV.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${nextPageTV.href}?query=${searchInput.value}&page=${page + 1}`;
})
nextPagePeople.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${nextPagePeople.href}?query=${searchInput.value}&page=${page + 1}`;
})

prevPageMovies.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${prevPageMovies.href}?query=${searchInput.value}&page=${page - 1}`;
})
prevPageTV.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${prevPageTV.href}?query=${searchInput.value}&page=${page - 1}`;
})
prevPagePeople.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${prevPagePeople.href}?query=${searchInput.value}&page=${page - 1}`;
})



if (queryObj.query) {
    pageDescription.innerText = `Search Results: ${queryStr} `
    searchInput.value = queryStr
    const query = queryStr;
    movieSearch(query, page)
        .then(results => {
            console.log(results)
            for (let i = 0; i < results.results.length; i++) { // iterate over number of cards
                // create card with info
                let img = document.createElement('img')
                let card = document.createElement('div')
                let title = document.createElement('h3')
                let voteAverage = document.createElement('div')

                if (results.results[i].poster_path === null) {
                    img.src = "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                } else {
                    img.src = `${imgUrl}w500${results.results[i].poster_path}`
                }
                img.alt = `${results.results[i].title} poster`
                title.innerText = `${results.results[i].title} (${results.results[i].release_date.slice(0, 4)})`
                voteAverage.innerText = `Vote Average: ${results.results[i].vote_average}`

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(voteAverage);
                card.className = "info-card clickable"
                card.id = `movie-card-${i}`

                card.addEventListener("click", (e) => {
                    e.preventDefault()
                    window.location.href = `movie.html?id=${results.results[i].id}`;
                    console.log(results.results[i])

                })

                document.getElementById("movie-card-container").appendChild(card)
            }
            if (page > 1) {
                let prev = document.createElement("div")
                prev.innerHTML = "< Previous Page"
                prev.className = "previous-page"
                document.getElementById("prev-page-movies").appendChild(prev)
            } 
            if (page < results.total_pages) {
                let next = document.createElement("div")
                next.innerHTML = "Next Page >"
                next.className = "next-page"
                document.getElementById("next-page-movies").appendChild(next)
            } 
            
        })
        .catch(error => console.log(error));

    tvSearch(query, page)
        .then(results => {
            for (let i = 0; i < results.results.length; i++) { // iterate over number of cards
                // create card with info
                let img = document.createElement('img')
                let card = document.createElement('div')
                let title = document.createElement('h3')
                let voteAverage = document.createElement('div')

                if (results.results[i].poster_path === null) {
                    img.src = "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                } else {
                    img.src = `${imgUrl}w500${results.results[i].poster_path}`
                }

                img.alt = `${results.results[i].name} poster`
                title.innerText = `${results.results[i].name} (${results.results[i].first_air_date.slice(0, 4)})`
                voteAverage.innerText = `Vote Average: ${results.results[i].vote_average}`

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(voteAverage);
                card.className = "info-card clickable"
                card.id = `tv-card-${i}`

                card.addEventListener("click", (e) => {
                    e.preventDefault()
                    window.location.href = `series.html?id=${results.results[i].id}`;
                    console.log(results.results[i])

                })

                document.getElementById("tv-card-container").appendChild(card)
            }
            if (page > 1) {
                let prev = document.createElement("div")
                prev.innerHTML = "< Previous Page"
                prev.className = "previous-page"
                document.getElementById("prev-page-tv").appendChild(prev)
            } 
            if (page < results.total_pages) {
                let next = document.createElement("div")
                next.innerHTML = "Next Page >"
                next.className = "next-page"
                document.getElementById("next-page-tv").appendChild(next)
            } 
        })
        .catch(error => console.log(error));
    peopleSearch(query, page)
        .then(results => {
            for (let i = 0; i < results.results.length; i++) { // iterate over number of cards
                // create card with info
                let img = document.createElement('img')
                let card = document.createElement('div')
                let title = document.createElement('h3')

                if (results.results[i].profile_path === null) {
                    img.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                } else {
                    img.src = `${imgUrl}w500${results.results[i].profile_path}`
                }
                img.alt = `${results.results[i].name} picture`
                title.innerText = results.results[i].name

                card.appendChild(img);
                card.appendChild(title);
                card.className = "info-card clickable"
                card.id = `people-card-${i}`

                card.addEventListener("click", () => {
                    window.location.href = `person.html?id=${results.results[i].id}`
                })

                document.getElementById("people-card-container").appendChild(card)
            }
            if (page > 1) {
                let prev = document.createElement("div")
                prev.innerHTML = "< Previous Page"
                prev.className = "previous-page clickable"
                document.getElementById("prev-page-people").appendChild(prev)
            } 
            if (page < results.total_pages) {
                let next = document.createElement("div")
                next.innerHTML = "Next Page >"
                next.className = "next-page clickable"
                document.getElementById("next-page-people").appendChild(next)
            } 
        })
        .catch(error => console.log(error));

} else {
    const number_of_cards = 5;
    pageDescription.innerText = "Trending This Week"

    moviePopular()
        .then(results => {
            for (let i = 0; i < number_of_cards; i++) { // iterate over number of cards
                // create card with info
                console.log(results.results[i])
                let img = document.createElement('img')
                let card = document.createElement('div')
                let title = document.createElement('h3')
                let voteAverage = document.createElement('div')

                img.src = `${imgUrl}w500${results.results[i].poster_path}`
                img.alt = `${results.results[i].title} poster`
                title.innerText = `${results.results[i].title} (${results.results[i].release_date.slice(0, 4)})`
                voteAverage.innerText = `Vote Average: ${results.results[i].vote_average}`

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(voteAverage);
                card.className = "info-card clickable"
                card.id = `movie-card-${i}`

                card.addEventListener("click", (e) => {
                    e.preventDefault()
                    window.location.href = `movie.html?id=${results.results[i].id}`;

                })

                document.getElementById("movie-card-container").appendChild(card)
            }
        })
        .catch(error => console.log(error));

    tvPopular()
        .then(results => {
            for (let i = 0; i < number_of_cards; i++) { // iterate over number of cards
                // create card with info
                let img = document.createElement('img')
                let card = document.createElement('div')
                let title = document.createElement('h3')
                let voteAverage = document.createElement('div')

                img.src = `${imgUrl}w500${results.results[i].poster_path}`
                img.alt = `${results.results[i].title} poster`
                title.innerText = `${results.results[i].name} (${results.results[i].first_air_date.slice(0, 4)})`
                voteAverage.innerText = `Vote Average: ${results.results[i].vote_average}`

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(voteAverage);
                card.className = "info-card clickable"
                card.id = `tv-card-${i}`

                card.addEventListener("click", (e) => {
                    e.preventDefault()
                    window.location.href = `series.html?id=${results.results[i].id}`;
                    console.log(results.results[i])

                })

                document.getElementById("tv-card-container").appendChild(card)
            }
        })
        .catch(error => console.log(error));

    peoplePopular()
        .then(results => {
            for (let i = 0; i < number_of_cards; i++) { // iterate over number of cards
                // create card with info
                let img = document.createElement('img')
                let card = document.createElement('div')
                let title = document.createElement('h3')

                img.src = `${imgUrl}w500${results.results[i].profile_path}`
                img.alt = `${results.results[i].name} picture`
                title.innerText = results.results[i].name

                card.appendChild(img);
                card.appendChild(title);
                card.className = "info-card clickable"
                card.id = `people-card-${i}`

                card.addEventListener("click", () => {
                    window.location.href = `person.html?id=${results.results[i].id}`
                })

                document.getElementById("people-card-container").appendChild(card)
            }
        })
        .catch(error => console.log(error));
}



