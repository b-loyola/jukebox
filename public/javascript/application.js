// create youtube player
var player;


// function onYouTubePlayerAPIReady() {
// }

// starts player and loads video
function loadVideo(videoCode) {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoCode,
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
  if(event.data === 0) {
    console.log("inside onPlayerStateChange");
    playNextVideo();
  }
}

function playNextVideo() {
  console.log("inside playNextVideo");
  $.ajax({
    method: 'get',
    url: window.location.pathname + '/songs/next', // <-- get '/rooms/:room_id/next'
    dataType: 'json',
  }).then(function success(result) {
    console.log("inside ajax playNextVideo success");
    console.log(result);
    player.loadVideoById(result.song.url);
    $("#song_name").text(result.song.title);
  }, function errorAdd(err){
    console.log("inside ajax playNextVideo error");
  });
}




$(document).ready(function() {

  var firstSong = true;

  $("#add-song").on("click", function() {

    var songUrl = $("#addSong").val();

    $.ajax({
      url: window.location.pathname,
      method: 'post',
      data: {link: songUrl}
    }).then(function successAdd(result){

      $('#success').text("Song added to queue");
      var songId = result.song.url;

      if(firstSong){
        loadVideo(songId);
        $("#song_name").text(result.song.title);
        firstSong = false;
      }

    }, function errorAdd(err){
      $('#success').text("Failed to add song, please try a different link");
    });
    
  });

});