#!/usr/bin/env python

from open_bci_v3 import OpenBCIBoard

class FeatureExtraction:
	def __init__(self, serial_port):
		obci = OpenBCIBoard(port=serial_port, daisy=True)
		obci.start_streaming(self.handle_stream)

	def handle_stream(self, list):
		print(list.channel_data)

if __name__ == '__main__':
	FeatureExtraction('/dev/ttyUSB0')
