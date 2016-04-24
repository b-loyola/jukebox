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
  $('#success').text("Please wait, loading song...").show();
  $.ajax({
    method: 'get',
    url: window.location.pathname + '/songs/change/' + index, // <-- get '/rooms/:room_id/next'
    dataType: 'json'
  }).then(function success(result) {
    window.currentSongIndex = index;
    window.currentSong = result.song;
    $('#success').fadeOut(300);
    playVideo(result.song.url);
    $("#song_name").text(result.song.title);
  }, function errorAdd(err){
    $('#success').text("Could not load video, please try again.").show().delay(2500).fadeOut(300);
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
            $("<a />").addClass("song").attr("data-song-id", song.id).text(song.title)
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
      $('#success').text("Failed to start playlist, please make sure you have added songs.").show().delay(3200).fadeOut(300);
    });
  });

  $("#next-song, #previous-song").on("click", function() {
    changeSong(window.currentSongIndex + ($(this).attr('id') == "next-song" ? 1 : -1));
  });

  $("#playlist").on("click", ".song", function() {
    player.pauseVideo();
    $('#success').text("Please wait, loading song...").show();
    id = $(this).data("song-id");
    $.ajax({
      method: 'get',
      url: window.location.pathname + '/song/' + id,
      dataType: 'json'
    }).then(function success(result) {
      window.currentSongIndex = result.index;
      window.currentSong = result.song;
      playVideo(result.song.url);
      $('#success').fadeOut(300);
      $("#song_name").text(result.song.title);
      $("#start-play").hide();
    }, function errorPlay(err){
      $('#success').text("Failed to play song.").show().delay(3200).fadeOut(300);
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

  $('#text-friend').on("click", function() {

    var phoneNumber = $("#addPhone").val();
    $('#success').text("Please wait, texting your friend an invite").show();

    $.ajax({
      url: window.location.pathname + '/text', // <-- get '/rooms/:room_id/text'
      method: 'post',
      data: {phone_number: phoneNumber}
    }).then(function successPhone(result){

      $('#success').text("Invite sent to friend!").show().delay(2500).fadeOut(300);
      $("#addSong").val('');

    }, function errorAdd(err){
      $('#success').text("Failed to send text, please provide a different number").show().delay(2500).fadeOut(300);
    });

  });

});
