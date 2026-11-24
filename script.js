const places = [
    {
        id: 1,
        name: "The Garden Café",
        category: "Food",
        location: "Vijayawada",
        description: "A peaceful café with refreshing drinks and a beautiful garden atmosphere.",
        image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800"
    },
    {
        id: 2,
        name: "The Green Escape",
        category: "Nature",
        location: "Andhra Pradesh",
        description: "A refreshing destination for anyone who loves greenery and peaceful surroundings.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
    },
    {
        id: 3,
        name: "Heritage Stories",
        category: "Culture",
        location: "India",
        description: "Explore beautiful architecture and discover stories from the past.",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
    },
    {
        id: 4,
        name: "The Hidden Corner",
        category: "Hidden Gems",
        location: "Vijayawada",
        description: "A quiet little spot waiting to be discovered by curious explorers.",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800"
    },
    {
        id: 5,
        name: "Morning Brew",
        category: "Food",
        location: "Hyderabad",
        description: "A cosy coffee destination for slow mornings and good conversations.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
    },
    {
        id: 6,
        name: "Mountain View",
        category: "Nature",
        location: "India",
        description: "Enjoy beautiful landscapes and the calming beauty of nature.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
    }
];

const placesGrid = document.getElementById("places-grid");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const clearFilter = document.getElementById("clear-filter");

const shareModal = document.getElementById("share-modal");
const shareForm = document.getElementById("share-form");
const closeModal = document.getElementById("close-modal");

const shareButtons = [
    document.getElementById("share-nav"),
    document.getElementById("share-about")
];

let selectedCategory = "All";

let customPlaces = [];

let favorites = [];

try {
    customPlaces = JSON.parse(localStorage.getItem("localLensPlaces")) || [];
    favorites = JSON.parse(localStorage.getItem("localLensFavorites")) || [];
} catch {
    customPlaces = [];
    favorites = [];
}

function getAllPlaces() {
    return [...customPlaces, ...places];
}

function displayPlaces(placeList) {
    placesGrid.innerHTML = "";

    if (placeList.length === 0) {
        placesGrid.innerHTML = `
            <div class="no-results">
                <h3>No places found!</h3>
                <p>Try another search or explore a different category.</p>
            </div>
        `;
        return;
    }

    placeList.forEach(place => {
        const card = document.createElement("article");
        card.className = "place-card";

        const image = document.createElement("img");
        image.src = place.image || "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800";
        image.alt = place.name;
        image.loading = "lazy";

        const content = document.createElement("div");
        content.className = "place-content";

        const category = document.createElement("p");
        category.className = "place-category";
        category.textContent = place.category;

        const title = document.createElement("h3");
        title.textContent = place.name;

        const location = document.createElement("p");
        location.className = "place-location";
        location.textContent = "📍 " + place.location;

        const description = document.createElement("p");
        description.className = "place-description";
        description.textContent = place.description;

        const actions = document.createElement("div");
        actions.className = "place-actions";

        const favoriteButton = document.createElement("button");
        favoriteButton.className = "favorite-button";

        const isFavorite = favorites.includes(place.id);

        favoriteButton.textContent = isFavorite ? "♥ Saved" : "♡ Save";
        favoriteButton.classList.toggle("active", isFavorite);

        favoriteButton.addEventListener("click", () => {
            toggleFavorite(place.id);
        });

        const tag = document.createElement("span");
        tag.className = "place-tag";
        tag.textContent = "✦ Local discovery";

        actions.appendChild(favoriteButton);
        actions.appendChild(tag);

        content.appendChild(category);
        content.appendChild(title);
        content.appendChild(location);
        content.appendChild(description);
        content.appendChild(actions);

        card.appendChild(image);
        card.appendChild(content);

        placesGrid.appendChild(card);
    });
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem(
        "localLensFavorites",
        JSON.stringify(favorites)
    );

    filterPlaces();
}

function filterPlaces() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    let filteredPlaces = getAllPlaces();

    if (selectedCategory !== "All") {
        filteredPlaces = filteredPlaces.filter(place =>
            place.category === selectedCategory
        );
    }

    if (searchTerm) {
        filteredPlaces = filteredPlaces.filter(place =>
            place.name.toLowerCase().includes(searchTerm) ||
            place.category.toLowerCase().includes(searchTerm) ||
            place.location.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm)
        );
    }

    displayPlaces(filteredPlaces);
}

searchButton.addEventListener("click", filterPlaces);

searchInput.addEventListener("input", filterPlaces);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        filterPlaces();
    }
});

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.getElementById("discover").scrollIntoView({
            behavior: "smooth"
        });

        filterPlaces();
    });
});

clearFilter.addEventListener("click", () => {
    selectedCategory = "All";
    searchInput.value = "";
    filterPlaces();
});

function openShareModal() {
    shareModal.style.display = "flex";
}

function closeShareModal() {
    shareModal.style.display = "none";
    shareForm.reset();
}

shareButtons.forEach(button => {
    button.addEventListener("click", openShareModal);
});

closeModal.addEventListener("click", closeShareModal);

shareModal.addEventListener("click", event => {
    if (event.target === shareModal) {
        closeShareModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeShareModal();
    }
});

shareForm.addEventListener("submit", event => {
    event.preventDefault();

    const newPlace = {
        id: "custom-" + Date.now(),
        name: document.getElementById("place-name").value.trim(),
        category: document.getElementById("place-category").value,
        location: document.getElementById("place-location").value.trim(),
        description: document.getElementById("place-description").value.trim(),
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800"
    };

    if (
        !newPlace.name ||
        !newPlace.category ||
        !newPlace.location ||
        !newPlace.description
    ) {
        alert("Please complete all fields.");
        return;
    }

    customPlaces.unshift(newPlace);

    try {
        localStorage.setItem(
            "localLensPlaces",
            JSON.stringify(customPlaces)
        );
    } catch {
        customPlaces.shift();
        alert("Unable to save this place. Browser storage may be full.");
        return;
    }

    selectedCategory = "All";
    searchInput.value = "";

    filterPlaces();
    closeShareModal();

    document.getElementById("discover").scrollIntoView({
        behavior: "smooth"
    });
});

displayPlaces(getAllPlaces());