// create youtube player
var player;
function onYouTubePlayerAPIReady() {

 player = new YT.Player('player', {
   height: '390',
   width: '640',
   videoId: 'MS91knuzoOA',
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

// when video ends
function onPlayerStateChange(event) {
 if(event.data === 0) {
 player.loadVideoById('CxKWTzr-k6s');
 }
}

$(document).ready(function() {

});