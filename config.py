__author__ = 'andrewpboyle'

NO_PLAYER = 0
COMPUTER = -1
HUMAN = 1

INF = float('inf')
NEG_INF = float('-inf')
NO_MOVES = [-1, -1]

WINNING_PATTERNS = (0b111000000, 0b000111000, 0b000000111,  # rows
                    0b100100100, 0b010010010, 0b001001001,  # cols
                    0b100010001, 0b001010100)               # diags

ERROR = 'error'
CPU_WINS = 'cpu_wins'
USER_WINS = 'user_wins'
CATS_GAME = 'cats_game'
ONGOING = 'ongoing'