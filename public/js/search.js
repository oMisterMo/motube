injectYoutubeAPI();

let done = false; // Do not really need...!
let player;
const WAIT_SECS = 2 * 1000;

async function onYouTubeIframeAPIReady() {
    const data = await getData();
    const { url, timestamp, playing, created_at, modified_at } = data;
    const videoId = getVideoId(url);
    const domain = "http://localhost:3000";
    const createdEl = document.querySelector("#created_at");
    const modifiedEl = document.querySelector("#modified_at");
    createdEl?.textContent = new Date(created_at).toUTCString();
    modifiedEl?.textContent = new Date(modified_at).toUTCString();
    // const domain = "127.0.0.1";

    player = new YT.Player("player", {
        height: "390",
        videoId,
        // Query params
        playerVars: {
            start: timestamp,
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

    let previous = null;
    let interval = null;
    const intervals = [];

    player.addEventListener("onStateChange", event => {
        // PLAYING
        if (event.data == YT.PlayerState.PLAYING) {
            interval = setInterval(async () => {
                putData(true);
            }, WAIT_SECS);
            intervals.push(interval);
        }
        // PAUSED or ENDED
        if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
            // clearInterval(interval);
            while (intervals.length) {
                clearInterval(intervals.pop());
            }
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
        putData(true);
    }
    if (event.data == YT.PlayerState.PAUSED) {
        console.log("paused...");
        putData();
    }
    if (event.data == YT.PlayerState.CUED) {
        console.log("cued...");
    }
    if (event.data == YT.PlayerState.ENDED) {
        console.log("ended...");
        // interval === end time here
        putData();
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

async function putData(isPlaying = false) {
    const data = {
        timestamp: Math.floor(player.getCurrentTime()),
        modified_at: Date.now(),
        playing: isPlaying,
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
