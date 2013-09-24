__author__ = 'andrewpboyle'
import copy
from itertools import chain
from game.player import NO_PLAYER, is_valid_player, get_player_char, get_player_from_char


def _get_index(x, y):
    """
    Returns maps the 2D index (x, y) to a 1D index and returns it.
    The mapping is index = 3 * y + x.

    x - the column where your point is in 2D.
    y - the row where your point is in 2D.
    """
    return 3 * y + x


def new_board():
    """
    Returns an empty board.  Note that a board is a 1D array.  You should
    not change a board directly, rather you should call the make_move
    function on your current board to get the now board resulting from
    that move.
    """
    return [NO_PLAYER] * 9


def _check_point_element(elem, elem_name):
    """
    Checks that the point element (x or y) is an int and in a valid range.
    Throws a TypeError if is not an int and an IndexError if it is not in
    the correct range.

    elem - the point element (x or y) you are checking.
    elem_name - string you want to use to represent the elements name
    ex: 'x' or 'y'
    """
    if type(elem) is not int:
        raise TypeError('Input {0} must be of type int.'.format(elem_name))
    if elem not in range(3):
        raise IndexError('Input {0} must be between 0 and 2'.format(elem_name))


def _check_point(current_board, x, y):
    """
    Checks that each point element is correct, then checks that the point is
    an available space.  Throws an Exception if the point is already occupied.
    See _check_point_element for other exceptions the function may throw.

    current_board - the board state you want to check.
    x - the column where your point is in 2D.
    y - the row where your point is in 2D.
    """
    _check_point_element(x, 'x')
    _check_point_element(y, 'y')
    index = _get_index(x, y)
    if current_board[index] != 0:
        raise Exception('Board at point ({0}, {1}) is already occupied.'.format(x, y))


def make_move(current_board, x, y, p):
    """
    Checks to see that the move is valid.  If it is, it returns a board representing
    the new board state.  If p is not a valid value for a player, it will raise an
    exception.  If the resulting board is invalid (say you have 3 X moves and 1 O
    move) it will also throw an exception.  See _check_point for any other exceptions
    the function may throw.

    current_board - the board state you want to check.
    x - the column where your point is in 2D.  0 <= x <= 2
    y - the row where your point is in 2D.  0 <= y <= 2
    p - the player making the move. p=1 or p=-1
    """
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
    """
    Returns True if the board is valid.  The board is considered valid if the sum of
    all values in the board, sum, is such that -1 <= sum <= 1.

    current_board - the board state you want to check.
    """
    board_sum = sum(current_board)
    return -1 <= board_sum <= 1


def to_char_array(current_board):
    """
    Returns a 2D char array representing the board. PLAYER_X's moves are represented
    by 'X', PLAYER_O's moves are represented by 'O', and empty spaces are represented
    by ' '.  See player.get_player_char for errors this function may raise.

    current_board - the board state you want to evaluate.
    """
    char_array = [get_player_char(p) for p in current_board]
    return [char_array[0:3], char_array[3:6], char_array[6:]]

def from_char_array(char_array_board):
    """
    Returns a 1D board array based on the provided 2D char_array_board.  See
    player.get_player_from_char for errors this function may raise.

    char_array_board - a 2D char array representing the board.  It should be
    formatted like a result from to_char_array
    """
    return [get_player_from_char(player_char) for player_char in chain(*char_array_board)]