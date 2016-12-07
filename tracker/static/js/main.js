$(document).ready(function () {
    $('.datepicker').datepicker();
    $('#sessionStats').tablesorter();

    $('#sesh-submit-form').hide();

    $('#reg-new-sesh').click(function () {
        $('#sesh-submit-form').show();
    });

    $('#sesh-sumbit-close').click(function () {
        $('#sesh-submit-form').hide();
    });
});