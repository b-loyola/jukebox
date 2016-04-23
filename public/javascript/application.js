// create youtube player
var player;

// create playlist
var playlist = [];

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
  $.ajax({
    method: 'get',
    url: window.location.pathname + '/songs/next', // <-- get '/rooms/:room_id/next'
    dataType: 'json'
  }).then(function success(result) {
    player.loadVideoById(result.song.url);
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
      playlist = response.playlist;
    }
  });
}




$(document).ready(function() {

  // starts player
  $("#start-play").on("click", function() {
    $.ajax({
      method: 'get',
      url: window.location.pathname + '/songs/current', // <-- get '/rooms/:room_id/current'
      dataType: 'json'
    }).then(function success(result) {
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