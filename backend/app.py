# Flask server for the backend of the application

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import sys
import signal
import threading
import time

from bot_manager import BotManager
from bots.afk_bot import AFKBot

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Create the bot manager
bot_manager = BotManager()

# Register the bots
bot_manager.add_bot(AFKBot())

# Route to get the list of bots
@app.route('/bots', methods=['GET'])
def get_bots():
    return jsonify(bot_manager.get_bots())

# Route to start a bot
@app.route('/bots/start', methods=['POST'])
def start_bot():
    bot_name = request.json['name']

    if bot_manager.start_bot(bot_name):
        return Response(status=200)
    else:
        return Response(status=404)

# Route to stop a bot
@app.route('/bots/stop', methods=['POST'])
def stop_bot():
    bot_name = request.json['name']

    if bot_manager.stop_bot(bot_name):
        return Response(status=200)
    else:
        return Response(status=404)

# Kill the server if it didn't receive a ping in the last 10 seconds
@app.route('/ping', methods=['GET'])
def ping():
    global last_ping_time
    last_ping_time = time.time()
    return Response(status=200)

def check_ping():
    global last_ping_time
    while True:
        time.sleep(1)
        print(time.time() - last_ping_time)
        if time.time() - last_ping_time > 10:
            print('No ping received in the last 10 seconds, killing the server')
            os.kill(os.getpid(), signal.SIGINT)

if __name__ == '__main__':
    # Get the port from the environment variable
    port = os.environ.get('BOT_HUB_PORT')

    if port is None:
        print('No port specified in the environment variable, please specify one')
        sys.exit(1)

    # Ping thread
    global last_ping_time
    last_ping_time = time.time()

    #ping_thread = threading.Thread(target=check_ping)
    #ping_thread.start()

    app.run(port=port, debug=False)