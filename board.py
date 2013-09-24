__author__ = 'andrewpboyle'
import copy
from player import NO_PLAYER, is_valid_player, get_player_char


def result():
    return [NO_PLAYER for x in range(9)]


def _check_point_element(elem, elem_name):
    if type(elem) is not int:
        raise TypeError('Input {0} must be of type int.'.format(elem_name))
    if elem not in range(9):
        raise Exception('Input {0} must be between 0 and 9'.format(elem_name))


def _check_point(current_board, x, y):
    _check_point_element(x, 'x')
    _check_point_element(y, 'y')
    if (x + y) > 8:
        raise IndexError('x + y must be less than 9.')
    if current_board[x + y] != 0:
        raise Exception('Board at point ({0}, {1}) is already occupied.'.format(x, y))


def make_move(current_board, x, y, p):
    _check_point(current_board, x, y)
    if is_valid_player(p):
        raise Exception("Input player must = PLAYER_X or PLAYER_Y.")
    result = copy.deepcopy(current_board)
    result[x + y] = p
    if not is_valid(result):
        player_name = get_player_char(p)
        raise Exception('Move for {0} at ({0}, {1}) is invalid.'.format(player_name, x, y))
    return result


def is_valid(current_board):
    return sum(current_board) == 0