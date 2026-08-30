// Get the query string into a JSON object
const queryObj = queryStringToJson(window.location.search);
let peopleName = null
if (queryObj.query){
    peopleName = decodeURIComponent(queryObj.query);
}
let page = parseInt(queryObj.page)

const searchInput = document.getElementById("search-text");
const pageDescription = document.getElementById("page-description")
const idInput = document.getElementById("id-text");
const findButton = document.getElementById("find-button");
const navButton = document.getElementById("nav-button");
const drawer = document.getElementById("drawer")
const closeIcon = document.getElementById("close-icon")
const nextPagePeople = document.getElementById("next-page-people")
const prevPagePeople = document.getElementById("prev-page-people")
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
nextPagePeople.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${nextPagePeople.href}?query=${searchInput.value}&page=${page + 1}`;
})
prevPagePeople.addEventListener("click", e => {
    e.preventDefault()
    window.location.href = `${prevPagePeople.href}?query=${searchInput.value}&page=${page - 1}`;
})

if (peopleName) {
    pageDescription.innerText = `Search Results: ${peopleName}`
    searchInput.value = peopleName

    peopleSearch(peopleName, page)
    .then(results => {
        for (let i = 0; i < results.results.length; i++) { // iterate over number of cards
            // create card with info
            let img = document.createElement('img')
            let card = document.createElement('div')
            let name = document.createElement('h3')

            if (results.results[i].profile_path === null) {
                img.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
            } else {
                img.src = `${imgUrl}w500${results.results[i].profile_path}`
            }
            img.alt = `${results.results[i].name} profile picture`
            name.innerText = `${results.results[i].name}`

            card.appendChild(img);
            card.appendChild(name);
            card.className = "info-card clickable"
            card.id = `person-card-${i}`

            card.addEventListener("click", (e) => {
                e.preventDefault()
                window.location.href = `person.html?id=${results.results[i].id}`;

            })

            document.getElementById("person-card-container").appendChild(card)
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
    const number_of_cards = 50;

    peoplePopular()
        .then(results => {
            for (let i = 0; i < number_of_cards; i++) { // iterate over number of cards
                // create card with info
                console.log(results.results[i])
                let img = document.createElement('img')
                let card = document.createElement('div')
                let name = document.createElement('h3')
    
                if (results.results[i].profile_path === null) {
                    img.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                } else {
                    img.src = `${imgUrl}w500${results.results[i].profile_path}`
                }
                img.alt = `${results.results[i].name} profile picture`
                name.innerText = `${results.results[i].name}`
    
                card.appendChild(img);
                card.appendChild(name);
                card.className = "info-card clickable"
                card.id = `person-card-${i}`
    
                card.addEventListener("click", (e) => {
                    e.preventDefault()
                    window.location.href = `person.html?id=${results.results[i].id}`;
    
                })
    
                document.getElementById("person-card-container").appendChild(card)
            }
        })
        .catch(error => console.log(error));    
}

