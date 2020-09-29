var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var video = document.querySelector("video");
var playerStatus = -1;

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: "dQw4w9WgXcQ",
    playerVars: { loop: 1 },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  event.target.pauseVideo();
}

var playerState = -1;
function onPlayerStateChange(event) {
  console.log(event);
  if (
    event.data == YT.PlayerState.PLAYING &&
    playerState != YT.PlayerState.PLAYING
  ) {
    playVideo();
    playerState = YT.PlayerState.PLAYING;
  } else if (
    event.data == YT.PlayerState.PAUSED &&
    playerState != YT.PlayerState.PAUSED
  ) {
    pauseVideo();
    playerState = YT.PlayerState.PAUSED;
  } else if (event.data == YT.PlayerState.ENDED) {
    player.playVideo();
    playerState = YT.PlayerState.PLAYING;
  }
}

const socket = io.connect();

window.onclose = function () {
  socket.disconnect();
};

socket.on("play", () => {
  player.playVideo();
  console.log("The user " + socket.id + " requested to play the video HTML");
});

socket.on("pause", () => {
  player.pauseVideo();
  console.log("The user " + socket.id + " requested to pause the video HTML");
});

function playVideo() {
  console.log("Playing");
  socket.emit("play");
  player.playVideo();
}

function pauseVideo() {
  console.log("Pausa2");
  socket.emit("pause");
  player.pauseVideo();
}
