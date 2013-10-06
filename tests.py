__author__ = 'andrewpboyle'

import unittest
import tictactoe
import config


def new_board():
    return [config.NO_PLAYER] * 9


class TestTicTacToe(unittest.TestCase):
    def test_make_move_invalid(self):
        my_board = new_board()
        moves = [
            (my_board, -1, config.HUMAN),
            (my_board, 10, config.COMPUTER),
            (my_board,  0, 4),
            (my_board,  0, 'X')
        ]
        for move in moves:
            self.assertRaises(Exception, tictactoe.make_move, move)

    def test_make_move_valid(self):
        my_board = new_board()
        for i in range(9):
            self.assertTrue(tictactoe.make_move(my_board, i, config.COMPUTER))
            self.assertTrue(tictactoe.make_move(my_board, i, config.HUMAN))

    def test_player_has_won(self):
        board = [
            config.COMPUTER, config.HUMAN, config.NO_PLAYER,
            config.HUMAN, config.HUMAN, config.COMPUTER,
            config.COMPUTER, config.COMPUTER, config.HUMAN
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertFalse(tictactoe.player_has_won(board, config.HUMAN))

        #test cols

        board = [
            config.COMPUTER, config.HUMAN, config.NO_PLAYER,
            config.HUMAN, config.HUMAN, config.COMPUTER,
            config.COMPUTER, config.HUMAN, config.COMPUTER
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertTrue(tictactoe.player_has_won(board, config.HUMAN))
        board = [
            config.HUMAN, config.COMPUTER, config.NO_PLAYER,
            config.HUMAN, config.HUMAN, config.COMPUTER,
            config.HUMAN, config.COMPUTER, config.COMPUTER
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertTrue(tictactoe.player_has_won(board, config.HUMAN))
        board = [
            config.COMPUTER, config.NO_PLAYER, config.HUMAN,
            config.HUMAN, config.COMPUTER, config.HUMAN,
            config.COMPUTER, config.COMPUTER, config.HUMAN
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertTrue(tictactoe.player_has_won(board, config.HUMAN))

        #test diags

        board = [
            config.HUMAN, config.COMPUTER, config.NO_PLAYER,
            config.HUMAN, config.HUMAN, config.COMPUTER,
            config.COMPUTER, config.COMPUTER, config.HUMAN
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertTrue(tictactoe.player_has_won(board, config.HUMAN))
        board = [
            config.COMPUTER, config.COMPUTER, config.HUMAN,
            config.HUMAN, config.HUMAN, config.COMPUTER,
            config.HUMAN, config.COMPUTER, config.NO_PLAYER
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertTrue(tictactoe.player_has_won(board, config.HUMAN))

        #test rows

        board = [
            config.COMPUTER, config.HUMAN, config.COMPUTER,
            config.HUMAN, config.HUMAN, config.HUMAN,
            config.COMPUTER, config.NO_PLAYER, config.COMPUTER
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertTrue(tictactoe.player_has_won(board, config.HUMAN))
        board = [
            config.HUMAN, config.HUMAN, config.HUMAN,
            config.COMPUTER, config.HUMAN, config.COMPUTER,
            config.COMPUTER, config.NO_PLAYER, config.COMPUTER
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertTrue(tictactoe.player_has_won(board, config.HUMAN))
        board = [
            config.COMPUTER, config.HUMAN, config.COMPUTER,
            config.COMPUTER, config.NO_PLAYER, config.COMPUTER,
            config.HUMAN, config.HUMAN, config.HUMAN
        ]
        self.assertFalse(tictactoe.player_has_won(board, config.COMPUTER))
        self.assertTrue(tictactoe.player_has_won(board, config.HUMAN))

    def test_get_all_moves(self):
        board = [
            config.COMPUTER, config.NO_PLAYER, config.NO_PLAYER,
            config.NO_PLAYER, config.HUMAN, config.NO_PLAYER,
            config.NO_PLAYER, config.NO_PLAYER, config.NO_PLAYER
        ]
        expected_moves = [1, 2, 3, 5, 6, 7, 8]
        moves = tictactoe.get_all_moves(board, config.COMPUTER)
        for move in expected_moves:
            self.assertIn(move, moves)
        board = [
            config.COMPUTER, config.HUMAN, config.COMPUTER,
            config.NO_PLAYER, config.HUMAN, config.COMPUTER,
            config.NO_PLAYER, config.HUMAN, config.NO_PLAYER
        ]
        expected_moves = []
        moves = tictactoe.get_all_moves(board, config.COMPUTER)
        self.assertEquals(moves, expected_moves)

    def test_is_full(self):
        board = new_board()
        for i in range(9):
            self.assertFalse(tictactoe.is_full_board(board))
            board[i] = 1
        self.assertTrue(tictactoe.is_full_board(board))


if __name__ == '__main__':
    unittest.main()