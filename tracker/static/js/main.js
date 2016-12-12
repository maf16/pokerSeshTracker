$(document).ready(function () {
    $('.datepicker').datepicker();
    $('#sessionStats').tablesorter();

    $('#sesh-submit-form').hide();
    $('#filter-container').hide();

    $('#reg-new-sesh').click(function () {
        $('#sesh-submit-form').show();
    });

    $('#sesh-sumbit-close').click(function () {
        $('#sesh-submit-form').hide();
    });

    $('#open-sesh-filters').click(function () {
        $('#filter-container').show();
    });

    $('#filter-close').click(function () {
        /* TODO: clear filters here as well */
        $('#filter-container').hide();
    });

    $('#filter-form').on('submit', function (e) {
        e.preventDefault();
        // extract known tokens (eg profit><=X) and get value for each filter
        var data = getFilterData();
        console.log(data);
        // loop over table rows applying each filter saved
        console.log(TABLE_IDXS[data[0]['name']]);

        // recalculate total and avg results, draw some new graphs(?)
        updateResultsFromTableData();

    });

    // calculate results on page load
    updateResultsFromTableData();

});


PROFIT_KEYWORD = 'profit';
TABLE_IDXS = {
    'profit': 3,
    'length': 4,
    'hourly': 5
};


function getFilterData() {
    var data = [];
    var tokens = $('#filter-input').val().split(' ');
    tokens.forEach(function (token) {
        var profitIdx = token.search(PROFIT_KEYWORD);
        if (profitIdx !== -1) {
            var profitCriteria = token.charAt(profitIdx + PROFIT_KEYWORD.length);
            var profitValue = token.substring(profitIdx + PROFIT_KEYWORD.length + 1);
            data.push({
                name: 'profit',
                criteria: profitCriteria,
                value: parseInt(profitValue, 10)
            });
        }


    });
    return data;
}


// updates results grabbing data from the table
function updateResultsFromTableData() {
    var totalProfit = 0; var profits = [];
    var totalSessionLength = 0; var sessionLengths = [];
    var totalHourly = 0; var hourlys = [];
    var avgProfit;
    var avgSessionLength;
    $('#session-form-data tr').each(function (idx, row) {
        var cells = $(row).children();
        profits.push($(cells[3]).html());
        sessionLengths.push($(cells[4]).html());
        hourlys.push($(cells[5]).html());
    });

    for (var i = 0; i < hourlys.length; ++i) {
        totalHourly += parseFloat(hourlys[i]);
    }

    for (var i = 0; i < profits.length; ++i) {
        totalProfit += parseInt(profits[i], 10);
    }
    avgProfit = (totalProfit / profits.length).toFixed(2);

    for (var i = 0; i < sessionLengths.length; ++i) {
        totalSessionLength += parseFloat(sessionLengths[i]);
    }
    avgSessionLength = (totalSessionLength / sessionLengths.length).toFixed(2);

    // TODO: maybe extract these into separate method later
    $('#total-profit').html(totalProfit);
    $('#total-hourly').html(totalHourly.toFixed(2));
    $('#total-session-length').html(totalSessionLength.toFixed(2));
    $('#avg-profit').html(avgProfit);
    $('#avg-session-length').html(avgSessionLength);
}