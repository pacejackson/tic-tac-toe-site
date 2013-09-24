__author__ = 'andrewpboyle'

PLAYER_X = 1
PLAYER_O = -1
NO_PLAYER = 0
PLAYER_CHARS = [' ', 'X', 'O']
PLAYER_MAP = {
    PLAYER_CHARS[PLAYER_X]: PLAYER_X,
    PLAYER_CHARS[PLAYER_O]: PLAYER_O,
    PLAYER_CHARS[NO_PLAYER]: NO_PLAYER
}


def is_valid_player(p):
    return p == PLAYER_X or p == PLAYER_O or p == NO_PLAYER


def get_player_char(p):
    if not is_valid_player(p):
        raise Exception('{0} is not a valid player.'.format(p))
    return PLAYER_CHARS[p]


def get_player_from_char(player_char):
    if player_char not in PLAYER_MAP.keys():
        raise Exception('{0} is not a valid player char.'.format(player_char))
    return PLAYER_MAP[player_char]