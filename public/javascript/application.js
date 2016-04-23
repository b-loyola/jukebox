// create youtube player
var player;

// create playlist
window.playlist = [];
window.currentSongIndex = 0;

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
    changeSong(currentSongIndex + 1);
  }
}

function changeSong(index) {
  $.ajax({
    method: 'get',
    url: window.location.pathname + '/songs/change/' + index, // <-- get '/rooms/:room_id/next'
    dataType: 'json'
  }).then(function success(result) {
    window.currentSongIndex = index
    window.currentSong = result.song
    player.loadVideoById(result.song.url);
    $("#song_name").text(result.song.title);
  }, function errorAdd(err){
    $('#success').text("Could not load video, please try again.").show().delay(2500).fadeOut(300);
  });
  // player.loadVideoById(playlist);
}

function getPlaylist() {

  $.ajax({
    method: 'get',
    url: window.location.pathname + '/songs/all', // <-- get '/rooms/:room_id/songs/all'
    dataType: 'json',
    success: function(response) {
      playlist = response.playlist;
      console.log(playlist);
      var newPlaylist = "";
      $.each(playlist, function(i,song) {
        newPlaylist += "<li>" + song.title + "</li>";
      });
      $("#playlist").html(newPlaylist);

    }
  });
}


$(document).ready(function() {

  // checks for playlist
  getPlaylist();
  setInterval(function() {
    getPlaylist();
   }, 10000 );

  // starts player
  $("#start-play").on("click", function() {
    $.ajax({
      method: 'get',
      url: window.location.pathname + '/songs/current', // <-- get '/rooms/:room_id/current'
      dataType: 'json'
    }).then(function success(result) {
      window.currentSongIndex = result.index;
      window.currentSong = result.song;
      loadVideo(result.song.url);
      $("#song_name").text(result.song.title);
      getPlaylist();
      $("#start-play").hide();
    }, function errorPlay(err){
      $('#success').text("Failed to start playlist, please make sure you have added songs.").show().delay(3200).fadeOut(300);
    });
  });

  //adds songs to queue
  $("#add-song").on("click", function() {

    var songUrl = $("#addSong").val();
    $('#success').text("Please wait, adding song to queue").show();

    $.ajax({
      url: window.location.pathname,
      method: 'post',
      data: {link: songUrl}
    }).then(function successAdd(result){

      $('#success').text("Song added to queue").show().delay(2500).fadeOut(300);
      $("#addSong").val('');

    }, function errorAdd(err){
      $('#success').text("Failed to add song, please try a different link").show().delay(2500).fadeOut(300);
    });

  });

});
