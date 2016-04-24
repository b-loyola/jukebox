// create youtube player
window.player = null;

// create playlist
window.playlist = [];
window.currentSongIndex = 0;
window.currentSong = null;
window.playerLoaded = false;

// starts player and loads video
function loadVideoAndPlayer(videoCode) {
  window.player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoCode,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  window.playerLoaded = true;
}

function playVideo(videoCode) {
  if (window.playerLoaded) {
    window.player.loadVideoById(videoCode);
  } else {
    loadVideoAndPlayer(videoCode);
  }
}

function pauseVideo() {
  if (window.playerLoaded) {
    window.player.pauseVideo();
  }
}

// autoplay video
function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if(event.data === 0) {
    changeSong(currentSongIndex + 1);
  }
}

function changeSong(index) {
  player.pauseVideo();
  $('#success').text("Please wait, loading song...");
  $.ajax({
    method: 'get',
    url: window.location.pathname + '/songs/change/' + index, // <-- get '/rooms/:room_id/next'
    dataType: 'json'
  }).then(function success(result) {
    window.currentSongIndex = index;
    window.currentSong = result.song;
    $('#success').text("");
    playVideo(result.song.url);
    $("#song_name").text(result.song.title);
  }, function errorAdd(err){
    $('#success').text("Could not load video, please try again.");
  });
}

function getPlaylist() {

  $.ajax({
    method: 'get',
    url: window.location.pathname + '/songs/all', // <-- get '/rooms/:room_id/songs/all'
    dataType: 'json',
    success: function(response) {
      window.playlist = response.playlist;
      $newPlaylist = $("<ul />");
      $.each(playlist, function(i,song) {
        $newPlaylist.append(
          $("<li />").append(
            $("<a />").addClass("song list-group-item").attr("data-song-id", song.id).text(song.title)
          )
        );
      });
      $("#playlist").html($newPlaylist.html());
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
      playVideo(result.song.url);
      $("#song_name").text(result.song.title);
      getPlaylist();
      $("#start-play").hide();
    }, function errorPlay(err){
      $('#success').text("Failed to start playlist, please make sure you have added songs.");
    });
  });

  $("#next-song, #previous-song").on("click", function() {
    changeSong(window.currentSongIndex + ($(this).attr('id') == "next-song" ? 1 : -1));
  });

  $("#playlist").on("click", ".song", function() {
    pauseVideo();
    $('#success').text("Please wait, loading song...");
    id = $(this).data("song-id");
    $.ajax({
      method: 'get',
      url: window.location.pathname + '/song/' + id,
      dataType: 'json'
    }).then(function success(result) {
      window.currentSongIndex = result.index;
      window.currentSong = result.song;
      playVideo(result.song.url);
      $('#success').text("");
      $("#song_name").text(result.song.title);
      $("#start-play").hide();
    }, function errorPlay(err){
      $('#success').text("Failed to play song.");
    });
  });

  //adds songs to queue
  $("#add-song").on("click", function() {

    var songUrl = $("#addSong").val();
    $('#success').text("Please wait, adding song to queue");

    $.ajax({
      url: window.location.pathname,
      method: 'post',
      data: {link: songUrl}
    }).then(function successAdd(result){

      $('#success').text("Song added to queue");
      $("#addSong").val('');

    }, function errorAdd(err){
      $('#success').text("Failed to add song, please try a different link");
    });
  });

  $('#text-friend').on("click", function() {

    var phoneNumber = $("#addPhone").val();
    $('#success').text("Please wait, texting your friend an invite");

    $.ajax({
      url: window.location.pathname + '/text', // <-- get '/rooms/:room_id/text'
      method: 'post',
      data: {phone_number: phoneNumber}
    }).then(function successPhone(result){

      $('#success').text("Invite sent to friend!").delay(2500);
      $("#addSong").val('');

    }, function errorAdd(err){
      $('#success').text("Failed to send text, please provide a different number");
    });

  });

});
