$(document).ready(function () {
    $('.datepicker').datepicker();
    $('#sessionStats').tablesorter();

    $('#sesh-submit-form').hide();
    $('#filter-container').hide();
    $('#graphs-container').hide();

    $('#display-graphs').click(function () {
        $('#graphs-container').show();
    });

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
        $('#filter-container').hide();
    });

    $('#filter-clear').click(function () {
        $('#session-form-data tr').each(function (idx, row) {
            $(row).show();
        });
        updateResultsFromTableData();
    });

    $('#filter-form').on('submit', function (e) {
        e.preventDefault();
        // extract known tokens (eg profit><=X) and get value for each filter
        var data = getFilterData();
        // loop over table rows applying each filter saved
        $('#session-form-data tr').each(function (idx, row) {
            var cells = $(row).children();
            // apply each filter on a current table row
            if (data.length === 0) $(row).show();
            data.forEach(function (filter) {
                var qualifies = true;
                switch (filter.name) {
                    case 'profit':
                        switch (filter.criteria) {
                            case '>':
                                qualifies &= getPureVal(cells[TABLE_IDXS[filter.name]]) > filter.value;
                                break;
                            case '<':
                                qualifies &= getPureVal(cells[TABLE_IDXS[filter.name]]) < filter.value;
                                break;
                            default:
                                console.error('unknown criteria "' + filter.criteria + '" for filter "' + filter.name + '"');
                                //$(row).hide();
                        }
                        break;
                    case 'session_length':
                        switch (filter.criteria) {
                            case '>':
                                qualifies &= getPureVal(cells[TABLE_IDXS[filter.name]]) > filter.value;
                                break;
                            case '<':
                                qualifies &= getPureVal(cells[TABLE_IDXS[filter.name]]) < filter.value;
                                break;
                            case '=':
                                qualifies &= getPureVal(cells[TABLE_IDXS[filter.name]]) === filter.value;
                                break;
                            default:
                                console.error('unknown criteria "' + filter.criteria + '" for filter "' + filter.name + '"');
                        }
                        break;
                    case 'played_on':
                        // if any of the days in the list match, qualify this row
                        var matches_any_day = false;
                        filter.value.forEach(function (day) {
                            var day_of_week = moment(getPureVal(cells[TABLE_IDXS[filter.name]]), "DD/MM/YYYY").day();
                            matches_any_day |= DAYS_OF_WEEK[day_of_week] === day;
                        });
                        qualifies &= matches_any_day;
                        break;
                    default:
                        break;
                }
                if (qualifies) {
                    $(row).show();
                } else {
                    $(row).hide();
                }
            })
        });

        // recalculate total and avg results, draw some new graphs(?)
        updateResultsFromTableData();

    });

    // calculate results on page load
    updateResultsFromTableData();

});

// TODO: refactor to use this list
KEYWORDS = [
    {
        text: 'profit',
        type: 'int'
    },
    {
        text: 'played_on',
        type: 'list'
    },
    {
        text: 'session_length',
        type: 'float'
    }
];

DAYS_OF_WEEK = [
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
];

PROFIT_KEYWORD = 'profit';
SESSION_LENGTH_KEYWORD = 'session_length';
PLAYED_ON_KEYWORD = 'played_on';
TABLE_IDXS = {
    'profit': 3,
    'session_length': 4,
    'hourly': 5,
    'played_on': 6
};


function getFilterData() {
    var data = [];
    var tokens = $('#filter-input').val().split(' ');
    tokens.forEach(function (token) {
        // check for each keyword
        // TODO: for each keyword in the list do :

        // -- profit
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

        // -- session length
        var sessionLenIdx = token.search(SESSION_LENGTH_KEYWORD);
        if (sessionLenIdx !== -1) {
            var sessionLenCriteria = token.charAt(sessionLenIdx + SESSION_LENGTH_KEYWORD.length);
            var sessionLenVal = token.substring(sessionLenIdx + SESSION_LENGTH_KEYWORD.length + 1);
            data.push({
                name: 'session_length',
                criteria: sessionLenCriteria,
                value: parseFloat(sessionLenVal) // TODO: parse not only 1.11h but 4h35min val
            })
        }

        // -- days played on
        var daysPlayedIdx = token.search(PLAYED_ON_KEYWORD);
        if (daysPlayedIdx !== -1) {
            var filterDays = [];
            var days = token.substring(daysPlayedIdx + PLAYED_ON_KEYWORD.length + 1).split(',');
            days.forEach(function (day) {
                if ($.inArray(day.toUpperCase(), DAYS_OF_WEEK) > 0) {
                    filterDays.push(day.toUpperCase());
                }
            });
            if (filterDays.length > 0) {
                data.push({
                    name: 'played_on',
                    value: filterDays
                })
            }
        }
    });
    return data;
}


// updates results grabbing data from the table
function updateResultsFromTableData() {
    var totalProfit = 0; var profits = [];
    var totalSessionLength = 0; var sessionLengths = [];
    var totalHourly = 0; var hourlys = [];
    var dates = [];
    var avgProfit;
    var avgSessionLength;
    $('#session-form-data tr').each(function (idx, row) {
        if ($(row).is(':visible')) {
            var cells = $(row).children();
            profits.push($(cells[3]).html());
            sessionLengths.push($(cells[4]).html());
            hourlys.push($(cells[5]).html());
            dates.push($(cells[6]).html());
        }
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


    // draw/redraw graphs here

    // clear old graphs
    $('#cumul-profit-graph').html("");

    // generate cumulative profits array
    var cumulprofits = profits.slice().map(function (n) {
        return parseInt(n, 10);
    });
    for (var i = 1; i < cumulprofits.length; ++i) {
        cumulprofits[i] += cumulprofits[i-1];
    }
    var items = [];
    cumulprofits.forEach(function (val, idx) {
        items.push({
            x: dates[idx].split('/').reverse().join('-'),
            y: val
        })
    });
    console.log(items);
    var dataset = new vis.DataSet(items);
    var options = {
     //   start: dates[0].split('/').reverse().join('-'),
     //   end: dates[dates.length-1].split('/').reverse().join('-')
    };
    var container = document.getElementById('cumul-profit-graph');

    var cumulGraph = new vis.Graph2d(container, dataset, options);

}


function getPureVal(elem) {
    return $(elem).html();
}
