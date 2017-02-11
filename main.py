from flask import Flask

# this is our webapp object
app = Flask(__name__)

# set some app settings for convenience
app.debug = True
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True

app.run()
