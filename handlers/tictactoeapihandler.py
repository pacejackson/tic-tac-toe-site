__author__ = 'andrewpboyle'
from handlers.jsonhandler import JSONHandler
from game.game_board import from_1d_char_array, has_won, get_index
from game.tic_tac_toe_ai import NO_MOVES
import config
import utils
import json


class TicTacToeAPIHandler(JSONHandler):
    def get(self):
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')
        board = self.request.get('board')
        next_move_2d = utils.get_move(board, config.computer)
        next_move_1d = get_index(next_move_2d[0], next_move_2d[1])
        game_state = 'ongoing'
        if next_move_2d == NO_MOVES:
            if has_won(board, config.computer):
                game_state = 'computer_wins'
            elif has_won(board, config.human):
                game_state = 'user_wins'
            else:
                game_state = 'cats_game'
        result = {'move_2d_x': next_move_2d[0], 'move_2d_y': next_move_2d[1],
                  'move_1d': next_move_1d, 'game_state': game_state}
        self.render_json(result)

    '''
    def post(self):
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')

    def options(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

    '''