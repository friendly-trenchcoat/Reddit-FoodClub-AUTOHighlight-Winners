// ==UserScript==
// @name           Reddit - Food Club AUTO-Highlight Winners 
// @namespace      https://github.com/friendly-trenchcoat
// @version        1.0
// @description    Winners are automatically found via NeoFoodClub.fr   Each bet table will have winning bets highlighted, and total winnings added up. Winnings listed at top now too.
// @author         friendly-trenchcoat
// @include        https://www.reddit.com/r/neopets/comments/*/food_club_bets_*
// @require	       http://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @connect        neofoodclub.fr
// ==/UserScript==

/*
      ,-= -.      
     /  +   \   
     |R.I.P |
\vV,,|_____|V,
    -----{C@

 REST IN PEACE DAQTOOLS
*/

(function() {
    'use strict';

    function highlight(winners){
        var cell;
        var winAmt;
        var winnings = [];
        $("tbody").each(function(k,v) { // for each table
            winAmt = 0;
            $(v).children().each(function(k,v) {    // for each row
                if ($(v).children().length >= 7){   // (if it's actually a bet table)
                    for (var i=1; i<6; i++){        // for each column
                        cell = $(v).children().eq(i);
                        if (!(winners.includes(cell.text())) && cell.text() !== '') { // if the cell contains a pirate that's not a winner
                            return true; // skip to next row
                        }
                    }
                    cell = $(v).children().eq(6);
                    winAmt += parseInt(cell.text());
                    $(v).css("background-color", "#ffc");
                }
                else winAmt = -1;
            });
            if (winAmt >= 0) {
                //console.log(winAmt);
                winnings.push([winAmt, $(v).parents('.thing').attr('data-author')]);
                $(v).parent().parent().prepend('<h1 class="winAmt">'+winAmt+':'+$(v).children().length+'</h1>');
            }
        });
        return winnings;
    }
    function winningsHTML(winnings) {
        winnings = winnings.sort(function(a,b) { return b[0]-a[0] });
        var html = '<table id="winnings"><tbody>';
        for (var user in winnings) html += `<tr><td>${winnings[user][0]}:10</td><td>${winnings[user][1]}</td></tr>`
        html += '</tbody></table>';
        return html;
    }

    var round = $("th[align='center']").first().text();
    var $post = $(".md").eq(1); // post body; we'll add winners/winnings to the end
    $post.append('<h1>Winners</h1>');

    GM_xmlhttpRequest ({
        method: 'GET',
        url: `http://neofoodclub.fr/rounds/${round}.json`,
        onload: function (value) {
            var response = JSON.parse(value.responseText);
            if (response['winners'][0] != 0) { // if the round is over
                var pirates = ['Dan', 'Sproggie', 'Orvinn', 'Lucky', 'Edmund', 'Peg Leg', 'Bonnie Pip', 'Puffo', 'Stuff', 'Squire', 'Crossblades', 'Stripey', 'Ned', 'Fairfax', 'Gooblah', 'Franchisco', 'Federismo', 'Blackbeard', 'Buck', 'Tailhook'];
                var winners = '';
                for (var i=0; i<5; i++) 
                    winners += `${pirates[response['pirates'][i][response['winners'][i]-1]-1]} | `; // 100% readable
                winners = winners.slice(0, -3);

                var winnings = highlight(winners);
                $post.append('<p>'+winners+'</p>');
                $post.append('<p><h1>Winnings</h1>'+winningsHTML(winnings)+'</p>');
                $('#winnings tr:nth-child(even)').css('background-color','#eee');
            }
            else $post.append("<p>Not yet declared.</p>");
        }
    });

})();



