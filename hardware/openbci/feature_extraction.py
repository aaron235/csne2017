#!/usr/bin/env python

from open_bci_v3 import OpenBCIBoard
from scipy.fftpack import *
import numpy as np

class FeatureExtraction:
	def __init__(self, serial_port):
		self.stream_buf = [None] * 250 # length 250
		self.cur_buf_index = 0

		obci = OpenBCIBoard(port=serial_port, daisy=True)
		obci.start_streaming(self.handle_stream)

	def handle_stream(self, list):
		#print(list.channel_data)
		if (self.cur_buf_index > 249):
			self.process_fft()
			#print(self.stream_buf)
			self.stream_buf[0:124] = self.stream_buf[125:249]
			self.cur_buf_index = 125
		self.stream_buf[self.cur_buf_index] = list.channel_data[0]
		self.cur_buf_index += 1

	def process_fft(self):
		# x = np.array(self.stream_buf)
		# win = np.hamming(250)
		# x = (x * np.diag(win))
		
		# N = 250 # 250 Hz
		# T = 1.0 / 250.0
		# xf = np.linspace(0.0, 1.0/(2.0*T), N/2)
		# yf = fft(x)
		# plt.cla()
		# plt.plot(xf, 2.0/N * np.abs(yf[0:N/2]))
		# plt.pause(0.0001)

		# setup
		N = 250 # 250 samples per period
		T = 1 # period of 1s
		df = 1 / T

if __name__ == '__main__':
	FeatureExtraction('/dev/ttyUSB0')
