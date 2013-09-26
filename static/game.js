/**
 * Created with PyCharm.
 * User: andrewpboyle
 * Date: 9/24/13
 * Time: 12:14 PM
 * To change this template use File | Settings | File Templates.
 */


var ERROR     = 'error';
var ONGOING   = 'ongoing';
var CPU_WINS  = 'computer_wins';
var USER_WINS = 'user_wins';
var CATS_GAME = 'cats_game';

var CPU_VALUE   = -1;
var HUMAN_VALUE = 1;

var SPINNER = '<div class="spinner"></div>';

var board = {
    init: function(player_shape, play_first) {
        this.game_board = new Array();
        for(var i = 0; i < 9; i++) {
            this.game_board[i] = 0;
        };
        this.play_first = play_first;
        this.player_shape = player_shape;
        if(player_shape == 'X') {
            this.computer_shape = 'O';
        }
        else {
            this.computer_shape = 'X';
        }
        this.can_click = this.play_first;
        $('.game_board').on('mouseenter', 'canvas', this.mouse_over_box);
        $('.game_board').on('mouseleave', 'canvas', this.mouse_leave_box);
        $('.game_board').on('click', 'canvas', this.box_clicked);
        $('#reset-button').on('click', function () { location.reload(); });
        if(!this.play_first) {
            this.computer_turn();
        }
    },

    /**
     * code to draw X and O from:
     * http://www.dreamincode.net/forums/topic/247361-simple-tic-tac-toe-using-html5-css3-and-javascript/
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

    draw_O: function (context) {
        context.beginPath();
        context.arc(62,63,55,0,Math.PI*2,true);
        context.stroke();
        context.closePath();
    },

    draw_shape: function (shape, canvas_id) {
        var context = $('#' + canvas_id)[0].getContext('2d');
        if(shape == 'X') {
            board.draw_X(context);
        }
        else {
            board.draw_O(context);
        }
    },

    mouse_over_box: function (event) {
        if(board.can_click) {
            var split_id = event.target.id.split('_');
            var canvas_num = split_id[split_id.length - 1]
            if(board.game_board[canvas_num] == ' ') {
                $(event.target).addClass('moused_over');
            };
        }
    },

    mouse_leave_box: function (event) {
        if($(event.target).hasClass('moused_over')){
            $(event.target).removeClass('moused_over');
        };
    },

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

    computer_turn: function() {
        board.game_over(ERROR);
        var result = {}
        /*
        $.ajax('url', {
           type: 'GET',
           data: {'board': board},
           dataType: 'json',
           contentType: 'application/json',
           beforeSend: ajax_before_send,
           success: ajax_success,
           error: ajax_error,
           complete: ajax_complete
        });
        */
    },

    ajax_success: function(response) {
        var move = response.move_1d;
        var state = respones.game_state;
        if(board.game_board[move] == 0) {
            var canvas_id = 'tic_tac_toe_box_' + move;
            board.draw_shape(board.computer_shape, canvas_id);
            board.game_board[move] = CPU_VALUE;
            board.can_click = true;
        }
        else {
            state = ERROR;
        }
        if (state != ONGOING) {
            board.game_over(state);
        }

    },

    ajax_before_send: function() {
        $('#start-menu').before($(SPINNER));
    },

    ajax_complete: function() {
        $('.spinner').remove();
    },

    ajax_error: function() {
        board.game_over(ERROR);
    },

    game_over: function(result) {
        var message = '';
        switch (result) {
            case ERROR:
                message = '<h1 class="title">Sorry, there was an error.</h1>';
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

    function initialize() {
        $('#start-menu').addClass('hide_menu');
        board.init(user_char, user_first);
    };

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

    $('#first_button').on('click', function () {
        if(!$(this).hasClass('disabled')){
            user_first = true;
            $(this).addClass('disabled');
            $('#second_button').addClass('disabled');
            initialize();
        };
    });

    $('#second_button').on('click', function () {
        if(!$(this).hasClass('disabled')){
            user_first = false;
            $(this).addClass('disabled');
            $('#first_button').addClass('disabled');
            initialize();
        };
    });

    $('#O_button').on('click', function () {
        user_char = 'O';
        set_user_char($(this), $('#X_button'));
    });

    $('#X_button').on('click', function () {
        user_char = 'X';
        set_user_char($(this), $('#O_button'));
    });
});