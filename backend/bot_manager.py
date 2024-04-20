from bots.bot import BotStatus
from threading import Thread

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
            bot_list.append({
                'name': bot.get_name(),
                'description': bot.get_description(),
                'status': bot.get_status().name
            })

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
            if bot.get_name() == bot_name:
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