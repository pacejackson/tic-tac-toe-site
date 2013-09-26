__author__ = 'andrewpboyle'
from handlers.jsonhandler import JSONHandler
from game.game_board import has_won, get_index, is_full, make_move, get_board_state
from game.tic_tac_toe_ai import NO_MOVES
import config
import utils
import json
import logging
import datetime


class TicTacToeAPIHandler(JSONHandler):
    def get(self):
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')
        board = utils.string_to_list(self.request.get('board'))
        game_state = config.ONGOING
        message = 'Ongoing.'
        next_move_2d = NO_MOVES
        next_move_1d = get_index(next_move_2d[0], next_move_2d[1])
        if is_full(board):
            game_state, message = get_board_state(board)
        else:
            try:
                next_move_2d = utils.get_move(board, config.computer)
                next_move_1d = get_index(next_move_2d[0], next_move_2d[1])
                new_board = make_move(board, next_move_2d[0], next_move_2d[1], config.computer)
                game_state, message = get_board_state(new_board)
            except Exception as e:
                game_state, message = config.ERROR, e.message
        logging.error(game_state)
        result = {'move_2d_x': next_move_2d[0], 'move_2d_y': next_move_2d[1],
                  'move_1d': next_move_1d, 'game_state': game_state,
                  'message': message}
        self.render_json(result)

    '''
    def post(self):
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')

    def options(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

    '''