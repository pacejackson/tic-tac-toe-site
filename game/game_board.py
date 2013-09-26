__author__ = 'andrewpboyle'
import copy
import config
from itertools import chain
from game.game_player import NO_PLAYER, is_valid_player, get_player_char, get_player_from_char, get_opponent


WINNING_PATTERNS = (0b111000000, 0b000111000, 0b000000111,  # rows
                    0b100100100, 0b010010010, 0b001001001,  # cols
                    0b100010001, 0b001010100)               # diags


def get_index(x, y):
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


def _check_point_boundaries(x, y):
    _check_point_element(x, 'x')
    _check_point_element(y, 'y')

def _check_point(board, x, y):
    """
    Checks that each point element is correct, then checks that the point is
    an available space.  Throws an Exception if the point is already occupied.
    See _check_point_element for other exceptions the function may throw.

    board - the board state you want to check.
    x - the column where your point is in 2D.
    y - the row where your point is in 2D.
    """
    _check_point_boundaries(x, y)
    index = get_index(x, y)
    if board[index] != 0:
        raise Exception('Board at point ({0}, {1}) is already occupied.'.format(x, y))


def make_move(board, x, y, p):
    """
    Checks to see that the move is valid.  If it is, it returns a board representing
    the new board state.  If p is not a valid value for a game_player, it will raise an
    exception.  If the resulting board is invalid (say you have 3 X moves and 1 O
    move) it will also throw an exception.  See _check_point for any other exceptions
    the function may throw.

    board - the board state you want to check.
    x - the column where your point is in 2D.  0 <= x <= 2
    y - the row where your point is in 2D.  0 <= y <= 2
    p - the game_player making the move. p=1 or p=-1
    """
    _check_point(board, x, y)
    index = get_index(x, y)
    if not is_valid_player(p) or p == NO_PLAYER:
        raise Exception('Input p must = PLAYER_X or PLAYER_O.  p = {0}'.format(p))
    result = copy.deepcopy(board)
    result[index] = p
    if not is_valid(result):
        game_player_name = get_player_char(p)
        raise Exception('Move for {0} at ({1}, {2}) is invalid.'.format(game_player_name, x, y))
    return result


def is_valid(board):
    """
    Returns True if the board is valid.  The board is considered valid if the sum of
    all values in the board, sum, is such that -1 <= sum <= 1.

    board - the board state you want to check.
    """
    board_sum = sum(board)
    return -1 <= board_sum <= 1


def to_2d_char_array(board):
    """
    Returns a 2D char array representing the board. PLAYER_X's moves are represented
    by 'X', PLAYER_O's moves are represented by 'O', and empty spaces are represented
    by ' '.  See game_player.get_game_player_char for errors this function may raise.

    board - the board state you want to evaluate.
    """
    char_array = [get_player_char(p) for p in board]
    return [char_array[0:3], char_array[3:6], char_array[6:]]


def from_2d_char_array(char_array_board):
    """
    Returns a 1D board array based on the provided 2D char_array_board.  See
    game_player.get_game_player_from_char for errors this function may raise.

    char_array_board - a 2D char array representing the board.  It should be
    formatted like a result from to_2d_char_array
    """
    return [get_player_from_char(game_player_char) for game_player_char in chain(*char_array_board)]


def to_1d_char_array(board):
    """
    Returns a 1D char array representing the board. PLAYER_X's moves are represented
    by 'X', PLAYER_O's moves are represented by 'O', and empty spaces are represented
    by ' '.  See game_player.get_game_player_char for errors this function may raise.

    board - the board state you want to evaluate.
    """
    return [get_player_char(p) for p in board]


def from_1d_char_array(char_array_board, ):
    """
    Returns a 1D board array based on the provided 1D char_array_board.  See
    game_player.get_game_player_from_char for errors this function may raise.

    char_array_board - a 2D char array representing the board.  It should be
    formatted like a result from to_2d_char_array
    """
    return [get_player_from_char(game_player_char) for game_player_char in char_array_board]


def rotate_board(board, num_rotations):
    """
    Returns a new board that is equal to the supplied board rotated num_rotations
    times.  The board is rotated clockwise.

    board - the 1D board array you want to rotate.
    num_rotations - the number of rotations you want to do.
    """
    #We'll accept any number of rotations, but mod them by 4 since they are
    #equivalent
    num_rotations %= 4
    result = copy.deepcopy(board)
    for i in range(num_rotations):
        result[6], result[8] = result[8], result[6]
        result[8], result[2] = result[2], result[8]
        result[0], result[2] = result[2], result[0]
        result[3], result[7] = result[7], result[3]
        result[5], result[7] = result[7], result[5]
        result[1], result[5] = result[5], result[1]
    return result


def get_all_moves(board, player):
    """
    Returns a list of all moves available to the player in the current board.

    board - the board state you want to evaluate.
    player - the player you are getting moves for.
    """
    moves = []
    if not (has_won(board, player) or has_won(board, get_opponent(player))):
        for x in range(3):
            for y in range(3):
                index = get_index(x, y)
                if board[index] == NO_PLAYER:
                    moves += [(x, y)]
    return moves


def has_won(board, player):
    """
    Returns True if player has won, False if not.

    board - the board state you want to evaluate.
    player - the player you are checking
    """
    check = 0b000000000
    for x in range(3):
        for y in range(3):
            index = get_index(x, y)
            if board[index] == player:
                check |= (1 << index)
    for pattern in WINNING_PATTERNS:
        if pattern & check == pattern:
            return True
    return False


def get_state_at_point(board, x, y):
    """
    Returns the state of the board at the supplied x, y.  See _check_point_boundaries
    for errors this function may raise.  Will return either PLAYER_X,
    PLAYER_O, or NO_PLAYER

    board - the board state you want to evaluate
    x - the column where your point is in 2D.  0 <= x <= 2
    y - the row where your point is in 2D.  0 <= y <= 2
    """
    _check_point_boundaries(x, y)
    return board[get_index(x, y)]


def rotate_point(x, y, num_rotations):
    """
    Rotates the point given by x, y around the center of the board
    num_rotations times.  See _check_point_boundaries for errors this function may
    raise.

    x - the column where your point is in 2D.  0 <= x <= 2
    y - the row where your point is in 2D.  0 <= y <= 2
    num_rotations - the number of rotations you want to do.
    """
    _check_point_boundaries(x, y)
    r_x = x
    r_y = y
    num_rotations %= 4
    for i in range(num_rotations):
        temp = r_x
        r_x = 2 - r_y
        r_y = temp
    return r_x, r_y


def is_empty(board):
    """
    Returns True if the board is empty. i.e. in is equal to a new_board()
    """
    return board == new_board()

def is_full(board):
    """
    Returns True if the board is full.  i.e. there are no empty spaces.
    """
    return 0 not in board

def get_board_state(board):
    """
    Returns a tuple with the form (board_state, message)
    """
    if not is_valid(board):
        return config.ERROR, 'The given board is not valid.'
    if has_won(board, config.computer):
        return config.CPU_WINS, 'Computer wins.'
    elif has_won(board, config.human):
        return config.USER_WINS, 'User wins.'
    elif is_full(board):
        return config.CATS_GAME, "Cat's game"
    return config.ONGOING, 'Ongoing.'