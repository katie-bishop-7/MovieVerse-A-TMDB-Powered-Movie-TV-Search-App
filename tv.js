// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
let tvName = null
if (queryObj.query){
    tvName = decodeURIComponent(queryObj.query);
}
let page = parseInt(queryObj.page)

const idInput = document.getElementById("id-text");
const findButton = document.getElementById("find-button");
const pageDescription = document.getElementById("page-description")

const searchInput = document.getElementById("search-text");
const navButton = document.getElementById("nav-button");
const drawer = document.getElementById("drawer")
const closeIcon = document.getElementById("close-icon")
const nextPageTV = document.getElementById("next-page-tv")
const prevPageTV = document.getElementById("prev-page-tv")
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
nextPageTV.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${nextPageTV.href}?query=${searchInput.value}&page=${page + 1}`;
})
prevPageTV.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${prevPageTV.href}?query=${searchInput.value}&page=${page - 1}`;
})
if (tvName) {
    pageDescription.innerText = `Search Results: ${tvName}`
    searchInput.value = tvName
    tvSearch(tvName, page)
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
            title.innerText = `${results.results[i].name} (${results.results[i].first_air_date.slice(0,4)})`
            voteAverage.innerText = `Vote Average: ${results.results[i].vote_average}`

            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(voteAverage);
            card.className = "info-card clickable"
            card.id = `tv-card-${i}`

            card.addEventListener("click", (e) => {
                e.preventDefault()
                window.location.href = `series.html?id=${results.results[i].id}`;

            })

            document.getElementById("tv-card-container").appendChild(card)
        }
        if (page > 1) {
            let prev = document.createElement("div")
            prev.innerHTML = "< Previous Page"
            prev.className = "previous-page clickable"
            document.getElementById("prev-page-tv").appendChild(prev)
        } 
        if (page < results.total_pages) {
            let next = document.createElement("div")
            next.innerHTML = "Next Page >"
            next.className = "next-page clickable"
            document.getElementById("next-page-tv").appendChild(next)
        } 
    })
    .catch(error => console.log(error));

} else {
    const number_of_cards = 50;

    tvPopular()
        .then(results => {
            for (let i = 0; i < number_of_cards; i++) { // iterate over number of cards
                // create card with info
                let img = document.createElement('img')
                let card = document.createElement('div')
                let title = document.createElement('h3')
                let voteAverage = document.createElement('div')
    
                img.src = `${imgUrl}w500${results.results[i].poster_path}`
                img.alt = `${results.results[i].name} poster`
                title.innerText = `${results.results[i].name} (${results.results[i].first_air_date.slice(0,4)})`
                voteAverage.innerText = `Vote Average: ${results.results[i].vote_average}`
    
                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(voteAverage);
                card.className = "info-card clickable"
                card.id = `tv-card-${i}`
    
                card.addEventListener("click", (e) => {
                    e.preventDefault()
                    window.location.href = `series.html?id=${results.results[i].id}`;
    
                })
    
                document.getElementById("tv-card-container").appendChild(card)
            }
        })
        .catch(error => console.log(error));
}
