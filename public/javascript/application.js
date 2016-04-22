// create youtube player
var player;
function onYouTubePlayerAPIReady() {

  console.log("I'm ready");


}

function loadVideo(videoName) {

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoName,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// autoplay video
function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  console.log("inside onPlayerStateChange", event)
  if(event.data === 0) {
    playNextVideo();
  }
}

function playNextVideo() {
  console.log("inside playNextVideo")
  $.ajax({
    method: 'get',
    url: window.location.pathname + '/next', // <-- get '/rooms/:room_id/next'
    dataType: 'json',
    success: function(response) {
      // executed when AJAX call returns successfully

      $("#song_name").text(response["title"]);
      player.loadVideoById(response['video_id'] );
    }
  });
}


$(document).ready(function() {

  var songCounter = 0;

  $(".add-song").on("click", function() {

    var songUrl = $("#addSong").val();

    $.ajax({
      url: window.location.pathname,
      method: 'post',
      data: {link: songUrl}
    }).then(function successAdd(result){
      $('#success').text("Song added to queue");
      var songId = result.song.url;
      if(songCounter === 0){
        loadVideo(songId);
        songCounter++;
      } else {

      }

    }, function errorAdd(err){
      $('#success').text("Failed to add song, please try a different link");
    });
    
  });

});