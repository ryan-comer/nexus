# Flask server for the backend of the application

from flask import Flask, request, jsonify
import os
import sys

app = Flask(__name__)

if __name__ == '__main__':
    # Get the port from the environment variable
    port = os.environ.get('BOT_HUB_PORT')

    if port is None:
        print('No port specified in the environment variable, please specify one')
        sys.exit(1)

    app.run(port=port, debug=True)