from .bot import Bot
import pyautogui
import random
import time
import threading

name = 'AFK Bot'
description = 'Bot that sends an AFK message to users who mention you while you are away.'

# AFK bot class
class AFKBot(Bot):
    def __init__(self):
        super().__init__(name, description)
        self.running = False

    def start(self):
        self.running = True
        self.thread_event = threading.Event()

        while self.running:
            # Randomly press W, A, S, or D at a random interval
            key = random.choice(['w', 'a', 's', 'd'])
            interval = random.uniform(5, 20)
            pyautogui.keyDown(key)
            time.sleep(random.uniform(0.1, 0.5))
            pyautogui.keyUp(key)
            self.thread_event.wait(interval)

    def stop(self):
        self.running = False
        self.thread_event.set()