__author__ = 'andrewpboyle'
from handlers.jsonhandler import JSONHandler
from game.game_board import get_index, is_full, make_move, get_board_state
from game.tic_tac_toe_ai import NO_MOVES
import config
import utils


class TicTacToeAPIHandler(JSONHandler):
    """
    Handles requests to our TicTacToe API.  Parses the board provided by
    the request and returns the result.  It expects to receive the board as
    a one dimensional array of ints that stores the board in row-major order.
    It also expects that -1 represents spots used by the computer player, 1
    represents spots used by the human player, and 0 represents an empty
    spot.  It will return the response as JSON with the following properties:
    next_move_2d_x: the row where you will place the computer's next move.
    next_move_2d_y: the column where you will place the computer's next move.
    next_move_1d: index of a 1d, row-major representation of the tic-tac-toe
    board where you will place the computer's next move.
    game_state: The state of the game.  It will be either 'error', 'cats_game',
    'cpu_wins', 'user_wins', or 'ongoing'.
    message: a message to go along with the game state.  This may be used to
    pass along error messages from the server.
    """
    def get(self):
        board = utils.string_to_list(self.request.get('board'))
        game_state = config.ONGOING
        message = 'Ongoing.'
        next_move_2d = NO_MOVES
        next_move_1d = get_index(next_move_2d[0], next_move_2d[1])
        # check if they sent you a full board, this will happen if the player went first.
        if is_full(board):
            # if they did, just check the game state.
            game_state, message = get_board_state(board)
        else:
            try:
                next_move_2d = utils.get_next_move(board, config.computer)
                next_move_1d = get_index(next_move_2d[0], next_move_2d[1])
                new_board = make_move(board, next_move_2d[0], next_move_2d[1], config.computer)
                game_state, message = get_board_state(new_board)
            except Exception as e:
                game_state, message = config.ERROR, e.message
        result = {'move_2d_x': next_move_2d[0], 'move_2d_y': next_move_2d[1],
                  'move_1d': next_move_1d, 'game_state': game_state,
                  'message': message}
        self.render_json(result)