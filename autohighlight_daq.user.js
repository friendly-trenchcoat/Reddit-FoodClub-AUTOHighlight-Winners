// ==UserScript==
// @name           Reddit - Food Club AUTO-Highlight Winners - DEAD
// @namespace      https://github.com/friendly-trenchcoat
// @version        1.2
// @description    Winners are automatically found via daqtools. Each bet table will have winning bets highlighted, and total winnings added up.
// @author         friendly-trenchcoat
// @include        https://www.reddit.com/r/neopets/comments/*/food_club_bets_*
// @require	       http://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @connect        foodclub.daqtools.info
// ==/UserScript==

function highlight(winners){
    var cell;
    var winAmt;
    $("tbody").each(function(k,v) { // for each table
        winAmt = 0;
        $(v).children().each(function(k,v) { // for each row
            if ($(v).children().length >= 7){      // (if it's actually a bet table)
                console.log($(v).children().length);
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
            console.log(winAmt);
            $(v).parent().parent().prepend('<h1 class="winAmt">'+winAmt+':'+$(v).children().length+'</h1>');
        }
    });
}

// Go to daqtools page for given round and retrieve the reported winners
var round = $("th[align='center']").first().text();
var url = "http://foodclub.daqtools.info/index.php?round="+round;
var post = $(".md").eq(1); // main post, which we'll add the winners onto at the bottom
post.append('<h1>Winners</h1>');
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







