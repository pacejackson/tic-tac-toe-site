
var ERROR       = 'error';
var ONGOING     = 'ongoing';
var CPU_WINS    = 'cpu_wins';
var USER_WINS   = 'user_wins';
var CATS_GAME   = 'cats_game';
var CPU_VALUE   = -1;
var HUMAN_VALUE = 1;
var SHAPE_X     = 'X';
var SHAPE_O     = 'O';
var SPINNER     = '<div class="spinner"></div>';
var DISABLED_CLASS     = 'disabled';
var HIDE_MENU_CLASS    = 'hide_menu';
var RED_BUTTON_CLASS   = 'button-flat-caution';
var WHITE_BUTTON_CLASS = 'button-flat';
var MOUSED_OVER_CLASS  = 'moused_over';
var CLICK       = 'click';
var MOUSE_ENTER = 'mouseenter';
var MOUSE_LEAVE = 'mouseleave';
var CANVAS      = 'canvas';
var CANVAS_ID   = 'tic_tac_toe_box_';

$(document).ready(function() {
    start_menu.init();
});

/**
 *
 * @type {{init: Function, x_click_handler: Function, o_click_handler: Function, set_user_char: Function, highlight_button: Function, unhighlight_button: Function, enable_button: Function, disable_button: Function, initialize_game: Function, first_click_handler: Function, second_click_handler: Function}}
 */
var start_menu = {
    /**
     * initialize the start menu and all of its components.
     */
    init: function() {
        this.user_char = ' ';

        this.first_button =  $('#first_button');
        this.second_button = $('#second_button');
        this.o_button = $('#O_button');
        this.x_button = $('#X_button');
        this.menu = $('#start-menu');

        this.unhighlight_button(this.o_button);
        this.unhighlight_button(this.x_button);
        this.enable_button(this.o_button, this.o_click_handler);
        this.enable_button(this.x_button, this.x_click_handler);
        if(this.menu.hasClass(HIDE_MENU_CLASS)){
            this.menu.removeClass(HIDE_MENU_CLASS);
        }
    },

    /**
     * Click handler for the select X button.
     */
    x_click_handler: function() {
        start_menu.set_user_char(start_menu.x_button, start_menu.o_button, start_menu.o_click_handler, SHAPE_X);
    },

    /**
     * Click handler for the select O button.
     */
    o_click_handler: function() {
        start_menu.set_user_char(start_menu.o_button, start_menu.x_button, start_menu.x_click_handler, SHAPE_O);
    },

    /**
     * Mark that the user has selected set_button and deselect other_button
     * if it has been clicked.  Enable first_button and second_button click
     * handlers.  Set start_menu.user_char to the given shape.
     * @param set_button - The player shape button that was clicked.
     * @param other_button - The other player shape button.
     * @param other_handler - handler function for the click event on other_button.
     * @param shape - the shape that the user selected.
     */
     set_user_char: function(set_button, other_button, other_handler, shape) {
        start_menu.user_char = shape;
        if(start_menu.unhighlight_button(other_button)) {
            other_button.on(CLICK, other_handler);
        }
        if(start_menu.highlight_button(set_button)) {
            set_button.off(CLICK);
        }
        start_menu.enable_button(start_menu.first_button, start_menu.first_click_handler);
        start_menu.enable_button(start_menu.second_button, start_menu.second_click_handler);
    },

    change_button_class: function(button, remove_class, add_class) {
        if(button.hasClass(remove_class)) {
            button.removeClass(remove_class);
            button.addClass(add_class);
            return true;
        }
        return false;
    },

    highlight_button: function(button) {
        return start_menu.change_button_class(button, WHITE_BUTTON_CLASS, RED_BUTTON_CLASS)
    },

    unhighlight_button: function(button) {
        return start_menu.change_button_class(button, RED_BUTTON_CLASS, WHITE_BUTTON_CLASS)
    },

    enable_button: function(button, handler) {
        if(button.hasClass(DISABLED_CLASS)) {
            button.removeClass(DISABLED_CLASS);
            button.on(CLICK, handler);
            return true;
        }
        return false;
    },

    disable_button: function(button, handler) {
        if(!button.hasClass(DISABLED_CLASS)) {
            button.addClass(DISABLED_CLASS);
            button.off(CLICK, handler);
            return true;
        }
        return false;
    },

    /**
     * Hide the start menu and initialize the board with the player's
     * chosen shape and whether they want to go first or not.
     * Turns off all of the start menu click handlers.
     */
    initialize_game: function (user_first) {
        if(start_menu.user_char == SHAPE_O || start_menu.user_char == SHAPE_X) {
            start_menu.disable_button(start_menu.first_button, start_menu.first_click_handler);
            start_menu.disable_button(start_menu.second_button, start_menu.second_click_handler);
            start_menu.disable_button(start_menu.o_button, start_menu.o_click_handler);
            start_menu.disable_button(start_menu.x_button, start_menu.x_click_handler);
            start_menu.menu.addClass(HIDE_MENU_CLASS);
            board.init(start_menu.user_char, user_first);
        }
    },

    /**
     * Click handler for the button a user pushes to choose to go first.
     * Only works after they have selected a shape.  When it is clicked,
     * it will disable itself and second_button and start the game.
     */
    first_click_handler: function () {
        start_menu.initialize_game(true);
    },

    /**
     * Click handler for the button a user pushes to choose to go second.
     * Only works after they have selected a shape.  When it is clicked,
     * it will disable itself and first_button and start the game.
     */
    second_click_handler: function () {
        start_menu.initialize_game(false);
    }
}

