# Enum for bot status
from enum import Enum

class BotStatus(Enum):
    STOPPED = 1
    RUNNING = 2

    def __json__(self):
        return self.name

class SETTING_TYPE(Enum):
    NUMBER = 1
    RANGE = 2

    def __json__(self):
        return self.name

# Interface for bot classes
class Bot:
    def __init__(self, name, description, settings):
        self.name = name
        self.description = description
        self.status = BotStatus.STOPPED
        self.settings = settings

        self.setting_values = {}
        for setting in settings:
            self.setting_values[setting['name']] = setting['default']

    def __json__(self):
        return {
            'name': self.name,
            'description': self.description,
            'status': self.status.name,
            'settings': [
                {
                    'name': setting['name'],
                    'label': setting['label'],
                    'description': setting['description'],
                    'type': setting['type'].name,
                    'default': setting['default'],
                    'value': self.setting_values[setting['name']]
                } for setting in self.settings
            ]
        }

    def get_name(self):
        return self.name

    def get_description(self):
        return self.description

    def get_settings(self):
        return self.settings

    def save_settings(self, settings):
        new_settings_map = {}
        for setting in settings:
            if setting['type'] == SETTING_TYPE.NUMBER.name:
                new_settings_map[setting['name']] = float(setting['value'])

        result = self.validate_settings(new_settings_map)
        if result is not None:
            return result

        self.setting_values = new_settings_map
        return None

    def get_setting_value(self, setting_name):
        return self.setting_values[setting_name]

    def get_status(self):
        return self.status

    def start(self):
        raise NotImplementedError

    def stop(self):
        raise NotImplementedError