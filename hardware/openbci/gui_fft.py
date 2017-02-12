#!/usr/bin/env python

from flask import Flask
from flask_uwsgi_websocket import GeventWebSocket
import pexpect
import os
import numpy as np
from multiprocess import Queue, Process
import json

FREQ = np.array([
	0.0,
	0.9765625,
	1.953125,
	2.9296875,
	3.90625,
	4.8828125,
	5.859375,
	6.8359375,
	7.8125,
	8.7890625,
	9.765625,
	10.7421875,
	11.71875,
	12.6953125,
	13.671875,
	14.6484375,
	15.625,
	16.601562,
	17.578125,
	18.554688,
	19.53125,
	20.507812,
	21.484375,
	22.460938,
	23.4375,
	24.414062,
	25.390625,
	26.367188,
	27.34375,
	28.320312,
	29.296875,
	30.273438,
	31.25,
	32.226562,
	33.203125,
	34.179688,
	35.15625,
	36.132812,
	37.109375,
	38.085938,
	39.0625,
	40.039062,
	41.015625,
	41.992188,
	42.96875,
	43.945312,
	44.921875,
	45.898438,
	46.875,
	47.851562,
	48.828125,
	49.804688,
	50.78125,
	51.757812,
	52.734375,
	53.710938,
	54.6875,
	55.664062,
	56.640625,
	57.617188,
	58.59375,
	59.570312,
	60.546875,
	61.523438,
	62.5,
	63.476562,
	64.453125,
	65.42969,
	66.40625,
	67.38281,
	68.359375,
	69.33594,
	70.3125,
	71.28906,
	72.265625,
	73.24219,
	74.21875,
	75.19531,
	76.171875,
	77.14844,
	78.125,
	79.10156,
	80.078125,
	81.05469,
	82.03125,
	83.00781,
	83.984375,
	84.96094,
	85.9375,
	86.91406,
	87.890625,
	88.86719,
	89.84375,
	90.82031,
	91.796875,
	92.77344,
	93.75,
	94.72656,
	95.703125,
	96.67969,
	97.65625,
	98.63281,
	99.609375,
	100.58594,
	101.5625,
	102.53906,
	103.515625,
	104.49219,
	105.46875,
	106.44531,
	107.421875,
	108.39844,
	109.375,
	110.35156,
	111.328125,
	112.30469,
	113.28125,
	114.25781,
	115.234375,
	116.21094,
	117.1875,
	118.16406,
	119.140625,
	120.11719 ])

app = Flask( name )
ws = GeventWebSocket( app )

class GuiFft:
	def __init__(self):
		self.printCount = 0
		self.printNumber = 10
		self.q = Queue()
		print("hi")
		obci_gui = '/home/pico/src/OpenBCI_GUI/OpenBCI_GUI/application.linux64/OpenBCI_GUI'
		proc = pexpect.spawn(obci_gui, cwd=os.path.dirname(obci_gui))
		
		data = np.zeros(124)

		while True:
			try:
				proc.expect('\n')
				line = proc.before.rstrip().decode('utf-8')
				if line == "----new_chan_data----":
					proc.expect('\n')
					channel = int(proc.before.rstrip().decode('utf-8'))
					i = 0
					while (i < 124):
						proc.expect('\n')
						data_maybe = str(proc.before.rstrip().decode('utf-8'))
						if (data_maybe[0] == '&'):
							data[i] = float(data_maybe[1:])  # float(proc.before.rstrip().decode('utf-8'))
							i += 1
					self.process_fft(channel, data, FREQ)
			except pexpect.EOF:
				break
		print("shutdown!")

	def process_fft(self, channel, data, freq):
		q.put_nowait( power_fft( self, channel, data, freq ) )
		# if ( self.printCount == 0 ):
		#	print( self.power_fft(channel, data, freq))
		#	self.printCount += 1
		# elif ( self.printCount == self.printNumber ):
		#	self.printCount = 0
		# else:
		#	self.printCount += 1

	def power_fft(self, channel, data, freq):
		# indices corresponding to:
		# Gamma (<4Hz)
		# Delta (4-7)
		# Alpha (8-15)
		# Mu (7.5-12.5)
		# SMR (13-15)
		# Beta1 (16-20)
		# Beta2 (20-31)
		# Gamma (32-100)
		delta_power = np.average(np.abs(data[freq < 4])**2)
		theta_power = np.average(np.abs(data[(4 < freq) & (freq < 7)])**2)
		alpha_power = np.average(np.abs(data[(8 < freq) & (freq < 15)])**2)
		mu_power = np.average(np.abs(data[(7.5 < freq) & (freq < 12.5)])**2)
		smr_power = np.average(np.abs(data[(13 < freq) & (freq < 15)])**2)
		beta1_power = np.average(np.abs(data[(16 < freq) & (freq < 20)])**2)
		beta2_power = np.average(np.abs(data[(20 < freq) & (freq < 31)])**2)
		beta_power = np.average(np.abs(data[(16 < freq) & (freq < 31)])**2)
		gamma_power = np.average(np.abs(data[(32 < freq) & (freq < 100)])**2)
		return {
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

eegData = GuiFft()

@ws.route( '/data' )
def data( socket ):
	while True:
		if not eegData.q.empty():
			socket.send( json.dumps( q.get() ) )
			  

if __name__ == '__main__':
	app.run( gevent=100 )
	

