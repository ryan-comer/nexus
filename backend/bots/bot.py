# Enum for bot status
from enum import Enum

class BotStatus(Enum):
    STOPPED = 1
    RUNNING = 2

# Interface for bot classes
class Bot:
    def __init__(self, name, description):
        self.name = name
        self.description = description
        self.status = BotStatus.STOPPED

    def get_name(self):
        return self.name

    def get_description(self):
        return self.description

    def get_status(self):
        return self.status

    def start(self):
        raise NotImplementedError

    def stop(self):
        raise NotImplementedError