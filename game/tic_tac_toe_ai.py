__author__ = 'andrewpboyle'
from game_board import make_move
from collections import namedtuple
import config

INF = float('inf')
NEG_INF = float('-inf')
winning_patterns = (0b111000000, 0b000111000, 0b000000111,  # rows
                    0b100100100, 0b010010010, 0b001001001,  # cols
                    0b100010001, 0b001010100)               # diags

minmax_result = namedtuple('minmax_result', ['score', 'x', 'y'])


def get_move(board, player):
    """
    Get the best move (x, y) for the given player based on the provided board.

    board - a 1D array as generated by the game_board module representing the
    current tic-tac-toe board.
    player - the (int) value of the player looking to get the best move possible.
    """
    result = _minmax(board, 2, player, INF, NEG_INF)
    return result.x, result.y


def _minmax(board, depth, player, alpha, beta):
    """
    I researched the algorithm for the tic-tac-toe ai here:
    http://www.ntu.edu.sg/home/ehchua/programming/java/JavaGame_TicTacToe_AI.html
    Additional research at :
    http://en.wikipedia.org/wiki/Minimax#Minimax_algorithm_with_alternate_moves
    http://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
    """
    pass