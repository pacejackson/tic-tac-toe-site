/**
 * Created with PyCharm.
 * User: andrewpboyle
 * Date: 9/24/13
 * Time: 12:14 PM
 * To change this template use File | Settings | File Templates.
 */

var content

$(document).ready(function() {
    content = new Array();
    for(var i = 0; i < 9; i++) {
        content[i] = ' ';
    }

    $('.game_board').on('click', 'canvas', function () {
        alert(this.id);
    });

    $('.game_board').on('mouseenter', 'canvas', function () {
        $(this).addClass('moused_over');
    });

    $('.game_board').on('mouseleave', 'canvas', function () {
        if($(this).hasClass('moused_over')){
            $(this).removeClass('moused_over');
        };
    });
});