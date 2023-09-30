// Initial fetch
$(async function () {
    console.log(" ready!");

    // Set button listener const
    const search = document.querySelector("#search");
    const searchButton = document.querySelector("#searchConfirm");
    const value = document.querySelector("#timestamp");
    const getData = async () => {
        const data = await fetch("/timestamp");
        const timestamp = await data.json();

        return timestamp;
    };
    const postData = async url => {
        // Update server file storing details of request
        const data = {
            url,
            timestamp: 0,
            created_at: Date.now(),
            modified_at: Date.now(),
        };
        // Not going to need this once I've got /timestamps working properly
        await fetch("/timestamp", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Access-Control-Allow-Headers": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        await fetch("/timestamps", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Access-Control-Allow-Headers": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    };

    const { playing } = await getData();
    const liveTag = document.querySelector("#live-tag");
    if (playing) {
        liveTag.classList.remove("hidden");
    }

    searchButton.addEventListener("click", async e => {
        e.preventDefault();

        // Get details
        const url = search.value;

        // Go to search page
        const a = document.createElement("a");
        if (url) {
            await postData(url);
            a.href = "/search?v=" + url;
        } else {
            // Just navigate to search page using current video
            a.href = "/search";
        }
        a.click();
    });
});
