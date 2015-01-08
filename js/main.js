/**
 * Get the ID of the page content
 * @returns int;
 */
function get_container_id() {
    var item;
    item = $('#page-container').data('pageid');

    return item;
}

///**
// * Collects app settings array
// * @returns array
// */
//function get_app_settings() {
//    var settings;
//    settings = {
//        culture: "EN"
//    };
//
//    return settings;
//}

/**
 * Determine if autoplay is currently active
 * @returns {boolean}
 */
function get_autoplay_setting() {

    var control = $('#autoplay-control');

    if (control.hasClass('autoplay-off')) {
        return false;
    }
    else if (control.hasClass('autoplay-on')) {
        return true;
    }

    return false;
}

/**
 * Using the page ID, gather and display page layout and HTML content
 * @param id
 */
function load_page_info(id) {

    var filename = null;
    var layout = null;
    var title = null;

    $.ajax({
        url: 'data/pagelist.json',
        async: false,
        dataType: 'json',
        success: function (json) {
            filename = json.pages[id].filename;
            title = json.pages[id].title;
            layout = json.pages[id].layout;
        }
    });

    // Set page layout

    if (layout == 'one') {
        $('#section-menu-button').hide();
        $('#view-content-button').show();
        $('#loaded-content').hide();
    }
    else {
        $('#section-menu-button').show();
        $('#view-content-button').hide();
        $('#loaded-content').show();
    }
    // Display page information

    $('#page-container').attr('data-pageid', id);

    $('#page-title').html(title);

    // IF not the first page, load in html from Views folder
    if (id != 0) {
        $('#loaded-content').load(filename + '.html');
    }

    // AUTOPLAY SETTINGS

    if (get_autoplay_setting() == true) {
        run_autoplay(id);
    }

}

/**
 * Determines the next page in the page sequence, and displays it
 * @param id
 */
function run_autoplay(id) {

    var control = $('#autoplay-control');

    if (control.hasClass('autoplay-off')) {
        control.html("Autoplay On").addClass('autoplay-on').removeClass('autoplay-off');
        control.attr("onclick", "stop_autoplay()");
    }

    var request = new XMLHttpRequest();
    request.open("GET", "data/pagelist.json", false);
    request.send(null);
    var item = JSON.parse(request.responseText);

    // If there is a next page, display it
    if (typeof item.pages[id + 1] === 'object') {
        setTimeout(function () {
            load_page_info(id + 1)
        }, 3000);
    }
    // Else display the first page
    else {
        setTimeout(function () {
            load_page_info(0)
        }, 3000);
    }

    //$('#page-container').delay(2750).fadeOut(250);
    //$('#page-container').fadeIn(250);
}

/**
 * Terminates autoplay
 * @returns {boolean}
 */
function stop_autoplay() {
    var control = $('#autoplay-control');

    if (control.hasClass('autoplay-on')) {
        control.html("Autoplay Off").addClass('autoplay-off').removeClass('autoplay-on');
        control.attr("onclick", "run_autoplay(get_container_id())");
    }

    return false;
}

