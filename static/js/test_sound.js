"use strict";

var score = 0;// 100;
var tracks = [];
var num_tracks = 9;

$(document).ready(function() {
	$('#score').change(function() {
		console.log('changed');
		var score = $('#score').val();
		tracks[0] = document.getElementById('track_0')
		tracks[1] = document.getElementById('track_1')
		tracks[2] = document.getElementById('track_2')
		tracks[3] = document.getElementById('track_3')
		tracks[4] = document.getElementById('track_4')
		tracks[5] = document.getElementById('track_5')
		tracks[6] = document.getElementById('track_6')
		tracks[7] = document.getElementById('track_7')
		tracks[8] = document.getElementById('track_8')

		for (var i = 0; i < num_tracks; i++) {
			//var vol = (score / (100 * ((i + 1) / num_tracks))); // alternative method
			var vol = (score / (100 / num_tracks)) - (i);
			tracks[i].volume = Math.min(Math.max(vol, 0), 1.0);
		}
	});
});
