__author__ = 'andrewpboyle'

import jinja2
import os
import config

template_dir = os.path.join(os.path.dirname(__file__), 'templates')

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(template_dir))


def is_valid_player(player):
    return player == config.COMPUTER or player == config.HUMAN or player == config.NO_PLAYER


def get_opponent(player):
    if is_valid_player(player):
        return -player
    return None


def string_to_list(list_as_string):
    """
    Convert the given string that represents a list of numbers into
    a list of numbers.  Return the list.

    list_as_string - String representation of a list.
    """
    #remove whitespace and slice off the '[' ']' characters.
    list_as_string = list_as_string.replace(' ', '')[1:-1]
    split_string = list_as_string.split(',');
    return [int(x) for x in split_string]