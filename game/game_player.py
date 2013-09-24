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
    """
    Returns True if p is a valid player value.  p is a valid player value
    if p = PLAYER_X, p = PLAYER_O, or p = NO_PLAYER

    p - the player value you want to validate.
    """
    return p == PLAYER_X or p == PLAYER_O or p == NO_PLAYER


def get_player_char(p):
    """
    Returns the char representation of p if p is a valid player.  If p
    is not a valid player, the function will raise an exception.

    p - the player value you want to get the char value for.  The mapping is
    PLAYER_X:  'X'
    PLAYER_Y:  'Y'
    NO_PLAYER: ' '
    """
    if not is_valid_player(p):
        raise Exception('{0} is not a valid player.'.format(p))
    return PLAYER_CHARS[p]


def get_player_from_char(player_char):
    """
    Returns the player value represented by player_char.  If player_char
    is not a valid representation of a player, the function will raise an
    exception.  The mapping is
    'X': PLAYER_X
    'Y': PLAYER_Y
    ' ': NO_PLAYER
    """
    if player_char not in PLAYER_MAP.keys():
        raise Exception('{0} is not a valid player char.'.format(player_char))
    return PLAYER_MAP[player_char]


def get_opponent(player):
    """
    Returns the given players opponent if they are a valid player.  A player's
    opponent = -player.

    player - the player who's opponent you want to get.
    """
    if is_valid_player(player):
        return -player