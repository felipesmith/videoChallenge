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
    playerVars: { loop: 1, origin: "https://videomatch.herokuapp.com/" },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  event.target.pauseVideo();
}

var playerState = -1;
var previousState = -1;
function onPlayerStateChange(event) {
  console.log(event.data);
  var currentTime = event.target.getCurrentTime();
  if (event.data == YT.PlayerState.PLAYING && playerState != YT.PlayerState.PLAYING || event.data == YT.PlayerState.PAUSED && previousState == YT.PlayerState.BUFFERING) {
    playVideo(currentTime);
    previousState = playerState;
    playerState = YT.PlayerState.PLAYING;
  } else if (event.data == YT.PlayerState.PAUSED && playerState != YT.PlayerState.PAUSED) {
    pauseVideo(currentTime);
    previousState = playerState;
    playerState = YT.PlayerState.PAUSED;
  } else if (event.data == YT.PlayerState.ENDED) {
    player.playVideo();
    playerState = YT.PlayerState.PLAYING;
  }
  previousState = event.data;
}

const socket = io.connect();

window.onclose = function () {
  socket.disconnect();
};

socket.on("play", data => {
  player.seekTo(data.time);
  player.playVideo();
});

socket.on("pause", data => {
  //player.seekTo(data.time);
  player.pauseVideo();
});

function playVideo(currentTime) {
  socket.emit("play", {
    time: currentTime
  });
  player.playVideo();
}

function pauseVideo(currentTime) {
  socket.emit("pause", {
    time: currentTime
  });
  player.pauseVideo();
}