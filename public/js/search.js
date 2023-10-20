injectYoutubeAPI();

let done = false; // Do not really need...!
let player;

const VIDEO_OFFSET = 2; // Extra time added to video in seconds
const WAIT_MS = 500; // Youtube player plays videos in seconds, send interval 2 times a second
const intervals = [];
const back = document.querySelector("#back");
const fetchButton = document.querySelector("#mo");
const table = document.querySelector("#history-body");

setTableData();

back.addEventListener("click", async () => {
    clearAllIntervals();
    player.stopVideo();
    await putData(); // set playing false, update time
    window.location.href = "/";
});
fetchButton.addEventListener("click", async () => {
    setTableData();
});

console.log("isMobile: ", isMobile());
if (isMobile()) {
    back.classList.add("bottom-2");
} else {
    back.classList.add("top-2");
}

async function onYouTubeIframeAPIReady() {
    const data = await getData();
    const { url, timestamp, playing, created_at, modified_at } = data;
    const videoId = getVideoId(url);
    const domain = "http://localhost:3000";
    updateTimestamps(created_at, modified_at);
    // const domain = "127.0.0.1";

    player = new YT.Player("player", {
        height: "390",
        videoId,
        // Query params
        playerVars: {
            start: timestamp + VIDEO_OFFSET,
            autoplay: playing ?? 1,
            mute: playing ?? 1,
            // playsinline: 1,
            // enablejsapi: 1, (injected automatically)
            // origin: domain, (injected automatically)
            // widgetid: 1 (injected automatically)
            // widget_referrer: domain,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
        },
    });

    player.addEventListener("onStateChange", event => {
        // PLAYING
        if (event.data == YT.PlayerState.PLAYING) {
            addInterval();
        }
        // PAUSED or ENDED
        if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
            clearAllIntervals();
        }
    });
    player.addEventListener("onReady", () => {
        if (playing) {
            player.playVideo();
        }
    });
}

/* Youtube */
function injectYoutubeAPI() {
    // Loads YT api
    // e.g. <script src="https://www.youtube.com/iframe_api"> <script>
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
async function onPlayerReady(event) {
    event.target.playVideo();
}
async function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        // setTimeout(stopVideo, 6000);
        done = true;
    }
    if (event.data == YT.PlayerState.PLAYING) {
        console.log("playing...");
        await putData(true);
    }
    if (event.data == YT.PlayerState.PAUSED) {
        console.log("paused...");
        await putData();
    }
    if (event.data == YT.PlayerState.CUED) {
        console.log("cued...");
    }
    if (event.data == YT.PlayerState.ENDED) {
        console.log("ended...");
        // interval === end time here
        await putData();
    }
}
async function onPlayerError(event) {
    console.error(event);
}
function stopVideo() {
    player.stopVideo();
}

/* Methods */
async function getData() {
    const data = await fetch("/timestamp");
    const timestamp = await data.json();

    return timestamp;
}

async function getTimestamps() {
    const data = await fetch("/timestamps");
    const timestamps = await data.json();

    return timestamps;
}

async function putData(isPlaying = false) {
    // CALLED 2 times a seconds, optimize here!

    const videoURL = player.getVideoUrl();
    const url = new URL(videoURL);
    const modified_at = Date.now();
    const data = {
        // url: videoURL,
        id: url.searchParams.get("v"),
        title: player.videoTitle,
        timestamp: Math.floor(player.getCurrentTime()),
        modified_at,
        playing: isPlaying,
    };

    updateModifiedAt(modified_at);

    await fetch("/timestamp", {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Headers": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    await fetch("/timestamps", {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Headers": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

function getVideoId(fullURL) {
    if (fullURL) {
        const url = new URL(fullURL);
        console.log(url);
        const videoId = url.searchParams.get("v");
        if (videoId) {
            // correct search format
            return videoId;
        }
    }
    return "2Z4m4lnjxkY"; // trolol (something went wrong)
}

function updateTimestamps(created_at, modified_at) {
    updateCreatedAt(created_at);
    updateModifiedAt(modified_at);
}

function updateCreatedAt(created_at) {
    const createdEl = document.querySelector("#created_at");
    if (createdEl) {
        createdEl.textContent = new Date(created_at).toUTCString();
    }
}

function updateModifiedAt(modified_at) {
    const modifiedEl = document.querySelector("#modified_at");
    if (modifiedEl) {
        modifiedEl.textContent = new Date(modified_at).toUTCString();
    }
}

async function addInterval() {
    const interval = setInterval(async () => {
        await putData(true);
    }, WAIT_MS);
    intervals.push(interval);
}

function clearAllIntervals() {
    while (intervals.length) {
        clearInterval(intervals.pop());
    }
}

function isMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ];

    return toMatch.some(toMatchItem => {
        return navigator.userAgent.match(toMatchItem);
    });
}

async function setTableData() {
    console.log("Update table data...");
    const data = await getTimestamps();
    console.log("data: ", data);

    for (let i = 0; i < data.length; i++) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const td2 = document.createElement("td");

        td.innerText = data[i]?.title || data[i]?.id || "Not found";
        td2.innerText = data[i]?.timestamp;

        tr.appendChild(td);
        tr.appendChild(td2);

        table.appendChild(tr);
    }
}