/**
 * Object used to represent the game board.
 * @type {{init: Function,
 * draw_X: Function,
 * draw_O: Function,
 * draw_shape: Function,
 * mouse_over_box: Function,
 * mouse_leave_box: Function,
 * box_clicked: Function,
 * computer_turn: Function,
 * game_over: Function}}
 */
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
        this.board_elements.on(MOUSE_LEAVE, CANVAS, this.mouse_leave_box);
        if(play_first) {
            this.enable_user_interaction();
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
        var canvas_num = split_id[split_id.length - 1];
        if(board.game_board[canvas_num] == 0){
            board.disable_user_interaction();
            $(event.target).trigger(MOUSE_LEAVE);
            board.draw_shape(board.player_shape, event.target.id);
            board.game_board[canvas_num] = HUMAN_VALUE;
            board.computer_turn();
        }
        else{
            alert("Space occupied.  You must construct additional pyl...boxes!");
        }
    },

    disable_user_interaction: function() {
        board.board_elements.off(MOUSE_ENTER, CANVAS, board.mouse_over_box);
        board.board_elements.off(CLICK, CANVAS, board.box_clicked);
    },

    enable_user_interaction: function() {
        board.board_elements.on(MOUSE_ENTER, CANVAS, board.mouse_over_box);
        board.board_elements.on(CLICK, CANVAS, board.box_clicked);
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
           beforeSend: function() { $('#start-menu').before($(SPINNER)); },
           complete: function() {  $('.spinner').remove(); },
           success: function(response) {
                        var move = response.move;
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
                           board.enable_user_interaction();
                        }
                    },
           error: function() {
                      board.game_over(ERROR, 'There was an error running the AJAX request.');
                  }
        });

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
        board.disable_user_interaction();
        board.board_elements.off(MOUSE_LEAVE, CANVAS, this.mouse_leave_box);
        var message = $('<h1 id="message" class="title"></h1>');
        switch (result) {
            case ERROR:
                message.html("Sorry, there was an error.  " + m );
                break;
            case CATS_GAME:
                message.html("Cat's Game!");
                break;
            case USER_WINS:
                message.html("You win! ...Oops.");
                break;
            case CPU_WINS:
                message.html("Benevolent machine overlords win! ...Sorry.");
                break;
            default:
                message.html("Bad response " + result);
                break;
        };
        game_over_menu.init(message);
    }
};

/**
 * Object that represents the game over board.  Displays the
 * game over message and has a button to restart the game.
 * @type {{init: Function, reset: Function}}
 */
var game_over_menu = {
    /**
     * Initialize the game over menu.
     * @param message_el: jQuery object representing the message you want to put
     * on the game over menu.
     */
    init: function(message_el) {
        this.menu = $('#game-over-menu');
        this.message = message_el;
        this.menu.find('#choice-buttons').before(this.message);
        this.menu.removeClass(HIDE_MENU_CLASS);
        this.reset_button = $('#reset-button');
        this.reset_button.on(CLICK, this.reset);
    },

    /**
     * Resets the game back to the beginning.  Initializes the
     * start menu and hides the game_over menu.
     */
    reset: function() {
        game_over_menu.reset_button.off(CLICK, game_over_menu.reset);
        game_over_menu.message.remove();
        game_over_menu.menu.addClass(HIDE_MENU_CLASS);
        start_menu.init();
    }
};