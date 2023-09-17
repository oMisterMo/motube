// Initial fetch
$(async function () {
    console.log(" ready!");

    // Set button listener const
    const search = document.querySelector("#search");
    const searchButton = document.querySelector("#searchConfirm");
    const value = document.querySelector("#timestamp");

    const timestamp = await fetch("/timestamp");
    const timestampJSON = await timestamp.json();
    console.log(timestampJSON);

    searchButton.addEventListener("click", async e => {
        e.preventDefault();

        // Get details
        const url = search.value;

        // Update server file storing details of request
        const data = {
            url,
            timestamp: 0,
            created_at: Date.now(),
            modified_at: Date.now(),
        };
        fetch("/timestamp", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // Go to search page
        const a = document.createElement("a");
        if (url) {
            a.href = "/search?v=" + url;
        } else {
            a.href = "/search";
        }
        a.click();
    });
});
