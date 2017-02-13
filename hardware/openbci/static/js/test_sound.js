"use strict";

var ws = new WebSocket( 'ws://localhost:5001/data' )

var mode = 0; // 0 meditation, 1 adhd

ws.onmessage = function( e ) {
	/*
	looks like:
	'channel': channel,
	'power': {
		'delta': delta_power,
		'theta': theta_power,
		'alpha': alpha_power,
		'mu': mu_power,
		'smr': smr_power,
		'beta1': beta1_power,
		'beta2': beta2_power,
		'beta': beta_power,
		'gamma': gamma_power
		}
	}
	*/
	console.log('rcvd');
	if (true) {//(d.channel == '7') {
		var tmp = [];
		var data = JSON.parse( e.data );
		tmp[0] = parseFloat(data.power.delta).toFixed( 5 );
		tmp[1] = parseFloat(data.power.theta).toFixed( 5 );
		tmp[2] = parseFloat(data.power.alpha).toFixed( 5 );
		tmp[3] = parseFloat(data.power.mu).toFixed( 5 );
		tmp[4] = parseFloat(data.power.smr).toFixed( 5 );
		tmp[5] = parseFloat(data.power.beta1).toFixed( 5 );
		tmp[6] = parseFloat(data.power.beta2).toFixed( 5 );
		tmp[7] = parseFloat(data.power.beta).toFixed( 5 );
		tmp[8] = parseFloat(data.power.gamma).toFixed( 5 );
		update_measure(data.channel, tmp);
	}
}

var score = 0;// 100;
var tracks = [];
var num_tracks = 4;

var measured = [][]; // size 9
var bmin = [];
var bmax = [];

$(document).ready(function() {
	$('#score').change(function() {
		console.log('changed');
		var score = $('#score').val();
		tracks[0] = document.getElementById('track_0')
		tracks[1] = document.getElementById('track_1')
		tracks[2] = document.getElementById('track_2')
		tracks[3] = document.getElementById('track_3')
		// tracks[4] = document.getElementById('track_4')
		// tracks[5] = document.getElementById('track_5')
		// tracks[6] = document.getElementById('track_6')
		// tracks[7] = document.getElementById('track_7')
		// tracks[8] = document.getElementById('track_8')

		for (var i = 0; i < num_tracks; i++) {
			//var vol = (score / (100 * ((i + 1) / num_tracks))); // alternative method
			var vol = (score / (100 / num_tracks)) - (i);
			tracks[i].volume = Math.min(Math.max(vol, 0), 1.0);
		}
	});

	$('#bminbutton').click(function() {
		for (var i = 0; i < 9; i++) {
			bmin[i] = measured[0][i];
		}
		$('#bmin0').html(bmin[0]);
		$('#bmin1').html(bmin[1]);
		$('#bmin2').html(bmin[2]);
		$('#bmin3').html(bmin[3]);
		$('#bmin4').html(bmin[4]);
		$('#bmin5').html(bmin[5]);
		$('#bmin6').html(bmin[6]);
		$('#bmin7').html(bmin[7]);
		$('#bmin8').html(bmin[8]);
	});
	$('#bmaxbutton').click(function() {
		for (var i = 0; i < 9; i++) {
			bmax[i] = measured[0][i];
		}
		$('#bmax0').html(bmax[0]);
		$('#bmax1').html(bmax[1]);
		$('#bmax2').html(bmax[2]);
		$('#bmax3').html(bmax[3]);
		$('#bmax4').html(bmax[4]);
		$('#bmax5').html(bmax[5]);
		$('#bmax6').html(bmax[6]);
		$('#bmax7').html(bmax[7]);
		$('#bmax8').html(bmax[8]);
	});
	$('#validatebutton').click(function() {
		//update_measure([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});
	//update_measure([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	$('#meditationbutton').click(function() {
		mode = 0;
	});
	$('#adhdbutton').click(function() {
		mode = 1;
	});
});

function update_measure(channel, measurements) {
	console.log("update");
	for (var i = 0; i < 9; i++) {
		measured[channel][i] = measurements[i];
	}
	$('#m0').html(measured[channel][0]);
	$('#m1').html(measured[channel][1]);
	$('#m2').html(measured[channel][2]);
	$('#m3').html(measured[channel][3]);
	$('#m4').html(measured[channel][4]);
	$('#m5').html(measured[channel][5]);
	$('#m6').html(measured[channel][6]);
	$('#m7').html(measured[channel][7]);
	$('#m8').html(measured[channel][8]);

	score = (((measured[channel][1] + measured[channel][2]) / 2) / (measured[channel][7])) / (((bmax[1] + bmax[2]) / 2) / (bmax[7]))

	// adhd
	score = Math.abs(measured[3][2] - measured[10][2]) / ((measured[3][2] + measured[10][2]) / 2);
	$('#score').val(score);
}
