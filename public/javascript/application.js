// create playlist
var playlist = ["MS91knuzoOA", "CxKWTzr-k6s", "8Pa9x9fZBtY"];


// create youtube player
var player;
function onYouTubePlayerAPIReady() {

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: playlist[0],
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

// initialize song counter
// var songCounter = 1;

// when video ends
// function onPlayerStateChange(event) {
//   if(event.data === 0) {
  
//    player.loadVideoById(getNextVideoID() );

//   }
// }
// --------------------------
function onPlayerStateChange(event) {
  if(event.data === 0) {
    playNextVideo();
  }
}

function playNextVideo() {
  $.ajax({
    method: 'get',
    url: window.location.pathname + '/next', // <-- get '/rooms/:room_id/next'
    dataType: 'json',
    success: function(response) {
      // executed when AJAX call returns successfully

      // TODO: Here you should use the song title and display it response["title"]
      $("#song_name").text(response["title"]);
      player.loadVideoById(response['video_id'] );
    }
  });
}
// ----------------------------
// function getNextVideoID() {
//  if(songCounter > playlist.length -1) {
//    songCounter = 0;
//  };
//  var nextSong = playlist[songCounter];
//  songCounter++;
//  return nextSong;
// };

$(document).ready(function() {

  $(".add-song").on("click", function() {

    var songUrl = $("#addSong").val();

    $.post(window.location.pathname, { link: songUrl },
      // success result comes here
      // update library list with result
      function(result) { console.log(result["title"]);
    })
    .done(function() {
      document.getElementById("success").innerHTML = "Song added to queue";
    })
    .fail(function() {
      document.getElementById("success").innerHTML = "Failed to add song, please try a different url";
    })
    ;
    
  });

});