// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
const seriesId = queryObj.id;

const searchInput = document.getElementById("search-text");
const idInput = document.getElementById("url-text");
const findButton = document.getElementById("find-button")
const navButton = document.getElementById("nav-button");
const drawer = document.getElementById("drawer")
const closeIcon = document.getElementById("close-icon")
let drawerIsOpen = false;

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        window.location.href = `${findButton.href}?query=${searchInput.value}&page=${1}`;
    }
});

// Nav drawer open and close
navButton.addEventListener("click", e => {
    drawerIsOpen = !drawerIsOpen;
    drawer.dataset.open = `${drawerIsOpen}`
});

// Remove search input on close icon click
closeIcon.addEventListener("click", (e) => {
    searchInput.value = ""
})

// Navigate with a query string
function searchEventListeners(element) {
    element.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = `${element.href}?query=${searchInput.value}`;
    })
}
searchEventListeners(findButton)


tvDetails(seriesId)
    .then(results => {
        // Insert image
        console.log(results)
        const poster = document.getElementById("movie-poster")
        if (results.poster_path === null) {
            poster.src = "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
        } else {
            poster.src = `${imgUrl}w500${results.poster_path}`
        }
        poster.alt = `${results.title} poster`

        // Insert title, release date, rating, overview, runtime, vote average
        let title = document.createElement('h1')
        let voteAverage = document.createElement('div')
        let released = document.createElement('div')
        let seasons = document.createElement('div')
        let episodes = document.createElement('div')
        let overviewHeader = document.createElement('h2')
        let overview = document.createElement('div')
        let creditsHeader = document.createElement('h2')

        title.innerText = `${results.name}`
        voteAverage.innerText = `Vote Average: ${results.vote_average}`
        released.innerText = `Years running: ${results.first_air_date.slice(0, 4)}-${results.last_air_date.slice(0, 4)}`
        seasons.innerText = `Number of seasons: ${results.number_of_seasons}`
        episodes.innerText = `Total number of Episodes: ${results.number_of_episodes}`
        overviewHeader.innerText = "Overview"
        overview.innerText = results.overview
        creditsHeader.innerText = "Cast"

        const tvInfo = document.getElementById("movie-info");
        tvInfo.appendChild(title)
        tvInfo.appendChild(voteAverage)
        tvInfo.appendChild(released)
        tvInfo.appendChild(seasons)
        tvInfo.appendChild(episodes)
        tvInfo.appendChild(overviewHeader)
        tvInfo.appendChild(overview)

        // get credits

        tvCredits(seriesId)
            .then(result => {
                for (castObj of result.cast) {
                    const card = document.createElement('div')
                    const img = document.createElement('img')
                    const nameDiv = document.createElement('div')
                    const characterDiv = document.createElement('div')
                    characterDiv.innerText = castObj.character
                    characterDiv.className = "character"

                    card.appendChild(img)
                    card.appendChild(nameDiv)
                    card.appendChild(characterDiv)

                    personDetails(castObj.id)
                        .then(res => {
                            img.src = `${imgUrl}w500${res.profile_path}`;
                            nameDiv.innerText = res.name;
                            card.className = "info-card movie-cast-card clickable"


                            card.addEventListener("click", () => {
                                window.location.href = `person.html?id=${res.id}`
                            })

                            document.getElementById("movie-credits").appendChild(card)
                        })
                }
            })
    })
    .catch(error => console.log(error));

    const carousel = document.getElementById("carousel-slider")
    function makeImageCarousel(arrayOfPosters) {
        for (let i = 0; i < 15; i++) {
            for (posterObj of arrayOfPosters) {
                let poster = document.createElement("img")
                poster.src = `${imgUrl}w500${posterObj.file_path}`;
                poster.className = "carousel-picture"
                carousel.appendChild(poster)
            }
        }
    }
    // Make the call to get the info based on the id
    tvImages(seriesId)
        .then(result => {
            console.log(result);
            makeImageCarousel(result.posters);
        })
        .catch(error => console.log(error));
