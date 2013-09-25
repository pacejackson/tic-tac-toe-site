/**
 * Created with PyCharm.
 * User: andrewpboyle
 * Date: 9/24/13
 * Time: 12:14 PM
 * To change this template use File | Settings | File Templates.
 */

var board;
var turn;
var user_first;

/**
 * code to draw X and O from:
 * http://www.dreamincode.net/forums/topic/247361-simple-tic-tac-toe-using-html5-css3-and-javascript/
 */

function draw_X(context) {
    context.beginPath();
    context.moveTo(10,10);
    context.lineTo(115,115);
    context.moveTo(115,10);
    context.lineTo(10,115);
    context.stroke();
    context.closePath();
};

function draw_O(context) {
    context.beginPath();
    context.arc(62,63,55,0,Math.PI*2,true);
    context.stroke();
    context.closePath();
};

$(document).ready(function() {
    board = new Array();
    turn = 0;
    for(var i = 0; i < 9; i++) {
        board[i] = ' ';
    }

    $('.game_board').on('click', 'canvas', function () {
        var context = this.getContext("2d");
        var split_id = this.id.split('_');
        var canvas_num = split_id[split_id.length - 1]
        if(board[canvas_num] == ' '){
            if(turn % 2 == 0){
                draw_X(context)
                board[canvas_num] = 'X';
            }

            else{
                draw_O(context)
                board[canvas_num] = 'O';
            }
            turn++;
        }
        else{
            alert("Space occupied.  You must construct additional pyl...boxes!");
        }
    });

    $('.start_menu').on('click', function () {
        /**
         * code to draw X and O from:
         * http://www.dreamincode.net/forums/topic/247361-simple-tic-tac-toe-using-html5-css3-and-javascript/
         */
        user_first = false;
        $(this).addClass('hide_menu')
    });

    $('.game_board').on('mouseenter', 'canvas', function () {
        var split_id = this.id.split('_');
        var canvas_num = split_id[split_id.length - 1]
        if(board[canvas_num] == ' ') {
            $(this).addClass('moused_over');
        };
    });

    $('.game_board').on('mouseleave', 'canvas', function () {
        if($(this).hasClass('moused_over')){
            $(this).removeClass('moused_over');
        };
    });
});