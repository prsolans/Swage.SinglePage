$(document).ready(function () {

    pageID = get_container_id();
    load_page_info(pageID);

    $('a#footer-menu-link').click(function () {

        if ($('#footer-menu').hasClass('footer-menu-closed')) {
            $('#footer-menu').animate({'bottom': '200'}, 500);
            $('#footer-menu').removeClass('footer-menu-closed');
            $('#footer-menu').addClass('footer-menu-expanded');
        }
        else {
            $('#footer-menu').animate({'bottom': '0'}, 500);
            $('#footer-menu').removeClass('footer-menu-expanded');
            $('#footer-menu').addClass('footer-menu-closed');
        }
    });

});

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

    var filename;
    var pageLayout;
    var title;

    var page = get_page_details(id);

    filename = page.filename;
    pageLayout = page.layout;
    title = page.title;

    // Set page layout

    if (pageLayout == 'one') {
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
        //$('#loaded-content').load(filename + '.html');
        //window.location = filename + '.html';
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

function get_page_details(id) {

    var pagelist = '{ "pages": [ { "id": 0, "title": "Splash", "filename": "index", "layout": "one" },' +
        '{ "id": 1, "title": "Main Menu", "filename": "Views/mainMenu", "layout": "two" },' +
        '{ "id": 2, "title": "Capabilities Home", "filename": "Views/capabilities/index", "layout": "three" },' +
        '{ "id": 3, "title": "Capabilities One", "filename": "Views/capabilities/one", "layout": "three" },' +
        '{ "id": 4, "title": "Products Home", "filename": "Views/products/index", "layout": "three" },' +
        '{ "id": 5, "title": "Products One", "filename": "Views/products/one", "layout": "three" },' +
        '{ "id": 6, "title": "Markets Home", "filename": "Views/capabilities/index", "layout" : "three" },' +
        '{ "id": 7,"title": "Markets One","filename": "Views/capabilities/one","layout": "three" }' +
        ']}';

    var select = JSON.parse(pagelist);

    item = select.pages[id];

    return item;
}
