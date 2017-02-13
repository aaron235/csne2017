"use strict";

var ws = new WebSocket( 'ws://localhost:5001/data' )

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
	e.data = d;
	if (d.channel == 7) {
		var tmp = [];
		tmp[0] = d.power.delta;
		tmp[1] = d.power.theta;
		tmp[2] = d.power.alpha;
		tmp[3] = d.power.mu;
		tmp[4] = d.power.smr;
		tmp[5] = d.power.beta1;
		tmp[6] = d.power.beta2;
		tmp[7] = d.power.beta;
		tmp[8] = d.power.gamma;
		update_measure(tmp);
	}
}

var score = 0;// 100;
var tracks = [];
var num_tracks = 4;

var measured = []; // size 9
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
			bmin[i] = measured[i];
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
			bmax[i] = measured[i];
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
		update_measure([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});
	//update_measure([1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

function update_measure(measurements) {
	console.log("update");
	for (var i = 0; i < 9; i++) {
		measured[i] = measurements[i];
	}
	$('#m0').html(measured[0]);
	$('#m1').html(measured[1]);
	$('#m2').html(measured[2]);
	$('#m3').html(measured[3]);
	$('#m4').html(measured[4]);
	$('#m5').html(measured[5]);
	$('#m6').html(measured[6]);
	$('#m7').html(measured[7]);
	$('#m8').html(measured[8]);

	score = (((measured[1] + measured[2]) / 2) / (measured[7])) / (((bmax[1] + bmax[2]) / 2) / (bmax[7]))
	$('#score').val(score);
}
