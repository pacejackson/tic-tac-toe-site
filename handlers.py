__author__ = 'andrewpboyle'
import webapp2
import json
import config
import utils
import tictactoe
import os
import jinja2


template_dir = os.path.join(os.path.dirname(__file__), 'templates')

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(template_dir))

class Handler(webapp2.RequestHandler):
    """
    Base handler class.  Provides some convenience write and render methods.
    """
    def write(self, *a, **kw):
        self.response.write(*a, **kw)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))

    def render_str(self, template, **params):
        t = jinja_environment.get_template(template)
        return t.render(params)

    def render_json(self, values):
        """
        Render values as JSON, note that values will be converted to JSON by the
        method, so no need to do that before.

        values - values to be written as JSON by the response.
        """
        json_value = json.dumps(values)
        self.response.headers['Content-Type'] = "application/json"
        self.write(json_value)


class GameHandler(Handler):
    """
    Basic handler for the game page.  It only renders the html template.
    """
    def get(self):
        self.render(template='game.html')


class TicTacToeAPIHandler(Handler):
    """
    Handles requests to our TicTacToe API.  Parses the board provided by
    the request and returns the result.  It expects to receive the board as
    a one dimensional array of ints that stores the board in row-major order.
    It also expects that -1 represents spots used by the computer player, 1
    represents spots used by the human player, and 0 represents an empty
    spot.  It will return the response as JSON with the following properties:

    move: index of a 1d, row-major representation of the tic-tac-toe
    board where you will place the computer's next move.
    game_state: The state of the game.  It will be either 'error', 'cats_game',
    'cpu_wins', 'user_wins', or 'ongoing'.
    message: a message to go along with the game state.  This may be used to
    pass along error messages from the server.
    """
    def get(self):
        board = utils.string_to_list(self.request.get('board'))
        next_move = -1
        # check if they sent you a full board, this will happen if the player went first.
        if tictactoe.is_full_board(board):
            # if they did, just check the game state.
            game_state, message = tictactoe.get_game_state(board)
        else:
            try:
                next_move = tictactoe.get_move(board, config.COMPUTER)
                new_board = tictactoe.make_move(board, next_move, config.COMPUTER)
                game_state, message = tictactoe.get_game_state(new_board)
            except Exception as e:
                game_state, message = config.ERROR, e.message
        result = {'move': next_move, 'game_state': game_state, 'message': message}
        self.render_json(result)