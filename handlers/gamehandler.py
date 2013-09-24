__author__ = 'andrewpboyle'

from handlers.handler import Handler


class GameHandler(Handler):
    def get(self):
        template = 'game.html'
        self.render(template=template)