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
  // event.target.playVideo();
  // setTimeout(pauseVideo, 0.2);
}

var playerState = -1;
function onPlayerStateChange(event) {
  console.log(event);
  console.log(playerState);
  var currentTime = event.target.getCurrentTime();
  if (
    event.data == YT.PlayerState.PLAYING &&
    playerState != YT.PlayerState.PLAYING
  ) {
    playVideo(currentTime);
    playerState = YT.PlayerState.PLAYING;
  } else if (
    event.data == YT.PlayerState.PAUSED &&
    playerState != YT.PlayerState.PAUSED
  ) {
    pauseVideo(currentTime);
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

socket.on("play", (data) => {
  player.seekTo(data.time);
  player.playVideo();
  console.log("The user " + socket.id + " requested to play the video HTML");
});

socket.on("pause", (data) => {
  //player.seekTo(data.time);
  player.pauseVideo();
  console.log("The user " + socket.id + " requested to pause the video HTML");
});

function playVideo(currentTime) {
  console.log("Playing  at: " + currentTime);
  socket.emit("play", {
    time: currentTime,
  });
  player.playVideo();
}

function pauseVideo(currentTime) {
  console.log("Pausa2 at: " + currentTime);
  socket.emit("pause", {
    time: currentTime,
  });
  player.pauseVideo();
}
