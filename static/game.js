/**
 * Created with PyCharm.
 * User: andrewpboyle
 * Date: 9/24/13
 * Time: 12:14 PM
 * To change this template use File | Settings | File Templates.
 */


var ERROR     = 'error';
var ONGOING   = 'ongoing';
var CPU_WINS  = 'cpu_wins';
var USER_WINS = 'user_wins';
var CATS_GAME = 'cats_game';

var CPU_VALUE   = -1;
var HUMAN_VALUE = 1;

var SHAPE_X = 'X'
var SHAPE_O = 'O'

var SPINNER = '<div class="spinner"></div>';

var board = {
    /**
     * Initialize the tic-tac-toe board.
     * @param player_shape - the shape that the player picked, should be SHAPE_X
     * or SHAPE_O.
     * @param play_first - True if the player chose to play first, false if not.
     */
    init: function(player_shape, play_first) {
        //initialize board state
        this.game_board = new Array();
        for(var i = 0; i < 9; i++) {
            this.game_board[i] = 0;
        };
        this.play_first = play_first;
        this.player_shape = player_shape;
        if(player_shape == SHAPE_X) {
            this.computer_shape = SHAPE_O;
        }
        else {
            this.computer_shape = SHAPE_X;
        }
        this.can_click = this.play_first;
        //set up event handlers
        $('.game_board').on('mouseenter', 'canvas', this.mouse_over_box);
        $('.game_board').on('mouseleave', 'canvas', this.mouse_leave_box);
        $('.game_board').on('click', 'canvas', this.box_clicked);
        $('#reset-button').on('click', function () { location.reload(); });
        // get the computer's move if the player is going second
        if(!this.play_first) {
            this.computer_turn();
        }
    },

    /**
     * code to draw X and O from:
     * http://www.dreamincode.net/forums/topic/247361-simple-tic-tac-toe-using-html5-css3-and-javascript/
     */

    /**
     * Draw an X using the given context.
     * @param context - The 2d context of the canvas you want to draw on.
     */
    draw_X: function (context) {
        context.beginPath();
        context.moveTo(10,10);
        context.lineTo(115,115);
        context.moveTo(115,10);
        context.lineTo(10,115);
        context.stroke();
        context.closePath();
    },

    /**
     * Draw an O using the given context.
     * @param context - The 2d context of the canvas you want to draw on.
     */
    draw_O: function (context) {
        context.beginPath();
        context.arc(62,63,55,0,Math.PI*2,true);
        context.stroke();
        context.closePath();
    },

    /**
     * Draws the given shape on the canvas given by canvas_id.
     * @param shape - the shape you want to draw.  Should be SHAPE_X or SHAPE_O
     * @param canvas_id - the id of the canvas to draw it on.  We will add the
     * '#' to the front when making the jQuery calls, so don't add it.
     */
    draw_shape: function (shape, canvas_id) {
        var context = $('#' + canvas_id)[0].getContext('2d');
        if(shape == SHAPE_X) {
            board.draw_X(context);
        }
        else {
            board.draw_O(context);
        }
    },

    /**
     * Mouseover event handler that highlights the box you are mousing over
     * in blue if the box is empty.
     * @param event
     */
    mouse_over_box: function (event) {
        if(board.can_click) {
            var split_id = event.target.id.split('_');
            var canvas_num = split_id[split_id.length - 1]
            if(board.game_board[canvas_num] == ' ') {
                $(event.target).addClass('moused_over');
            };
        }
    },

    /**
     * Mouseleave event handler that removes the highlight from the box you
     * were mousing over if it was highlighted.
     * @param event
     */
    mouse_leave_box: function (event) {
        if($(event.target).hasClass('moused_over')){
            $(event.target).removeClass('moused_over');
        };
    },

    /**
     * Click event handler that triggers when you click on a canvas that is a part
     * of the game board.  If the space is empty and you can click (you are not waiting
     * for the computer to make their move) it will draw board.player_shape in the canvas
     * you clicked on, mark that in the board.game_board, and start the computer's turn.
     * You will get an alert if you are allowed to click and the box you click on is
     * full.
     * @param event
     */
    box_clicked: function (event) {
        if(board.can_click) {
            board.can_click = false;
            var split_id = event.target.id.split('_');
            var canvas_num = split_id[split_id.length - 1]
            if(board.game_board[canvas_num] == 0){
                board.draw_shape(board.player_shape, event.target.id)
                board.game_board[canvas_num] = HUMAN_VALUE;
                board.computer_turn();
            }
            else{
                alert("Space occupied.  You must construct additional pyl...boxes!");
            }
        }
    },

    /**
     * Takes the computer's turn.  Sends the current board to the tic-tac-toe API
     * using an ajax request.  The board will be updated once the request finishes
     * or errors out.
     */
    computer_turn: function() {
        var board_input = JSON.stringify(board.game_board)
        $.ajax('/api.json', {
           type: 'GET',
           data: {board: board_input},
           dataType: 'json',
           contentType: 'application/json',
           timeout: 3000,
           beforeSend: board.ajax_before_send,
           success: board.ajax_success,
           error: board.ajax_error,
           complete: board.ajax_complete
        });

    },

    /**
     * Runs when the ajax call to the API completes successfully.  Gets
     * the results from the call and updates the game accordingly.
     * @param response - the response from the ajax call to the API.  Should
     * have a move_1d paramater, specifying the 1d index of the row-major
     * representation of the tic-tac-toe board where the computer is making
     * it's move.  It should also have a game_state paramater to let us know
     * if the game is over or if there was an error.  We also expect a
     * message parameter that lets the API pass us extra information about the
     * board state or any errors.
     */
    ajax_success: function(response) {
        var move = response.move_1d;
        var state = response.game_state;
        var message = response.message;
        if(board.game_board[move] == 0) {
            var canvas_id = 'tic_tac_toe_box_' + move;
            board.draw_shape(board.computer_shape, canvas_id);
            board.game_board[move] = CPU_VALUE;
            board.can_click = true;
        }
        else if (state == ONGOING) {
            state = ERROR;
        }
        if (state != ONGOING) {
            board.game_over(state, message);
        }

    },

    /**
     * Starts the CSS spinner before the ajax call is sent.
     */
    ajax_before_send: function() {
        $('#start-menu').before($(SPINNER));
    },

    /**
     * Removes the CSS spinner once the ajax call is completed.
     */
    ajax_complete: function() {
        $('.spinner').remove();
    },

    /**
     * ajax error handler.  Ends the game with an error message when it is
     * called.
     */
    ajax_error: function() {
        board.game_over(ERROR, 'There was an error running the AJAX request.');
    },

    /**
     * Ends the game based on the provided result.  Pulls down the game over
     * menu with the game over message and a restart button.
     * @param result - string representing the result of the game.  The
     * values it expects are:
     *  'error': Error message.
     *  'cats_game': The game is over in a tie.
     *  'user_wins': The player has won the game.
     *  'cpu_wins': The computer has won the game.
     * @param m - the message that you want to add to the error message if you
     * have one.
     */
    game_over: function(result, m) {
        var message = '';
        switch (result) {
            case ERROR:
                message = '<h1 class="title">Sorry, there was an error.  ' + m + '</h1>';
                break;
            case CATS_GAME:
                message = '<h1 class="title">Cat\'s Game!</h1>';
                break;
            case USER_WINS:
                message = '<h1 class="title">You win! ...Oops.</h1>';
                break;
            case CPU_WINS:
                message = '<h1 class="title">Benevolent machine overlords win! ...Sorry.</h1>';
                break;
            default:
                message = '<h1 class="title">Bad response ' + result + '</h1>';
                break;
        };
        var game_over_menu = $('#game-over-menu');
        game_over_menu.find('#choice-buttons').before($(message));
        game_over_menu.removeClass('hide_menu');
    }
};
var user_first;
var user_char;

