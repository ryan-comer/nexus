from .bot import Bot, SETTING_TYPE
import pyautogui
import random
import time
import threading

name = 'Anti-AFK Bot'
description = 'Bot that presses w, a, s, d randomly at a random interval'
settings = [
    {
        'name': 'wait_time_min',
        'label': 'Minimum Wait Time',
        'description': 'Minimum wait time between key presses (seconds)',
        'type': SETTING_TYPE.NUMBER,
        'default': 5,
    },
    {
        'name': 'wait_time_max',
        'label': 'Maximum Wait Time',
        'description': 'Maximum wait time between key presses (seconds)',
        'type': SETTING_TYPE.NUMBER,
        'default': 20,
    }
]

# AFK bot class
class AFKBot(Bot):
    def __init__(self):
        super().__init__(name, description, settings)
        self.running = False

    def start(self):
        self.running = True
        self.thread_event = threading.Event()

        while self.running:
            # Randomly press W, A, S, or D at a random interval
            key = random.choice(['w', 'a', 's', 'd'])
            interval = random.uniform(self.get_setting_value('wait_time_min'), self.get_setting_value('wait_time_max'))
            pyautogui.keyDown(key)
            time.sleep(random.uniform(0.1, 0.5))
            pyautogui.keyUp(key)
            self.thread_event.wait(interval)

    def stop(self):
        self.running = False
        self.thread_event.set()