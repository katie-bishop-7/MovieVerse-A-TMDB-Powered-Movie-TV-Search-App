// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
let movieName = null
if (queryObj.query){
    movieName = decodeURIComponent(queryObj.query);
}
page = parseInt(queryObj.page)

const idInput = document.getElementById("id-text");
const findButton = document.getElementById("find-button");

const navButton = document.getElementById("nav-button");
const drawer = document.getElementById("drawer")
const pageDescription = document.getElementById("page-description")
const searchInput = document.getElementById("search-text")
const closeIcon = document.getElementById("close-icon")
const nextPageMovies = document.getElementById("next-page-movies")
const prevPageMovies = document.getElementById("prev-page-movies")

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

// Nav drawer open and close
navButton.addEventListener("click", e => {
    drawerIsOpen = !drawerIsOpen;
    drawer.dataset.open = `${drawerIsOpen}`
});

// Navigate with a query string
function searchEventListeners(element) {
    element.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = `${element.href}?query=${searchInput.value}&page=1`;
    })
}
searchEventListeners(findButton)
nextPageMovies.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${nextPageMovies.href}?query=${searchInput.value}&page=${page + 1}`;
})
prevPageMovies.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${prevPageMovies.href}?query=${searchInput.value}&page=${page - 1}`;
})

if (movieName) {
    pageDescription.innerText = `Search Results: ${movieName}`
    searchInput.value = movieName
    movieSearch(movieName, page)
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
        if (page > 1) {
            let prev = document.createElement("div")
            prev.innerHTML = "< Previous Page"
            prev.className = "previous-page clickable"
            document.getElementById("prev-page-movies").appendChild(prev)
        } 
        if (page < results.total_pages) {
            let next = document.createElement("div")
            next.innerHTML = "Next Page >"
            next.className = "next-page clickable"
            document.getElementById("next-page-movies").appendChild(next)
        } 
    })
    .catch(error => console.log(error));
} else {
    pageDescription.innerText = "Trending Movies"

    const number_of_cards = 50;

    moviePopular()
        .then(results => {
            for (let i = 0; i < number_of_cards; i++) { // iterate over number of cards
                // create card with info
                console.log(results.results[i])
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
    
                })
    
                document.getElementById("movie-card-container").appendChild(card)
            }
        })
        .catch(error => console.log(error));
    
}



// Make the call to get results from the search
movieSearch(movieName)
    .then(result => console.log(result))
    .catch(error => console.log(error));
