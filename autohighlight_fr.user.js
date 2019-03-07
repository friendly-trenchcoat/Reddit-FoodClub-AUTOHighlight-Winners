// ==UserScript==
// @name           Reddit - Food Club AUTO-Highlight Winners 
// @namespace      https://github.com/friendly-trenchcoat
// @version        0.1
// @description    Winners are automatically found via NeoFoodClub.fr   Each bet table will have winning bets highlighted, and total winnings added up.
// @author         friendly-trenchcoat
// @include        https://www.reddit.com/r/neopets/comments/*/food_club_bets_*
// @include        http://neofoodclub.fr/
// @require	       http://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
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
            $(v).children().each(function(k,v) { // for each row
                if ($(v).children().length >= 7){      // (if it's actually a bet table)
                    //console.log($(v).children().length);
                    for (var i=1; i<6; i++){           // for each column
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

    if (document.URL.indexOf("reddit") != -1) {
        var round = $("th[align='center']").first().text();
        console.log(round);
        var url = "http://neofoodclub.fr/#round="+round;
        var post = $(".md").eq(1); // main post, which we'll add the winners onto at the bottom
        post.append('<a href="'+url+'"><h1>Winners</h1></a>');

        if (round == GM_getValue("round")){
            //do stuff
            winners = GM_getValue("winners");
            var winnings = highlight(winners);
            post.append('<p>'+winners+'</p>');
            post.append('<p><h1>Winnings</h1>'+winningsHTML(winnings)+'</p>');
            $('#winnings tr:nth-child(even)').css('background-color','#eee');
        }
        else console.log('not');
    }
    else {
        var winners = "";
        $(".won").each(function(k,v) {
            //console.log($(v).children().first().text());
            if (k<5) winners += $(v).children().first().text();
            if (k<4) winners += " | ";
        });
        console.log(winners);
        var round = $('textarea:contains("#round=")').text().match(/#round=([0-9,\,]*)&/)[1];
        GM_setValue("round", round);
        GM_setValue("winners", winners);
    }
})();

/*
GM_xmlhttpRequest ({
    method: 'GET',
    url: url,
    onload: function (value) {
        var source = value.responseText;
        if ( $(source).find(".winner").length > 0 ) {   // if the round is over
            var winners = "";
            $(source).find(".winner").each(function(k,v) {
                winners += $(v).text();
                if (k<4) winners += " | ";
            });
            highlight(winners);
            post.append('<p>'+winners+'</p>');
        }
        else post.append("<p>Not yet declared.</p>");  // if the round is not over
    }
});
*/




