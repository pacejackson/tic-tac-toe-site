__author__ = 'andrewpboyle'

from game.game_board import new_board, make_move, to_2d_char_array
from game.tic_tac_toe_ai import get_move
import config

def print_board(board):
    char_board = to_2d_char_array(board)
    for line in char_board:
        print line

board = new_board()
print_board(board)
computer = config.computer
human = config.human
m = get_move(board, computer)
board = make_move(board, m[0], m[1], computer)
print_board(board)
board = make_move(board, 1, 1, human)
print_board(board)
m = get_move(board, computer)
board = make_move(board, m[0], m[1], computer)
print_board(board)
board = make_move(board, 0, 1, human)
print_board(board)
m = get_move(board, computer)
board = make_move(board, m[0], m[1], computer)
print_board(board)
board = make_move(board, 1, 0, human)
print_board(board)
m = get_move(board, computer)
board = make_move(board, m[0], m[1], computer)
print_board(board)
board = make_move(board, 2, 2, human)
print_board(board)
m = get_move(board, computer)
board = make_move(board, m[0], m[1], computer)
print_board(board)
