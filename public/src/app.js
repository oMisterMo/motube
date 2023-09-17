// Initial fetch
$(async function () {
    console.log(" ready!");
    const mo = await logTimestamp();
});

// Set button listener const
const button = document.querySelector("#increment");
const search = document.querySelector("#search");
const searchButton = document.querySelector("#searchConfirm");
const value = document.querySelector("#timestamp");

button.addEventListener("click", async (e) => {
    e.preventDefault();

    await logTimestamp();
});
searchButton.addEventListener("click", async (e) => {
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

// Methods
const logTimestamp = async (e) => {
    if (e) {
        console.log("e: ", e);
        e.preventDefault();
    }
    const result = await fetch("/timestamp");
    const timestamp = await result.text();
    console.log("timestamp: ", timestamp);
    value.textContent = timestamp;

    return timestamp;
};
