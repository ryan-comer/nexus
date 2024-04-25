from bots.bot import BotStatus
from threading import Thread
import json
import os

# Class to manage the bots
class BotManager():
    def __init__(self):
        self.bots = []
        self.bot_threads = {}

    # Add a bot to the list
    def add_bot(self, bot):
        self.bots.append(bot)

    # Get the list of bots
    def get_bots(self):
        bot_list = []

        for bot in self.bots:
            bot_list.append(bot.__json__())

        return bot_list

    # Start a bot
    def start_bot(self, bot_name):
        for bot in self.bots:
            if bot.get_name() == bot_name:
                # Start the bot in a new thread
                bot_thread = Thread(target=bot.start)
                self.bot_threads[bot_name] = bot_thread
                bot_thread.start()

                bot.status = BotStatus.RUNNING
                return True

        return False

    # Stop a bot
    def stop_bot(self, bot_name):
        for bot in self.bots:
            if bot.get_name() == bot_name and bot.status == BotStatus.RUNNING:
                bot.stop()

                # Wait for the bot thread to finish
                # Kill the thread if it doesn't finish in 10 seconds
                self.bot_threads[bot_name].join(10)
                if self.bot_threads[bot_name].is_alive():
                    return False
                del self.bot_threads[bot_name]

                bot.status = BotStatus.STOPPED
                return True

        return False

    def load_all_settings(self):
        # Check if the bot settings folder named 'bot_settings' exists
        if not os.path.exists('bot_settings'):
            return False

        # Load the bot settings from a file
        for bot in self.bots:
            bot_name = bot.get_name()
            if not os.path.exists(f'bot_settings/{bot_name}.json'):
                continue

            with open(f'bot_settings/{bot_name}.json', 'r') as f:
                settings = json.load(f)
                bot.save_settings(settings)

        return True

    # Save bot settings
    def save_settings(self, bot_name, settings):
        # Save the bot settings to the bot
        for bot in self.bots:
            if bot.get_name() == bot_name:
                result = bot.save_settings(settings)
                if result is not None:
                    return result

        # Check if the bot settings folder named 'bot_settings' exists
        if not os.path.exists('bot_settings'):
            os.makedirs('bot_settings')

        # Save the bot settings to a file
        with open(f'bot_settings/{bot_name}.json', 'w') as f:
            json.dump(settings, f)

        return None