// Initial fetch
$(async function () {
    console.log(" ready!");
});

// Set button listener const
const search = document.querySelector("#search");
const searchButton = document.querySelector("#searchConfirm");
const value = document.querySelector("#timestamp");

searchButton.addEventListener("click", async e => {
    e.preventDefault();

    const url = search.value;
    const a = document.createElement("a");
    if (url) {
        a.href = "/search?v=" + url;
    } else {
        a.href = "/search";
    }
    a.click();
});
