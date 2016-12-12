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

    $('#filter-submit').click(function () {
        this.preventDefault();
    });

    $('#filter-form').on('submit', function (e) {
        e.preventDefault();
    });

    // calculate results on page load
    updateResultsFromTableData();

});

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