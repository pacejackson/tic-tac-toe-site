__author__ = 'andrewpboyle'
import copy
from player import NO_PLAYER, is_valid_player, get_player_char


def _get_index(x, y):
    return 3 * y + x


def new_board():
    return [NO_PLAYER] * 9


def _check_point_element(elem, elem_name):
    if type(elem) is not int:
        raise TypeError('Input {0} must be of type int.'.format(elem_name))
    if elem not in range(9):
        raise Exception('Input {0} must be between 0 and 9'.format(elem_name))


def _check_point(current_board, x, y):
    _check_point_element(x, 'x')
    _check_point_element(y, 'y')
    index = _get_index(x, y)
    if index > 8:
        raise IndexError('x and y must both be less than 3.')
    if current_board[index] != 0:
        raise Exception('Board at point ({0}, {1}) is already occupied.'.format(x, y))


def make_move(current_board, x, y, p):
    _check_point(current_board, x, y)
    index = _get_index(x, y)
    if not is_valid_player(p) or p == NO_PLAYER:
        raise Exception('Input p must = PLAYER_X or PLAYER_O.  p = {0}'.format(p))
    result = copy.deepcopy(current_board)
    result[index] = p
    if not is_valid(result):
        player_name = get_player_char(p)
        raise Exception('Move for {0} at ({1}, {2}) is invalid.'.format(player_name, x, y))
    return result


def is_valid(current_board):
    board_sum = sum(current_board)
    return -1 <= board_sum <= 1


def get_char_array(current_board):
    char_array = [get_player_char(p) for p in current_board]
    return [char_array[0:3], char_array[3:6], char_array[6:]]