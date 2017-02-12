from flask import Flask
from flask import render_template
from time import sleep as sleep
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


@websocket.route( '/data' )
def data( socket ):
	while True:
		socket.send( "lol" )
		sleep( 1 )


if __name__ == '__main__':
	app.run( gevent=100 )
