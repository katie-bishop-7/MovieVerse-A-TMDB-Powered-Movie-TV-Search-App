// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
const movieId = queryObj.id;

const searchInput = document.getElementById("search-text");
const idInput = document.getElementById("url-text");
const findButton = document.getElementById("find-button")
const slider = document.getElementById("carousel-slider");
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
        window.location.href = `${element.href}?query=${searchInput.value}`;
    })
}
searchEventListeners(findButton)


// Make the call to get the info based on the id
movieDetails(movieId)
    .then(results => {
        // Insert image
        const poster = document.getElementById("movie-poster")
        poster.src = `${imgUrl}w500${results.poster_path}`
        poster.alt = `${results.title} poster`

        // Insert title, release date, rating, overview, runtime, vote average
        let title = document.createElement('h1')
        let voteAverage = document.createElement('div')
        let released = document.createElement('div')
        let runtime = document.createElement('div')
        let overviewHeader = document.createElement('h2')
        let overview = document.createElement('div')
        let creditsHeader = document.createElement('h2')

        title.innerText = `${results.title}`
        voteAverage.innerText = `Vote Average: ${results.vote_average}`
        released.innerText = `Released: ${results.release_date}`
        runtime.innerText = `Runtime: ${results.runtime} minutes`
        overviewHeader.innerText = "Overview"
        overview.innerText = results.overview
        creditsHeader.innerText = "Cast"

        const movieInfo = document.getElementById("movie-info");
        movieInfo.appendChild(title)
        movieInfo.appendChild(voteAverage)
        movieInfo.appendChild(released)
        movieInfo.appendChild(runtime)
        movieInfo.appendChild(overviewHeader)
        movieInfo.appendChild(overview)

        // get credits

        movieCredits(movieId)
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
                            if (res.profile_path === null) {
                                img.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                            } else {
                                img.src = `${imgUrl}w500${res.profile_path}`;
                            }
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
    let multiplier = 1;
    let maxImages = 50;
    if (arrayOfPosters.length < maxImages) {
        multiplier = Math.floor(maxImages / arrayOfPosters.length);
    };
    let numImages = 0;
    for (let i = 0; i < multiplier; i++) {
        for (posterObj of arrayOfPosters) {
            if (numImages >= maxImages) {
                break;
            }
            for (posterObj of arrayOfPosters) {
                let poster = document.createElement("img")
                poster.src = `${imgUrl}w500${posterObj.file_path}`;
                poster.className = "carousel-picture"
                carousel.appendChild(poster)
                numImages++;
            }
        }
    }
}
    // Make the call to get the info based on the id
    movieImages(movieId)
        .then(result => {
            console.log(result);
            makeImageCarousel(result.posters);
        })
        .catch(error => console.log(error));