$(document).ready(function() {
    user_char = ' ';

    /**
     * Hide the start menu and initialize the board with the player's
     * chosen shape and whether they want to go first or not.
     */
    function initialize() {
        $('#start-menu').addClass('hide_menu');
        board.init(user_char, user_first);
    };

    /**
     * Mark that the user has selected set_button and deselect other_button
     * if it has been clicked.  Enable first_button and second_button.
     * @param set_button - The player shape button that was clicked.
     * @param other_button - The other player shape button.
     */
    function set_user_char(set_button, other_button) {
        if(other_button.hasClass('button-flat-caution')) {
          other_button.removeClass('button-flat-caution');
          other_button.addClass('button-flat');
        };
        set_button.removeClass('button-flat')
        set_button.addClass('button-flat-caution');
        $('#first_button').removeClass('disabled');
        $('#second_button').removeClass('disabled');
    };

    /**
     * Click handler for the button a user pushes to choose to go first.
     * Only works after they have selected a shape.  When it is clicked,
     * it will disable itself and second_button and start the game.
     */
    $('#first_button').on('click', function () {
        if(!$(this).hasClass('disabled')){
            user_first = true;
            $(this).addClass('disabled');
            $('#second_button').addClass('disabled');
            initialize();
        };
    });

    /**
     * Click handler for the button a user pushes to choose to go second.
     * Only works after they have selected a shape.  When it is clicked,
     * it will disable itself and first_button and start the game.
     */
    $('#second_button').on('click', function () {
        if(!$(this).hasClass('disabled')){
            user_first = false;
            $(this).addClass('disabled');
            $('#first_button').addClass('disabled');
            initialize();
        };
    });

    /**
     * Click handler for the select O button.
     */
    $('#O_button').on('click', function () {
        user_char = SHAPE_O;
        set_user_char($(this), $('#X_button'));
    });

    /**
     * Click handler for the select X button.
     */
    $('#X_button').on('click', function () {
        user_char = SHAPE_X;
        set_user_char($(this), $('#O_button'));
    });
});