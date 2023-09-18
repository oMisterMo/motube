// Loads YT api
// e.g. <script src="https://www.youtube.com/iframe_api"> <script>
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
const WAIT_SECS = 5 * 1000;

async function getData() {
    const data = await fetch("/timestamp");
    const timestamp = await data.json();

    return timestamp;
}

function getVideoId(fullURL) {
    if (fullURL) {
        const url = new URL(fullURL);
        const videoId = url.searchParams.get("v");
        if (videoId) {
            // correct search format
            return videoId;
        }
    }
    return "2Z4m4lnjxkY"; // trolol (something went wrong)
}

async function onYouTubeIframeAPIReady() {
    const data = await getData();
    const { url, timestamp } = data;
    const videoId = getVideoId(url);

    player = new YT.Player("player", {
        height: "390",
        videoId,
        playerVars: {
            playsinline: 1,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
        },
    });

    let previous = null;
    let interval = null;

    player.addEventListener("onStateChange", event => {
        if (event.data == YT.PlayerState.PAUSED) {
            interval = setInterval(async () => {
                const data = await getData();
                const { timestamp } = data;
                if (timestamp !== previous) {
                    player.seekTo(timestamp);
                    console.log("seek to ", timestamp);
                }
                previous = timestamp;
            }, WAIT_SECS);
        }
        if (event.data == YT.PlayerState.PLAYING) {
            clearInterval(interval);
        }
    });
}

let done = false;
async function onPlayerReady(event) {
    const { timestamp } = await getData();
    if (timestamp) {
        player.seekTo(timestamp);
    }
    event.target.playVideo();
}
async function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        // setTimeout(stopVideo, 6000);
        done = true;
    }
    if (event.data == YT.PlayerState.PLAYING) {
        console.log("playing...");
    }
    if (event.data == YT.PlayerState.PAUSED) {
        console.log("paused...");
        const data = {
            timestamp: player.getCurrentTime(),
            modified_at: Date.now(),
        };
        await fetch("/timestamp", {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Access-Control-Allow-Headers": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    }
    if (event.data == YT.PlayerState.CUED) {
        console.log("cued...");
    }
}
async function onPlayerError(event) {
    console.error(event);
}
function stopVideo() {
    player.stopVideo();
}
