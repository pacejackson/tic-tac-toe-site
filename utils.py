__author__ = 'andrewpboyle'

import config


def is_valid_player(player):
    """
    Check if the given player is a valid player value.

    @param player: an int representing the player.
    @return: True if player is a valid player value (config.COMPUTER,
    config.HUMAN, or config.NO_PLAYER.
    """
    return player == config.COMPUTER or player == config.HUMAN or player == config.NO_PLAYER


def get_opponent(player):
    """
    Get the opponent of the given player.

    @param player: int representation of the player who's opponent
    value you want to get.
    @return: returns the value of the player's opponent if player is
    a valid player value.  If not, it returns None.
    """
    if is_valid_player(player):
        return -player
    return None


def string_to_list(list_as_string):
    """
    Convert the given string that represents a list of numbers into
    a list of numbers.  Return the list.

    @param list_as_string: String representation of a list.
    @return: a list holding the int values represented in list_as_string.
    """
    #remove whitespace and slice off the '[' ']' characters.
    list_as_string = list_as_string.replace(' ', '')[1:-1]
    split_string = list_as_string.split(',')
    return [int(x) for x in split_string]