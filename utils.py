__author__ = 'andrewpboyle'

import jinja2
import os
from game.tic_tac_toe_ai import get_move, NO_MOVES
from game.game_board import rotate_board, rotate_point
from google.appengine.api import memcache

template_dir = os.path.join(os.path.dirname(__file__), 'templates')

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(template_dir))


def get_next_move(board, player):
    key = 'BOARDS_{0}_{1}'.format(str(board), player)
    move = memcache.get(key)
    if move is None:
        move = get_move(board, player)
        memcache.set(key, move)
        r_board = board
        r_move = move
        for i in range(1, 4):
            r_board = rotate_board(r_board, 1)
            if r_move != NO_MOVES:
                r_move = rotate_point(r_move[0], r_move[1], 1)
            key = 'BOARDS_{0}_{1}'.format(str(r_board), player)
            memcache.set(key, r_move)
    return move