__author__ = 'andrewpboyle'

PLAYER_X = 1
PLAYER_O = -1
NO_PLAYER = 0


def is_valid_player(p):
    return p == PLAYER_X or p == PLAYER_O or p == NO_PLAYER


def get_player_char(p):
    if not is_valid_player(p):
        raise Exception('{0} is not a valid player.'.format(p))
    char_map = [' ', 'X', 'O']
    return char_map[p]