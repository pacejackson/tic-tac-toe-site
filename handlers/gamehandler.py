__author__ = 'andrewpboyle'

from handlers.handler import Handler


class GameHandler(Handler):
    """
    Basic handler for the game page.  It only renders the html template.
    """
    def get(self):
        template = 'game.html'
        self.render(template=template)