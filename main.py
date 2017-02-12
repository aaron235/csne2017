from flask import Flask
from flask import render_template
from time import sleep as sleep
import json
from flask_uwsgi_websocket import GeventWebSocket


# this is our webapp object
app = Flask( __name__ )
websocket = GeventWebSocket(app)


# set some app settings for convenience
app.debug = True
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True


@app.route( '/' )
def main():
	return render_template( 'main.html' )


@app.route( '/breathe' )
def breathe():
	return render_template( 'breathe.html' )


@websocket.route('/data')
def echo(ws):
	ws.send( json.dumps(['foo', {'bar': ('baz', None, 1.0, 2)}]) )


if __name__ == '__main__':
	app.run( gevent=100 )
