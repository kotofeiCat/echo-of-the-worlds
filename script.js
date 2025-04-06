
let myMap;
let placemarks = [];
let activeButton = null;
import { places } from "./placeData.js";

ymaps.ready(function () {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get('lat') || 55.733842);
    const lon = parseFloat(params.get('lon') || 37.588144);
    const zoomMap = parseInt(params.get('z') || 10);
    const exam = parseInt(params.get('exam') || 0);

    myMap = new ymaps.Map('map', {
        center: [lat, lon],
        zoom: zoomMap,
        controls: []
    });

    if (exam == 0) {
        ymaps.geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
            myMap.geoObjects.add(result.geoObjects);
        });
    }

    
    places.forEach(function (place) {
        let placeiconImage; 

        if (place.type == "street") {
            placeiconImage = "https://cdn-icons-png.flaticon.com/512/3547/3547364.png";
        } else if (place.type == "park") {
            placeiconImage = "https://cdn-icons-png.flaticon.com/512/7561/7561338.png";
        } else if (place.type == "museum") {
            placeiconImage = 'https://cdn-icons-png.flaticon.com/512/8/8154.png';
        } else if (place.type == "churches") {
            placeiconImage = "https://cdn-icons-png.flaticon.com/512/3660/3660427.png";
        } else if (place.type == "theaters") {
            placeiconImage = "https://cdn-icons-png.flaticon.com/512/7561/7561385.png";
        } else if (place.type == "attractions") {
            placeiconImage = "https://cdn-icons-png.flaticon.com/512/7561/7561320.png";
        } else if (place.type == "culturalBuildings") {
            placeiconImage = "https://cdn-icons-png.flaticon.com/512/774/774220.png";
        } else if (place.type == "trading") {
            placeiconImage = "https://cdn-icons-png.flaticon.com/512/6470/6470384.png";
        } else if (place.type == "exhibitionCenters") {
            placeiconImage = "https://cdn-icons-png.flaticon.com/512/1373/1373071.png";
        }

        let placemark = new ymaps.Placemark(place.coords, {
            balloonContentHeader: `<p>${place.name}</p><br>`,
            balloonContentBody: `<p>${place.description}</p>`,
            hintContent: place.name,
            minZoom: 10, // метка будет видна только при zoom >= 10
            maxZoom: 18
        },{
            iconLayout: 'default#image', // Используем своё изображение
            iconImageHref: placeiconImage, // Ссылка на фото (PNG, JPG, SVG)
            iconImageSize: [40, 40], // Размер значка
            iconImageOffset: [-20, -40], // Смещение (чтобы указатель был точным)
        });

        placemark.name = place.name.toLowerCase();
        placemark.type = place.type;

        myMap.geoObjects.add(placemark);
        placemarks.push(placemark);
    });

});
function searchPlaces() {
    let searchValue = document.getElementById('searchInput').value.toLowerCase();

    placemarks.forEach(placemark => {
        if (placemark.name.includes(searchValue)) {
            myMap.geoObjects.add(placemark);
        } else {
            myMap.geoObjects.remove(placemark);
        }
    });
}
function filterPlaces(type) {
    placemarks.forEach(placemark => {
        if (type === 'all' || placemark.type === type) {
            placemark.options.set('visible', true);
        } else {
            placemark.options.set('visible', false);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");

    burger.addEventListener("click", function () {
        menu.classList.toggle("open");
        burger.classList.toggle("open");
        activeButton.classList.remove('clicked');
    });
});

function showSuggestions() {
    let input = document.getElementById("searchInput").value.trim().toLowerCase();
    let suggestionsList = document.getElementById("suggestions");

    suggestionsList.innerHTML = "";
    if (!input) {
        suggestionsList.style.display = "none";
        return;
    }

    let filteredPlaces = places.filter(place => place.name.toLowerCase().includes(input));

    if (filteredPlaces.length > 0) {
        suggestionsList.style.display = "block";

        filteredPlaces.forEach(place => {
            let listItem = document.createElement("li");
            listItem.textContent = place.name;
            listItem.onclick = function () {
                document.getElementById("searchInput").value = place.name;
                suggestionsList.style.display = "none";
                myMap.setCenter(place.coords, 20);
            };
            suggestionsList.appendChild(listItem);
        });
    } else {
        suggestionsList.style.display = "none";
    }
}
