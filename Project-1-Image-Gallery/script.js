const navLinks = document.querySelectorAll(".nav-link");
const galleryItems = document.querySelectorAll(".gallery-item");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxSeason = document.getElementById("lightboxSeason");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let visibleImages = [];
let currentIndex = 0;


function updateVisibleImages() {

    visibleImages = [];

    galleryItems.forEach(function (item) {

        if (!item.classList.contains("hide")) {
            visibleImages.push(item);
        }

    });

}
function filterGallery(selectedSeason) {

    galleryItems.forEach(function (item) {

        const category = item.getAttribute("data-category");

        if (
            selectedSeason === "all" ||
            category === selectedSeason
        ) {

            item.classList.remove("hide");

        } else {

            item.classList.add("hide");

        }

    });

    updateVisibleImages();

    currentIndex = 0;
}



navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const selectedSeason =
            link.getAttribute("data-filter");


        navLinks.forEach(function (navLink) {

            navLink.classList.remove("active");

        });


        link.classList.add("active");


        filterGallery(selectedSeason);

    });

});


galleryItems.forEach(function (item) {

    item.addEventListener("click", function () {

        if (item.classList.contains("hide")) {
            return;
        }


        updateVisibleImages();


        currentIndex =
            visibleImages.indexOf(item);


        showImage();


        lightbox.classList.add("show");

    });

});


function showImage() {

    const item =
        visibleImages[currentIndex];


    const image =
        item.querySelector("img");


    lightboxImage.src = image.src;

    lightboxImage.alt = image.alt;


    lightboxTitle.textContent =
        item.getAttribute("data-title");


    lightboxSeason.textContent =
        item.getAttribute("data-season");

}


closeBtn.addEventListener("click", function () {

    lightbox.classList.remove("show");

});


nextBtn.addEventListener("click", function () {

    currentIndex++;

    if (currentIndex >= visibleImages.length) {

        currentIndex = 0;

    }

    showImage();

});


prevBtn.addEventListener("click", function () {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex =
            visibleImages.length - 1;

    }

    showImage();

});


lightbox.addEventListener("click", function (event) {

    if (event.target === lightbox) {

        lightbox.classList.remove("show");

    }

});


document.addEventListener("keydown", function (event) {

    if (!lightbox.classList.contains("show")) {
        return;
    }


    if (event.key === "Escape") {

        lightbox.classList.remove("show");

    }


    if (event.key === "ArrowRight") {

        currentIndex++;

        if (currentIndex >= visibleImages.length) {

            currentIndex = 0;

        }

        showImage();

    }


    if (event.key === "ArrowLeft") {

        currentIndex--;

        if (currentIndex < 0) {

            currentIndex =
                visibleImages.length - 1;

        }

        showImage();

    }

});


updateVisibleImages();
