__author__ = 'andrewpboyle'

import unittest
from game.game_player import NO_PLAYER, PLAYER_O, PLAYER_X
from game.game_board import new_board, make_move, to_char_array, from_char_array, has_won, get_all_moves, rotate_board


class TestBoard(unittest.TestCase):
    def test_new_board(self):
        expected_board = [NO_PLAYER, NO_PLAYER, NO_PLAYER,
                          NO_PLAYER, NO_PLAYER, NO_PLAYER,
                          NO_PLAYER, NO_PLAYER, NO_PLAYER]
        self.assertEquals(expected_board, new_board(), 'Test new_board().')

    def test_make_move_invalid(self):
        my_board = new_board()
        moves = [
            (my_board, -1, 0, PLAYER_O),
            (my_board,  0, -1, PLAYER_O),
            (my_board, 10, 0, PLAYER_O),
            (my_board,  0, 10, PLAYER_O),
            (my_board,  0, 0, 4),
            (my_board,  0, 0, 'X'),
            (my_board, 3, 3, PLAYER_O),
            (my_board, 5, 5, PLAYER_O)
        ]
        for move in moves:
            self.assertRaises(Exception, make_move, move)

    def test_make_move_valid(self):
        my_board = new_board()
        moves = [
            (0, 0, PLAYER_O),
            (0, 1, PLAYER_X),
            (0, 2, PLAYER_X),
            (1, 0, PLAYER_O),
            (2, 0, PLAYER_O),
            (1, 1, PLAYER_X),
            (1, 2, PLAYER_X),
            (2, 1, PLAYER_O),
            (2, 2, PLAYER_X)
        ]
        for move in moves:
            self.assertTrue(make_move(my_board, move[0], move[1], move[2]))

    def test_to_char_array(self):
        my_board = new_board()
        expected = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 0, 0, PLAYER_X)
        expected = [
            ['X', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 1, 1, PLAYER_O)
        expected = [
            ['X', ' ', ' '],
            [' ', 'O', ' '],
            [' ', ' ', ' ']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 0, 2, PLAYER_X)
        expected = [
            ['X', ' ', ' '],
            [' ', 'O', ' '],
            ['X', ' ', ' ']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 0, 1, PLAYER_O)
        expected = [
            ['X', ' ', ' '],
            ['O', 'O', ' '],
            ['X', ' ', ' ']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 2, 1, PLAYER_X)
        expected = [
            ['X', ' ', ' '],
            ['O', 'O', 'X'],
            ['X', ' ', ' ']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 1, 0, PLAYER_O)
        expected = [
            ['X', 'O', ' '],
            ['O', 'O', 'X'],
            ['X', ' ', ' ']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 1, 2, PLAYER_X)
        expected = [
            ['X', 'O', ' '],
            ['O', 'O', 'X'],
            ['X', 'X', ' ']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 2, 2, PLAYER_O)
        expected = [
            ['X', 'O', ' '],
            ['O', 'O', 'X'],
            ['X', 'X', 'O']
        ]
        self.assertEquals(to_char_array(my_board), expected)
        my_board = make_move(my_board, 2, 0, PLAYER_X)
        expected = [
            ['X', 'O', 'X'],
            ['O', 'O', 'X'],
            ['X', 'X', 'O']
        ]
        self.assertEquals(to_char_array(my_board), expected)

    def test_from_char_array(self):
        char_array = [
            ['X', 'O', ' '],
            ['O', 'O', 'X'],
            ['X', 'X', 'O']
        ]
        expected = [
            PLAYER_X, PLAYER_O, NO_PLAYER,
            PLAYER_O, PLAYER_O, PLAYER_X,
            PLAYER_X, PLAYER_X, PLAYER_O
        ]
        self.assertEquals(from_char_array(char_array), expected)

    def test_has_won(self):
        char_array = [
            ['X', 'O', ' '],
            ['O', 'O', 'X'],
            ['X', 'X', 'O']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_O))

        #test cols

        char_array = [
            ['X', 'O', ' '],
            ['O', 'O', 'X'],
            ['X', 'O', 'X']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertTrue(has_won(from_char_array(char_array), PLAYER_O))
        char_array = [
            ['O', 'X', ' '],
            ['O', 'O', 'X'],
            ['O', 'X', 'X']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertTrue(has_won(from_char_array(char_array), PLAYER_O))
        char_array = [
            ['X', ' ', 'O'],
            ['O', 'X', 'O'],
            ['X', 'X', 'O']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertTrue(has_won(from_char_array(char_array), PLAYER_O))

        #test diags

        char_array = [
            ['O', 'X', ' '],
            ['O', 'O', 'X'],
            ['X', 'X', 'O']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertTrue(has_won(from_char_array(char_array), PLAYER_O))
        char_array = [
            ['X', 'X', 'O'],
            ['O', 'O', 'X'],
            ['O', 'X', ' ']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertTrue(has_won(from_char_array(char_array), PLAYER_O))

        #test rows

        char_array = [
            ['X', 'O', 'X'],
            ['O', 'O', 'O'],
            ['X', ' ', 'X']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertTrue(has_won(from_char_array(char_array), PLAYER_O))
        char_array = [
            ['O', 'O', 'O'],
            ['X', 'O', 'X'],
            ['X', ' ', 'X']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertTrue(has_won(from_char_array(char_array), PLAYER_O))
        char_array = [
            ['X', 'O', 'X'],
            ['X', ' ', 'X'],
            ['O', 'O', 'O']
        ]
        self.assertFalse(has_won(from_char_array(char_array), PLAYER_X))
        self.assertTrue(has_won(from_char_array(char_array), PLAYER_O))

    def test_get_all_moves(self):
        char_array = [
            ['X', ' ', ' '],
            [' ', 'O', ' '],
            [' ', ' ', ' ']
        ]
        expected_moves = [
            (1, 0), (2, 0), (0, 1), (2, 1),
            (0, 2), (1, 2), (2, 2)
        ]
        moves = get_all_moves(from_char_array(char_array), PLAYER_X)
        for move in expected_moves:
            self.assertIn(move, moves)
        char_array = [
            ['X', 'O', 'X'],
            [' ', 'O', 'X'],
            [' ', 'O', ' ']
        ]
        expected_moves = []
        moves = get_all_moves(from_char_array(char_array), PLAYER_X)
        self.assertEquals(moves, expected_moves)

    def test_rotate_board(self):
        char_array = [
            ['X', 'O', ' '],
            ['O', 'O', 'X'],
            ['X', 'X', 'O']
        ]
        board = from_char_array(char_array)
        expected_char_array = [
            ['X', 'O', 'X'],
            ['X', 'O', 'O'],
            ['O', 'X', ' ']
        ]
        expected = from_char_array(expected_char_array)
        self.assertEquals(rotate_board(board, 1), expected)


if __name__ == '__main__':
    unittest.main()