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

var DISABLED_CLASS = 'disabled';
var HIDE_MENU_CLASS = 'hide_menu';
var RED_BUTTON_CLASS = 'button-flat-caution';
var WHITE_BUTTON_CLASS = 'button-flat';
var MOUSED_OVER_CLASS = 'moused_over';

var CLICK = 'click';
var MOUSE_ENTER = 'mouseenter';
var MOUSE_LEAVE = 'mouseleave';

var CANVAS_ID = 'tic_tac_toe_box_';

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
        this.board_elements  = $('.game_board');
        for(var i = 0; i < 9; i++) {
            this.game_board[i] = 0;
            var context = $('#' +  CANVAS_ID + i)[0].getContext('2d');
            context.clearRect(0, 0, 125, 125);
        };
        //initialize the player shapes
        this.player_shape = player_shape;
        if(player_shape == SHAPE_X) {
            this.computer_shape = SHAPE_O;
        }
        else {
            this.computer_shape = SHAPE_X;
        }
        //set up event handlers
        this.board_elements.on(MOUSE_LEAVE, 'canvas', this.mouse_leave_box);
        if(play_first) {
            this.board_elements.on(MOUSE_ENTER, 'canvas', this.mouse_over_box);
            this.board_elements.on(CLICK, 'canvas', this.box_clicked);
        }
        // get the computer's move if the player is going second
        else {
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
        var split_id = event.target.id.split('_');
        var canvas_num = split_id[split_id.length - 1]
        if(board.game_board[canvas_num] == ' ') {
            $(event.target).addClass(MOUSED_OVER_CLASS);
        }
    },

    /**
     * Mouseleave event handler that removes the highlight from the box you
     * were mousing over if it was highlighted.
     * @param event
     */
    mouse_leave_box: function (event) {
        if($(event.target).hasClass(MOUSED_OVER_CLASS)){
            $(event.target).removeClass(MOUSED_OVER_CLASS);
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
        var split_id = event.target.id.split('_');
        var canvas_num = split_id[split_id.length - 1]
        if(board.game_board[canvas_num] == 0){
            board.board_elements.off(MOUSE_ENTER, 'canvas', board.mouse_over_box);
            board.board_elements.off(CLICK, 'canvas', board.box_clicked);
            $(event.target).trigger(MOUSE_LEAVE);
            board.draw_shape(board.player_shape, event.target.id)
            board.game_board[canvas_num] = HUMAN_VALUE;
            board.computer_turn();
        }
        else{
            alert("Space occupied.  You must construct additional pyl...boxes!");
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
            var canvas_id = CANVAS_ID + move;
            board.draw_shape(board.computer_shape, canvas_id);
            board.game_board[move] = CPU_VALUE;
        }
        else if (state == ONGOING) {
            state = ERROR;
        }
        if (state != ONGOING) {
            board.game_over(state, message);
        }
        else{
            board.board_elements.on(MOUSE_ENTER, 'canvas', board.mouse_over_box);
            board.board_elements.on(CLICK, 'canvas', board.box_clicked);
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
        board.board_elements.off(MOUSE_ENTER, 'canvas', board.mouse_over_box);
        board.board_elements.off(CLICK, 'canvas', board.box_clicked);
        board.board_elements.off(MOUSE_LEAVE, 'canvas', this.mouse_leave_box);
        var message = '';
        switch (result) {
            case ERROR:
                message = '<h1 id="message" class="title">Sorry, there was an error.  ' + m + '</h1>';
                break;
            case CATS_GAME:
                message = '<h1 id="message" class="title">Cat\'s Game!</h1>';
                break;
            case USER_WINS:
                message = '<h1 id="message" class="title">You win! ...Oops.</h1>';
                break;
            case CPU_WINS:
                message = '<h1 id="message" class="title">Benevolent machine overlords win! ...Sorry.</h1>';
                break;
            default:
                message = '<h1 id="message" class="title">Bad response ' + result + '</h1>';
                break;
        };
        game_over_menu.init($(message));
    }
};

var game_over_menu = {
    init: function(message_el) {
        this.menu = $('#game-over-menu');
        this.menu.find('#choice-buttons').before(message_el);
        this.menu.removeClass(HIDE_MENU_CLASS);
        this.reset_button = $('#reset-button');
        this.reset_button.on(CLICK, this.reset);
    },

    reset: function() {
        game_over_menu.reset_button.off(CLICK, game_over_menu.reset);
        game_over_menu.menu.find('#message').remove();
        game_over_menu.menu.addClass(HIDE_MENU_CLASS);
        start_menu.init();
    }
};

var start_menu = {
    /**
     * initialize the start menu and all of its components.
     */
    init: function() {
        this.user_char = ' '
        this.user_first = false;

        //Set up the go first/second buttons
        this.first_button =  $('#first_button');
        this.second_button = $('#second_button');
        if(!this.first_button.hasClass(DISABLED_CLASS)) {
            this.first_button.addClass(DISABLED_CLASS);
        }
        if(!this.second_button.hasClass(DISABLED_CLASS)) {
            this.second_button.addClass(DISABLED_CLASS);
        }
        this.first_button.off(CLICK);
        this.second_button.off(CLICK);

        //Set up the select O/X buttons
        this.o_button = $('#O_button');
        this.x_button = $('#X_button');
        if(this.o_button.hasClass(RED_BUTTON_CLASS)) {
          this.o_button.removeClass(RED_BUTTON_CLASS);
          this.o_button.addClass(WHITE_BUTTON_CLASS);
        }
        if(this.x_button.hasClass(RED_BUTTON_CLASS)) {
          this.x_button.removeClass(RED_BUTTON_CLASS);
          this.x_button.addClass(WHITE_BUTTON_CLASS);
        }

        //Set up start menu
        this.menu = $('#start-menu');
        if(this.menu.hasClass(HIDE_MENU_CLASS)){
            this.menu.removeClass(HIDE_MENU_CLASS);
        }

        //Set up click handlers
        this.o_button.on(CLICK, this.o_click_handler);
        this.x_button.on(CLICK, this.x_click_handler);
    },

    /**
     * Click handler for the select X button.
     */
    x_click_handler: function() {
        start_menu.set_user_char(start_menu.x_button, start_menu.o_button, SHAPE_X);
    },

    /**
     * Click handler for the select O button.
     */
    o_click_handler: function() {
        start_menu.set_user_char(start_menu.o_button, start_menu.x_button, SHAPE_O);
    },

    /**
     * Mark that the user has selected set_button and deselect other_button
     * if it has been clicked.  Enable first_button and second_button.
     * @param set_button - The player shape button that was clicked.
     * @param other_button - The other player shape button.
     */
     set_user_char: function(set_button, other_button, shape) {
        start_menu.user_char = shape;
        if(other_button.hasClass(RED_BUTTON_CLASS)) {
          other_button.removeClass(RED_BUTTON_CLASS);
          other_button.addClass(WHITE_BUTTON_CLASS);
        }
        set_button.removeClass(WHITE_BUTTON_CLASS)
        set_button.addClass(RED_BUTTON_CLASS);
        start_menu.first_button.removeClass(DISABLED_CLASS);
        start_menu.second_button.removeClass(DISABLED_CLASS);
        start_menu.first_button.on(CLICK, start_menu.first_click_handler);
        start_menu.second_button.on(CLICK, start_menu.second_click_handler);
    },

    /**
     * Hide the start menu and initialize the board with the player's
     * chosen shape and whether they want to go first or not.
     */
    initialize_game: function () {
        if(start_menu.user_char == SHAPE_O || start_menu.user_char == SHAPE_X) {
            start_menu.first_button.off(CLICK,start_menu.first_click_handler);
            start_menu.second_button.off(CLICK, start_menu.second_click_handler);
            start_menu.o_button.off(CLICK, start_menu.o_click_handler);
            start_menu.x_button.off(CLICK, start_menu.x_click_handler);
            start_menu.menu.addClass(HIDE_MENU_CLASS);
            board.init(start_menu.user_char, start_menu.user_first);
        }
    },

    /**
     * Click handler for the button a user pushes to choose to go first.
     * Only works after they have selected a shape.  When it is clicked,
     * it will disable itself and second_button and start the game.
     */
    first_click_handler: function () {
        start_menu.user_first = true;
        start_menu.initialize_game();
    },

    /**
     * Click handler for the button a user pushes to choose to go second.
     * Only works after they have selected a shape.  When it is clicked,
     * it will disable itself and first_button and start the game.
     */
    second_click_handler: function () {
        start_menu.user_first = false;
        start_menu.initialize_game();
    }
}

$(document).ready(function() {
    start_menu.init();
});