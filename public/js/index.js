// Initial fetch
$(async function () {
    console.log(" ready!");

    // Set button listener const
    const search = document.querySelector("#search");
    const searchButton = document.querySelector("#searchConfirm");
    const value = document.querySelector("#timestamp");

    // const timestamp = await fetch("/timestamp");
    // const timestampJSON = await timestamp.json();
    // console.log(timestampJSON);

    searchButton.addEventListener("click", async e => {
        e.preventDefault();

        // Get details
        const url = search.value;

        // Go to search page
        const a = document.createElement("a");
        if (url) {
            // Update server file storing details of request
            const data = {
                url,
                timestamp: 0,
                created_at: Date.now(),
                modified_at: Date.now(),
            };
            await fetch("/timestamp", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Access-Control-Allow-Headers": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            a.href = "/search?v=" + url;
        } else {
            // Just navigate to search page using current video
            a.href = "/search";
        }
        a.click();
    });
});
