/**
 * Created with PyCharm.
 * User: andrewpboyle
 * Date: 9/24/13
 * Time: 12:14 PM
 * To change this template use File | Settings | File Templates.
 */

var board = {
    init: function(player_char, play_first) {
        this.game_board = new Array();
        for(var i = 0; i < 9; i++) {
            this.game_board[i] = ' ';
        };
        this.play_first = play_first;
        this.player_char = player_char;
        this.can_click = this.play_first;
        $('.game_board').on('mouseenter', 'canvas', this.mouse_over_box);
        $('.game_board').on('mouseleave', 'canvas', this.mouse_leave_box);
        $('.game_board').on('click', 'canvas', this.box_clicked);
        if(!this.play_first) {
            this.computer_turn();
        }
    },

    draw_X: function (context, index) {
        context.beginPath();
        context.moveTo(10,10);
        context.lineTo(115,115);
        context.moveTo(115,10);
        context.lineTo(10,115);
        context.stroke();
        context.closePath();
        board.game_board[index] = 'X';
    },

    draw_O: function (context, index) {
        context.beginPath();
        context.arc(62,63,55,0,Math.PI*2,true);
        context.stroke();
        context.closePath();
        board.game_board[index] = 'O';
    },

    mouse_over_box: function (event) {
        var split_id = event.target.id.split('_');
        var canvas_num = split_id[split_id.length - 1]
        if(board.game_board[canvas_num] == ' ') {
            $(event.target).addClass('moused_over');
        };
    },

    mouse_leave_box: function (event) {
        if($(event.target).hasClass('moused_over')){
            $(event.target).removeClass('moused_over');
        };
    },

    box_clicked: function (event) {
        if(board.can_click) {
            board.can_click = false;
            var context = event.target.getContext("2d");
            var split_id = event.target.id.split('_');
            var canvas_num = split_id[split_id.length - 1]
            if(board.game_board[canvas_num] == ' '){
                if(board.player_char == 'X') {
                    board.draw_X(context, canvas_num);
                }
                else {
                    board.draw_O(context, canvas_num);
                }
                board.computer_turn();
            }
            else{
                alert("Space occupied.  You must construct additional pyl...boxes!");
            }
        }
        else {
            alert("Cannot click yet.");
        }
    },

    computer_turn: function() {
        /*
        $.ajax('url', {
           type: 'GET',
           data: {'board': board},
           dataType: 'json',
           contentType: 'application/json',
           beforeSend: function() {},
           success: function () {},
           error: function () {},
           complete: function() {}
        });
        */
    },

    ajax_success: function() {
        board.can_click = true;
    },

    ajax_before_send: function() {

    },

    ajax_before_complete: function() {

    },

    ajax_error: function() {

    },

    game_over: function(result) {

    }
};
var user_first;
var user_char;

/**
 * code to draw X and O from:
 * http://www.dreamincode.net/forums/topic/247361-simple-tic-tac-toe-using-html5-css3-and-javascript/
 */

$(document).ready(function() {
    user_char = ' ';

    function initialize() {
        $('.start_menu').addClass('hide_menu');
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