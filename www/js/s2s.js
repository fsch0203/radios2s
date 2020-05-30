var version = "1.1.2";
_settings = JSON.parse(localStorage.getItem('settings'));
if (jQuery.isEmptyObject(_settings)){
    _settings = { //global variables that are stored in localstorage
        screenx: 1300, //position window
        screeny: 100,
        screenw: 474,
        screenh: 720,
        maxfavorites: 100,
        laststation: 0,
        lastvolume: 0.1,
        language: "en",
        listorder: 'stars-updated'
    };
    localStorage.setItem('settings', JSON.stringify(_settings));
}
var _servers = []; //available radio-browser servers
var queryLimit = 200;
var queryStart = 0; //start record in query
var player;
// var castconnected = "unavailable";
var _stationplaying; //object
var thisdevice = {
    model: "",
    uuid: ""
};
var lgnr; //us:0, nl:1
var _lg;
var run_as = 'web'; //run as web-application (default: web), as chrome-extension (ext), as chrome-app (app) or as NodeWebkit-app (kit)
try {
    var manifest = chrome.runtime.getManifest(); //OK for ext
    run_as = manifest.name.slice(-3).toLowerCase(); //get last 3 characters of name (='ext')
    version = manifest.version;
} catch (err) {
    //run_as = 'web';
}
console.log('run_as' + ': ' + run_as);

function init() { //triggered by get_radiobrowser_base_urls() or document.ready
    // test_makeTaffy(); //only needed for testing migration
    _settings = JSON.parse(localStorage.getItem("settings"));//always exist
    stations = JSON.parse(localStorage.getItem("stations")); 
    if (jQuery.isEmptyObject(stations)){
        taffy_favorits = JSON.parse(localStorage.getItem("taffy_favorits"));
        if (!(jQuery.isEmptyObject(taffy_favorits))){ //in LS no stations but taffy_favorits exists
            console.log(`start migrating old taffy-data`);
            migrateTaffy(); // Migrate taffy to stations, then getStation -> getStation -> showFavorites
        } else { //no stations no taffy
            ShowFavorites(true); //message that there are no favorites yet
        }
    } else { // there are stations in LS
        getStation(_settings.laststation); //normal route
    }
    if (typeof _settings.lastvolume === 'undefined') {
        _settings.lastvolume = 0.1;
        localStorage.setItem('settings', JSON.stringify(_settings));
    }
    var vol = _settings.lastvolume;
    setVolume(vol);
    vol = 100 * Math.pow(vol, 1 / 2);
    // $("#volume-slider").simpleSlider("setValue", vol);
    $("#volume-slider").val(vol);
}

function migrateTaffy() {
    var urls = [];
    var rb_url = 'http://www.radio-browser.info/webservice/json/stations/byid/';
    let favorits = JSON.parse(localStorage.getItem('taffy_favorits'));
    favorits.forEach((favorit) => { //make an array of urls to fetch
        urls.push(rb_url + favorit.id);
    });
    let stationsold = [];
    Promise.allSettled(urls.map(url => // use map() to perform a fetch and handle the response for each url
            fetch(url)
            .then(response => response.json())
            .then((results) => {
                if (results.length > 0) {
                    let result = results[0];
                    objIndex = favorits.findIndex((obj => obj.id == result.id));
                    result.rating = favorits[objIndex].rat;
                    result.date = new Date().toISOString();
                    stationsold.push(result);
                }
            })
            .catch(error => {
                console.error(`Error: ${error} `);
            })
        ))
        .then(data => { // we have them all (resolved or rejected)
            localStorage.setItem('stations', JSON.stringify(stationsold));
            getStation(_settings.laststation);
            localStorage.removeItem("taffy_favorits");
            localStorage.removeItem("laststation");
            localStorage.removeItem("lastvolume");
        })
}

try {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'User-Agent') {
                    // console.log(`${details.requestHeaders[i].value}`);
                    details.requestHeaders[i].value = `RadioS2S/${version}/${run_as}`;
                    // console.log(`${details.requestHeaders[i].value}`);
                    break;
                }
            }
            return {
                requestHeaders: details.requestHeaders
            };
        }, {
            urls: ['<all_urls>']
        },
        ['blocking', 'requestHeaders']
    );
} catch (err) {
    //run_as = 'web';
}

function w3_open() { //sidebar open, overlay for dark background
    $("#mySidebar").show();
    $("#myOverlay").show();
}

function w3_close() {
    $("#mySidebar").hide();
    $("#myOverlay").hide();
}

function FillSelectOptions() {
    var list, sel, n, arr;
    // countries +++++++++++++++++++++++++++++++++++++++++++
    list = '<option value="">' + _lg.Country + '</option>';
    if (localStorage.selcountries) {
        var selcountries = localStorage.selcountries.split(","); //array of earlier selected countries
    }
    list += showRecent("cou", selcountries);
    arr = [];
    for (n = 0; n < countries[0].length; n++) {
        arr[n] = [];
        arr[n][0] = countries[lgnr][n];
        arr[n][1] = n;
    }
    arr.sort(function (a, b) { //sort on translated country name with correct index number
        return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
    });
    for (n = 0; n < countries[0].length; n++) {
        list += '<option value="' + arr[n][1] + '">' + arr[n][0] + '</option>';
    }
    $('.country').html(list);
    // styles +++++++++++++++++++++++++++++++++++++++++++
    list = '<option value="">' + _lg.Style + '</option>';
    if (localStorage.selstyles) {
        var selstyles = localStorage.selstyles.split(","); //array of earlier selected styles
    }
    list += showRecent("sty", selstyles);
    arr = [];
    for (n = 0; n < styles[0].length; n++) {
        arr[n] = [];
        arr[n][0] = styles[lgnr][n];
        arr[n][1] = n;
    }
    arr.sort(function (a, b) { //sort on translated country name with correct index number
        return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
    });
    for (n = 0; n < styles[0].length; n++) {
        list += "<option value='" + arr[n][1] + "'>" + arr[n][0] + "</option>";
    }
    $('.style').html(list);
    // languages +++++++++++++++++++++++++++++++++++++++++++
    list = '<option value="">' + _lg.Language + '</option>';
    if (localStorage.sellanguages) {
        var sellanguages = localStorage.sellanguages.split(","); //array of earlier selected languages
    }
    list += showRecent("lan", sellanguages);
    arr = [];
    for (n = 0; n < languages[0].length; n++) {
        arr[n] = [];
        arr[n][0] = languages[lgnr][n];
        arr[n][1] = n;
    }
    arr.sort(function (a, b) { //sort on translated country name with correct index number
        return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
    });
    for (n = 0; n < languages[0].length; n++) {
        list += "<option value='" + arr[n][1] + "'>" + arr[n][0] + "</option>";
    }
    $('.language').html(list);
}

function showRecent(cat, items) { //input: array of index numbers
    var list;
    if (items) {
        list = "<optgroup label='Recent'>"
        for (n = items.length - 1; n >= 0; n--) {
            list += "<option value=" + items[n] + ">"
            if (cat == "cou") {
                list += countries[lgnr][Number(items[n])];
            } else if (cat == "sty") {
                list += styles[lgnr][Number(items[n])];
            } else if (cat == "lan") {
                list += languages[lgnr][Number(items[n])];
            }
            list += "</option>";
        }
        list += "</optgroup>";
        list += "<optgroup label='All'></optgroup>";
    } else {
        list = '';
    }
    return list;
}

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
$(window).scroll(function (event) {
    didScroll = true;
});
setInterval(function () { //check scroll every 250ms
    // saveWindowPosition();
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var navbarHeight = $('header').outerHeight();
    var st = $(this).scrollTop();
    queryStart = (st === 0) ? 0 : queryStart; //reset start if on top
    var sh = $('body').outerHeight(); //scroll height
    var p = st / sh;
    if (p > 0.9) { // almost at bottom: get new records
        queryStart += 1;
        Select();
    }
    if (Math.abs(lastScrollTop - st) <= delta)
        return;
    if (st > lastScrollTop && st > navbarHeight) {
        $('header').removeClass('nav-down').addClass('nav-up');
    } else {
        $('header').removeClass('nav-up').addClass('nav-down');
    }
    lastScrollTop = st;
} // END: hide header when scrolling down

function setWindow() {
    window.moveTo(_settings.screenx, _settings.screeny);
    self.resizeTo(_settings.screenw, _settings.screenh);
}

function saveWindowPosition() { //activated after getStation and showFavorites
    _settings.screenx = window.screenX; //position is saved after every calculation
    _settings.screeny = window.screenY;
    _settings.screenw = window.outerWidth;
    _settings.screenh = window.outerHeight;
    localStorage.setItem('settings', JSON.stringify(_settings));
}

function setVolume(volume) {
    player.volume = volume;
    _settings.lastvolume = volume;
    localStorage.setItem('settings', JSON.stringify(_settings));
    // localStorage.setItem("lastvolume", volume);
}

function getStation(id) { //select station to play
    _servers = JSON.parse(localStorage.getItem('servers'));
    saveWindowPosition();
    var stations =  JSON.parse(localStorage.getItem('stations'));
    if (id == 0 && jQuery.isEmptyObject(stations)){
        ShowFavorites(true);
    } else {
        if (id == 0){
            id = stations[0].stationuuid;
        }
        if (_servers){
            $.post(_servers[0] + "/json/stations/byuuid/" + id, //get playable station url
                function (results) {
                    if (results.length > 0) {
                        let station = results[0];
                        setStation(station);
                    }
            });
        }
    }
}

function setStation(station) {
    var urlfavicon = station.favicon;
    if (station.favicon) {
        $('.favicon').css({
            "background-image": "url(" + urlfavicon + ")",
            "display": "block"
        })
    } else {
        $('.favicon').css("display", "none")
    }
    _stationplaying = station;
    let id = station.stationuuid;
    _settings.laststation = id;
    localStorage.setItem('settings', JSON.stringify(_settings));
    $("#selectedstation").html(station.name + " - " + station.bitrate + " kbps");
    var stations = JSON.parse(localStorage.getItem('stations'));
    let rating = 0;
    if (stations) {
        objIndex = stations.findIndex((obj => obj.stationuuid == id));
        rating = (objIndex > -1) ? stations[objIndex].rating : 0; //if station already rated use rating
    }
    $('#rateitfooter').rateit('value', rating)
    console.log(`urlplaying: ${station.url} with id: ${id}`);
    $("#player").attr("src", station.url);
    var x1 = jQuery.trim(station.url).substring(0, 42).trim(this);
    x1 = (station.url.length > x1.length) ? x1 + "..." : x1;
    $(".url").html(x1);
    updateStation(rating, station);
    ShowFavorites(false);
    $.get("https://ipinfo.io", function (ipinfo) {
        // console.log(`${JSON.stringify(ipinfo)}`);
        var body = {
            id: id,
            tit: station.name,
            ip: ipinfo.ip,
            hostname: ipinfo.hostname,
            city: ipinfo.city,
            region: ipinfo.region,
            country: ipinfo.country,
            loc: ipinfo.loc,
            org: ipinfo.org,
            mod: thisdevice.model,
            uuid: thisdevice.uuid
        }
        var url = "https://radios2s.scriptel.nl/sure/savestation04.php";
        $.post(url, body, function (result) {
            console.log('posted to radios2s.scriptel.nl: ' + result.id);
        });
    }, "jsonp");
}


function EditStation(tit) {
    var xtrastations = JSON.parse(localStorage.getItem('xtrastations'));
    if (!(xtrastations)) xtrastations = [];
    objIndex = xtrastations.findIndex((obj => obj.tit == tit));
    if (objIndex > -1) {
        rs = xtrastations[objIndex];
        document.getElementById('editstation').style.display = 'block';
        $("#itit").val(tit);
        $("#icou").val(rs.cou);
        $("#isty").val(rs.sty);
        $("#ilan").val(rs.lan);
        $("#iu1").val(rs.u1);
        $("#ihom").val(rs.hom);
        $("#ista").val(rs.sta);
        $("#ifav").val(rs.fav);
    }
}

function Select() {
    var sel;
    var st = queryStart * queryLimit;
    // console.log('st queryStart queryLimit;' + ': ' + st +' '+ queryStart +' '+ queryLimit);
    var cou_nr = $("#cou").val(); //index of selected country
    var sty_nr = $("#sty").val(); //index of selected style
    var lan_nr = $("#lan").val(); //index of selected language
    cou = ($("#cou").val() == '') ? '' : countries[0][cou_nr]; //us-name of country
    sty = ($("#sty").val() == '') ? '' : styles[0][sty_nr];
    lan = ($("#lan").val() == '') ? '' : languages[0][lan_nr];
    filter = $("#myFilter").val();
    var param = {
        name: filter,
        country: cou,
        tag: sty,
        language: lan,
        offset: st,
        limit: queryLimit
    };
    _servers = JSON.parse(localStorage.getItem('servers'));
    $.post(_servers[0] + "/json/stations/search", param, //get stations
        function (results) {
            var list = '';
            var n = 0;
            for (i in results) {
                list += `<tr id=${results[i].stationuuid}><td class="td-left"></td><td class="td-center">
            <span>${results[i].name}</span></td>
            <td class="td-right"><span class="edit-icon"><img src="./res/img/info-128x128.png" width="30"></span></td>
            </tr>`;
            }
            if (queryStart === 0) {
                $('#activelist').html(list);
            } else {
                $('#activelist').append(list);
            }
        });
    // $('#cont-cou, #cou, #cont-sty, #sty, #cont-lan, #lan').removeClass('fs-dark-gray').addClass('fs-black');
    if (cou === '' && sty === '' && lan === '') {} else if (cou !== '' && sty === '' && lan === '') {
        // $('#cont-cou, #cou').removeClass('fs-black').addClass('fs-dark-gray');
        storeSelection(cou_nr.toString(), "selcountries");
        $("#cou").val(cou_nr); //show selected country in header
    } else if (cou === '' && sty !== '' && lan === '') {
        // $('#cont-sty, #sty').removeClass('fs-black').addClass('fs-dark-gray');
        storeSelection(sty_nr.toString(), "selstyles");
        $("#sty").val(Number(sty_nr));
    } else if (cou === '' && sty === '' && lan !== '') {
        // $('#cont-lan, #lan').removeClass('fs-black').addClass('fs-dark-gray');
        storeSelection(lan_nr.toString(), "sellanguages");
        $("#lan").val(lan_nr);
    } else if (cou !== '' && sty !== '' && lan === '') {
        // $('#cont-cou, #cou, #cont-sty, #sty').removeClass('fs-black').addClass('fs-dark-gray');
        storeSelection(cou_nr.toString(), "selcountries");
        storeSelection(sty_nr.toString(), "selstyles");
        $("#cou").val(cou_nr);
        $("#sty").val(sty_nr);
    } else if (cou !== '' && sty === '' && lan !== '') {
        // $('#cont-cou, #cou, #cont-lan, #lan').removeClass('fs-black').addClass('fs-dark-gray');
        storeSelection(cou_nr.toString(), "selcountries");
        storeSelection(lan_nr.toString(), "sellanguages");
        $("#cou").val(cou_nr);
        $("#lan").val(lan_nr);
    } else if (cou === '' && sty !== '' && lan !== '') {
        // $('#cont-sty, #sty, #cont-lan, #lan').removeClass('fs-black').addClass('fs-dark-gray');
        storeSelection(sty_nr.toString(), "selstyles");
        storeSelection(lan_nr.toString(), "sellanguages");
        $("#sty").val(sty_nr);
        $("#lan").val(lan_nr);
    } else if (cou !== '' && sty !== '' && lan !== '') {
        // $('#cont-cou, #cou, #cont-sty, #sty, #cont-lan, #lan').removeClass('fs-black').addClass('fs-dark-gray');
        storeSelection(cou_nr.toString(), "selcountries");
        storeSelection(sty_nr.toString(), "selstyles");
        storeSelection(lan_nr.toString(), "sellanguages");
        $("#cou").val(cou_nr);
        $("#sty").val(sty_nr);
        $("#lan").val(lan_nr);
    }
}

function storeSelection(elem, str) {
    var sel;
    if (localStorage.getItem(str)) { // there are earlier selected countries/styles/languages
        sel = localStorage.getItem(str).split(","); // set in array
        if (sel.indexOf(elem) < 0) { //if not already existing
            sel.push(elem); //add to array
        }
    } else { //no earlier selected countries
        sel = [elem];
    }
    var n = sel.length;
    if (n > 4) { //max # of recent countries
        sel = sel.slice(n - 4);
    }
    localStorage.setItem(str, sel.toString());
    FillSelectOptions();
}

function ShowFavorites(warning) { //if warning is true: message if there are no favorites (at start and if user clicks favorites button)
    saveWindowPosition();
    var list = '';
    $("#cou, #sty, #lan").val('').prop('selected', true);
    $("#myFilter").val('');
    $('#cont-cou, #cou, #cont-sty, #sty, #cont-lan, #lan').removeClass('fs-dark-gray').addClass('fs-black');
    var stations = JSON.parse(localStorage.getItem('stations'));
    if (!(jQuery.isEmptyObject(stations))) {
        if (_settings.listorder === 'updated') {
            stations = stations.sort(fieldSorter(['-date']));
        } else {
            stations = stations.sort(fieldSorter(['-rating', '-date']));
        }
        stations.forEach((station) => {
            var flag = '';
            if (station.countrycode) {
                flag = `https://www.countryflags.io/${station.countrycode}/flat/16.png`;
            } else if (station.country) {
                let objIndex = countrynames.findIndex((obj => obj.name.toLowerCase().includes(station.country.toLowerCase())));
                flag = `https://www.countryflags.io/${countrynames[objIndex].code}/flat/16.png`;
            } else {
                flag = "./res/img/pe.png";
            }
            var favicon = (station.favicon) ? station.favicon : "./res/img/info-128x128.png";
            list += `<tr id=${station.stationuuid}><td class="td-left"></td><td class="td-center">
            <span class="countryflag"><img src="${flag}"></span>
            <span class="label-small"><img src="./res/img/${station.rating}star.png" width="60"></span>
            <span class="label-small" style="float:right">${date2LocalString(station.date)}</span><br>
            <span>${station.name}</span></td>
            <td class="td-right"><span class="edit-icon"><img class="stationfavicon" src=${favicon} width="40""></span></td>
            </tr>`;
        });
        $('#activelist').html(list);
    } else if (warning) { //no favorites yet
        var msg = "<h4>" + _lg.wrn02 + "</h4>";
        msg += "<p>" + _lg.wrn03 + "</p>";
        var hd = _lg.wrn01;
        $("#favicon").removeClass("favicon2");
        $("#logo").hide();
        showMessage(hd, msg);
        Select();
    } else { //no favorites, no warning
        $("#favicon").removeClass("favicon2");
        $("#popup01").hide();
        Select();
    }
}

function date2LocalString(date) {
    var dd = new Date(date);
    dd = dd.toLocaleString(_settings.language, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: "2-digit",
        minute: "2-digit"
    });
    return dd;
}

function UrlCheck(url) {
    var exp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
    var regex = new RegExp(exp);
    if (url.match(regex)) {
        return true;
    } else {
        return false;
    }
}

$(window).on("load", function () {
    // console.log('document loaded');
    document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady() { //Only relevant for android app. Cordova's device APIs have loaded and are ready to access
    console.log('onDeviceReady triggered');
    detectLanguage(); //check device globalization
    // var loadCastInterval = setInterval(function () {
    //     if (chrome.cast.isAvailable) {
    //         clearInterval(loadCastInterval);
    //         initializeCastApi();
    //     } else {}
    // }, 1000);
    thisdevice.model = device.model; //users device
    thisdevice.uuid = device.uuid; //unique id of device
}

function showMessage(hd, msg) {
    $("#popupheader").html(hd);
    $("#popupmessage").html(msg);
    $("#popup01").show();
}

function swipe() { //activates swiperight and swipeleft
    var maxTime = 1000, // allow movement if < 1000 ms (1 sec)
        maxDistance = 10, // swipe movement of 50 pixels triggers the swipe
        target = $('#verticalbar'), //thin vertical bar on left side of screen
        startX = 0,
        startTime = 0,
        touch = "ontouchend" in document,
        startEvent = (touch) ? 'touchstart' : 'mousedown',
        moveEvent = (touch) ? 'touchmove' : 'mousemove',
        endEvent = (touch) ? 'touchend' : 'mouseup';
    target.on(startEvent, function (e) {
        e.preventDefault(); // prevent image drag (Firefox)
        startTime = e.timeStamp;
        startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
    }).on(endEvent, function (e) {
        startTime = 0;
        startX = 0;
    }).on(moveEvent, function (e) {
        e.preventDefault();
        var currentX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
            currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX),
            currentTime = e.timeStamp;
        if (startTime !== 0 && currentTime - startTime < maxTime && currentDistance > maxDistance) {
            if (currentX < startX) { // swipe left code here
                w3_close();
            }
            if (currentX > startX) { // swipe right code here
                w3_open();
            }
            startTime = 0;
            startX = 0;
        }
    });
}

function showStation(id) {
    var stations = JSON.parse(localStorage.getItem('stations'));
    objIndex = stations.findIndex((obj => obj.stationuuid == id));
    if (objIndex > -1) {
        var rs = stations[objIndex];
        $("#thumb-open").show();
        $("#thumb-closed").hide();
        console.log(`${id}`);
        if (rs.favicon) {
            $("#favicon2").addClass("favicon2");
            $('.favicon2').css({
                "background-image": "url(" + rs.favicon + ")",
                "display": "block"
            })
        }
        if (id == _stationplaying.stationuuid) {
            $("#playingstat").html(_lg.Playingstation);
        } else {
            $("#playingstat").html(_lg.Infostation);
        }
        $('.titplaying').html(rs.name);
        $('#inf-urlplaying').html(rs.url);
        $("#inf-homeurl").attr("href", rs.homepage);
        $("#inf-homeurl").html(rs.homepage);
        $("#inf-country").html(rs.country); //deprecated
        $("#inf-state").html(rs.state);
        $("#inf-tags").html(rs.tags);
        $("#inf-language").html(rs.language);
        $("#inf-codec").html(rs.codec);
        $("#inf-bitrate").html(rs.bitrate + '&nbsp;kb/s');
        $('#inf-votes').html(rs.votes);
        var rating = (rs.rating) ? rs.rating : 0;
        console.log(`${rating}`);
        $('#rateitinfo').rateit('value', rating);
        $('#rateitinfo').closest('tr').attr('id', id);
        $('#rateitinfo').closest('tr').attr('name', rs.name);
        $("#infoplayingstation").show();
    } else {
        alert(_lg.noinfo);
        stations.splice(objIndex, 1);
        localStorage.setItem('stations', JSON.stringify(stations));
        ShowFavorites(false);
    }
}

$(document).ready(function () {
    setWindow();
    swipe();
    player = document.getElementById('player');
    detectLanguage();
    FillSelectOptions();
    showHtml();
    servers = JSON.parse(localStorage.getItem("servers"));
    if (!(jQuery.isEmptyObject(servers))){ //start with servers from LS
        init();
    }
    get_radiobrowser_base_urls(); //get working servers and then (if necessary) getStation with laststation
    $('img').on('error', function () { //not working yet
        console.log(`img replaced`);
        $(this).attr("src", "./res/img/info-128x128.png");
    });
    $('#rateitinfo').bind('rated', function (e, rating) {
        var id = $(this).closest('tr').attr('id');
        var stations = JSON.parse(localStorage.getItem('stations'));
        objIndex = stations.findIndex((obj => obj.stationuuid == id));
        if (objIndex > -1) {
            console.log(`reset`);
            // var name = $(this).closest('tr').attr('name');
            updateStation(rating, stations[objIndex]);
            ShowFavorites(false);
        }
    });
    $("#rateitinfo").bind('reset', function () {
        var id = $(this).closest('tr').attr('id');
        var stations = JSON.parse(localStorage.getItem('stations'));
        objIndex = stations.findIndex((obj => obj.stationuuid == id));
        if (objIndex > -1) {
            console.log(`reset`);
            updateStation(0, stations[objIndex]);
            ShowFavorites(false);
        }
    });
    $('#rateitfooter').bind('rated', function (e, rating) {
        updateStation(rating, _stationplaying);
        ShowFavorites(false);
    });
    $("#rateitfooter").bind('reset', function () {
        updateStation(0, _stationplaying);
        ShowFavorites(false);
    });
    $("#pause").on('click', function () {
        $("#player").attr("src", '');
        $("#play").show();
        $("#pause").hide();
    });
    $("#play").on('click', function () {
        $("#player").attr("src", _stationplaying.url);
        $("#play").hide();
        $("#pause").show();
    });
    $("#closeapp").on('click', function () {
        // detectLanguage(); //next time the right language setting will apply (if setting has changed)
        if (navigator.app) { //closing is necessary if user wants to apply new language settings (if changed)
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        } else {
            self.close(); //closes chrome window
            console.log('app would now close');
        }
    });
    $('#myFilter').on("focus", function () {
        $('#footer').removeClass('footerup').addClass('footerdown');
    });
    $('#myFilter').on("focusout", function () {
        $('#footer').removeClass('footerdown').addClass('footerup');
    });
    $('#myFilter').keyup(function () {
        Select();
    });
    $("#cou, #sty, #lan").change(function () {
        queryStart = 0;
        Select();
    });
    $("#ratingselect").click(function () {
        // console.log(`ratingselect`);
        if (_settings.listorder === 'stars-updated') {
            _settings.listorder = 'updated';
            $("#ratingselectimg").attr('src', './res/img/star-open.png');
        } else {
            _settings.listorder = 'stars-updated';
            $("#ratingselectimg").attr('src', './res/img/star-full.png');
        }
        localStorage.setItem('settings', JSON.stringify(_settings));
        ShowFavorites(false);
    });
    $("#favorites").on('click', function () {
        ShowFavorites(true);
    });
    $(document).on('input change', '#volume-slider', function() {
        let vol = $(this).val() / 100;
        vol = Math.pow(vol, 2); //better scaling for volume
        setVolume(vol); // The value as a ratio of the slider (between 0 and 1)
    });
    $("#thumb-open").on('click', function () {
        var id = $(this).closest('tr').prev().attr('id');
        $.post(_servers[0] + "/json/vote/" + id, //set vote
            function (results) {
                var x = (Number($('#inf-votes').text()) + 1).toString();
                if (results.ok == true) {
                    $('#inf-votes').html(x); //show increased number of votes
                    $("#thumb-open").hide();
                    $("#thumb-closed").show();
                } else {
                    alert(results.message);
                }
                console.log('id msg ok' + ': ' + id + ' ' + results.message + ' ' + results.ok);
            });
    });
    $("#thumb-closed").on('click', function () {
        console.log('do nothing');
    });
    $("#inf-removestation").on('click', function () {
        var id = $(this).closest('tr').prev().prev().attr('id');
        console.log(`remove station ${id}`);
        var stations = JSON.parse(localStorage.getItem("stations"));    
        objIndex = stations.findIndex((obj => obj.stationuuid == id));
        stations.splice(objIndex,1);
        localStorage.setItem('stations', JSON.stringify(stations));
        $("#infoplayingstation").hide();
        ShowFavorites();
    });
    $("#activelist").on('click', 'tr td:nth-child(2)', function () {
        var id = $(this).closest('tr').attr('id');
        console.log('id' + ': ' + id);
        getStation(id);
    });
    $("#activelist").on('click', 'tr td:nth-child(3)', function () {
        var id = $(this).closest('tr').attr('id');
        console.log('id' + ': ' + id);
        showStation(id);
    });
    $("#editlist").on('click', 'tr', function () {
        var xtrastations = JSON.parse(localStorage.getItem('xtrastations'));
        if (!(xtrastations)) xtrastations = [];
        console.log(`${$(this).text()}`);
        objIndex = xtrastations.findIndex((obj => obj.tit == $(this).text()));
        if (objIndex > -1) {
            var tit = xtrastations[objIndex].tit;
            $('#editstationslist').hide();
            EditStation(tit);
        }
    });
    //Check to see if the window is top, if not then display button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });
    //Click event to scroll to top
    $('.scrollToTop').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    $("#makenewstation").on('click', function () {
        w3_close();
        $('#editstation').show();
        $("#itit, #icou, #isty, #ilan, #iu1, #hom, #sta, #fav").val('');
        $('#btn-newstation').hide(); //hide button new
        $('#btn-deletestation').hide(); //hide button delete
        $("#titleeditform").text(_lg.Makenewstation);
    });
    $(".infothisstation").on('click', function () {
        w3_close();
        showStation(_stationplaying.stationuuid);
    });
    $(".goabout").on('click', function () {
        w3_close();
        var d = new Date();
        var yyyy = d.getFullYear();
        $("#favicon").removeClass("favicon2");
        var hd = _lg.About2;
        var msg = "<p>" + _lg.msg01 + "</p>";
        msg += "<p><a href='https://radios2s.scriptel.nl' target='_blank'>radios2s.scriptel.nl</a></p>";
        msg += "<p>" + version + "</p><p>Copyright &copy; " + yyyy + ", Scriptel</p><hr/>";
        msg += "<p>" + _lg.msg02 + "<a href='http://www.radio-browser.info/' target='_blank'>Radio Browser</a>";
        msg += _lg.msg03 + "</p><hr/>";
        msg += "<p class='italic'>" + _lg.msg04 + "</p>";
        msg += "<p class='italic'>" + _lg.msg05 + "</p>";
        $("#logo").show();
        showMessage(hd, msg);
    });
    $("#logo").on('click', function () {
        window.location.href = 'https://radios2s.scriptel.nl';
    });
    $("#goeditstations").on('click', function () {
        w3_close();
        $('#editstationslist').show();
        $('#btn-newstation').show();
        $('#btn-deletestation').show();
        $("#titleeditform").text('Edit station');
        var sel = JSON.parse(localStorage.getItem('xtrastations'));
        if (!(sel)) sel = [];
        // var sel = xtrastat().get();
        var list = '';
        if (sel.length === 0) {
            list += "<td>" + _lg.nothingtoedit + "</td>";
        } else {
            for (var n = 0; n < sel.length; n++) {
                // list += "<tr><td>" + sel[n].tit + "</td></tr>";
                list += `<tr><td><span class="label-small"></span><br><span>${sel[n].tit}</span></td></tr>`;
            }
        }
        $('#editlist').html(list);
    });
    $('#btn-sidemenu').on('click', function () {
        w3_open();
    });
    $('#btn-newstation').on('click', function () { //clear edit station form
        $("#itit, #icou, #isty, #ilan, #iu1").val('');
        $("#titleeditform").text('New station');
    });
    $('#btn-deletestation').on('click', function () { //save or update new or edited station
        var itit = $("#itit").val();
        var xtrastations = JSON.parse(localStorage.getItem('xtrastations'));
        objIndex = xtrastations.findIndex((obj => obj.tit == itit));
        if (objIndex > -1) {
            xtrastations = xtrastations.splice(objIndex, 1);
        }
        $('#editstation').hide();
        $('#editstationslist').show();
        // var sel = xtrastat().get();
        var list = '';
        xtrastations.forEach((xtrastation) => {
            // for (var n = 0; n < xtrastations.length; n++) {
            list += `<tr><td><span class="label-small"></span><br><span>${xtrastation.tit}</span></td></tr>`;
        });
        localStorage.setItem('xtrastations', JSON.stringify(xtrastations));
        $('#editlist').html(list);
    });
    $('#cancelstation').on('click', function () { //cancel edit station form
        $("#itit, #icou, #isty, #ilan, #iu1").val('');
        $('#editstation').hide();
    });
    $('#closepopup01').on('click', function () { //close popup
        $("#popup01").hide();
    });
    $('#close-infoplayingstation').on('click', function () {
        $("#infoplayingstation").hide();
    });
    $('#close-editstation').on('click', function () {
        $("#editstation").hide();
    });
    $('#close-editstationslist').on('click', function () {
        $("#editstationslist").hide();
    });
    $('#close-sidebar').on('click', function () {
        w3_close();
    });
    $("#myOverlay").on('click', function () {
        w3_close();
    });
    $('#savestation').on('click', function () { //save or update new or edited station
        var stationrb = { //station in format radiobrowser.info
            name: $("#itit").val(),
            url: $("#iu1").val(),
            homepage: $("#ihom").val(),
            favicon: $("#ifav").val(),
            country: countries[0][$("#icou").val()],
            state: $("#ista").val(),
            language: languages[0][$("#ilan").val()],
            tags: styles[0][$("#isty").val()]
        };
        if (stationrb.name === '') {
            alert("Enter name");
        } else if (!UrlCheck(stationrb.url)) {
            alert("Enter correct url");
        } else {
            var stations = JSON.parse(localStorage.getItem('stations'));
            $.post(_servers[0] + "/json/add", stationrb, function (results) {
                if (results.ok == true) {
                    const date = new Date().toISOString();
                    stationrb.date = date;
                    stationrb.stationuuid = results.uuid;
                    stationrb.rating = 0;
                    stations.push(stationrb);
                    localStorage.setItem('stations', JSON.stringify(stations));
                    alert(results.message);
                    getStation(stationrb.stationuuid);
                } else {
                    alert(results.message);
                }
            });
        }
        $('#editstation').hide();
    });
    $("#test").on('click', function () {
        // migrateTaffy();
    });
});

function detectLanguage() {
    var lang = 'en';
    if (navigator.globalization !== null && navigator.globalization !== undefined) { //Phonegap browser detection
        navigator.globalization.getPreferredLanguage(
            function (language) {
                lang = language.value.slice(0, 2);
                console.log('navigator.globalization language.value' + ': ' + language.value);
            },
            function (error) {
                console.log('error');
            }
        );
    } else { //Normal browser detection
        if (window.navigator.language !== null && window.navigator.language !== undefined) {
            lang = window.navigator.language.slice(0, 2);
        }
    }
    // lang = 'en';
    _settings.language = lang;
    localStorage.setItem('settings', JSON.stringify(_settings));
    switch (lang) {
        case 'nl':
            lgnr = 1; //us:0, nl:1
            _lg = translate.nl;
            break;
        case 'de':
            lgnr = 2; //us:0, nl:1
            _lg = translate.de;
            break;
        default:
            lgnr = 0; //us:0, nl:1
            _lg = translate.us;
            break;
    }
}

function showHtml() {
    $("#play").hide();
    $("#pause").show();
    $("#close-sidebar").html(_lg.Close + "&nbsp;&times;");
    $("#makenewstation").html(_lg.Makenewstation);
    $("#goeditstations").html(_lg.EditStation);
    $("#closeapp").html(_lg.closeapp);
    $("#playingstation").html(_lg.Playingstation);
    $("#initcast").html(_lg.initcast);
    $("#goabout").html(_lg.About1);
    $("#favorites").html(_lg.Favorites);
    // $("#playingstat").html(_lg.Playingstation);
    $("#lb-homeurl").html(_lg.homeurl);
    $("#lb-country").html(_lg.Country);
    $("#lb-state").html(_lg.State);
    $("#lb-tags").html(_lg.Tags);
    $("#lb-language").html(_lg.Language);
    $("#lb-codec").html(_lg.Codec);
    $("#lb-bitrate").html(_lg.Bitrate);
    $("#lb-setrating2").html(_lg.Rating);
    $("#lb-votes").html(_lg.Votes);
    $("#lb-removestation").html(_lg.removestation);
    $("#titleeditform").html(_lg.EditStation);
    $("#namestation").html(_lg.NameStation);
    $("#stream").html(_lg.Stream);
    $("#homepage").html(_lg.Homepage);
    $("#favicon").html(_lg.Favicon);
    $("#state").html(_lg.State);
    $("#btn-newstation").html(_lg.New);
    $("#btn-deletestation").html(_lg.Delete);
    $("#savestation").text(_lg.Save);
    $("#cancelstation").html(_lg.Cancel);
    $("#editstations").html(_lg.EditStations);
    $("#myFilter").attr("placeholder", _lg.Searchfor);
    let star = (_settings.listorder === 'stars-updated') ? 'full' : 'open';
    $("#ratingselectimg").attr('src', `./res/img/star-${star}.png`);
    $("#ratingselect").attr('title', _lg.ratingselect);
}

const fieldSorter = (fields) => (a, b) => fields.map(o => { //sorts array of objects
    // e.g.: const sortedHomes = homes.sort(fieldSorter(['state', '-price'])); see t.ly/JgRb2
    let dir = 1;
    if (o[0] === '-') {
        dir = -1;
        o = o.substring(1);
    }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
}).reduce((p, n) => p ? p : n, 0);

function updateStation(rating, station) { //update (rating of) (playing) station; station in radio-browser format
    const date = new Date().toISOString();
    station.date = date;
    station.rating = rating;
    var stations = JSON.parse(localStorage.getItem('stations'));
    if (stations) {
        objIndex = stations.findIndex((obj => obj.stationuuid == station.stationuuid));
        if (objIndex > -1) {
            stations[objIndex] = station;
            console.log(`updated station: ${station.name}, rating: ${rating}, date: ${date}`);
        } else {
            stations.push(station);
            console.log(`new favorite: ${station.name}, rating: ${rating}, date: ${date}`);
        }
    } else {
        stations = [];
        stations.push(station);
        console.log(`new localstorage, new favorite: ${station.name}, rating: ${rating}, date: ${date}`);
    }
    stations = stations.sort(fieldSorter(['-rating', '-date']));
    if (stations.length > _settings.maxstations) {
        stations.length = _settings.maxstations;
    }
    localStorage.setItem('stations', JSON.stringify(stations));
}

function get_radiobrowser_base_urls() {
    $.post("http://all.api.radio-browser.info/json/servers", //get all servers
        function (results) {
            if (results.length > 0) {
                _servers = results.map(x => "https://" + x.name);
                get_radiobrowser_server_status(_servers);
            }
        });
}

function get_radiobrowser_server_status(servers) {
    let _servers = [];
    Promise.all(servers.map(server => // use map() to perform a fetch and handle the response for each server
            fetch(server + '/json/stats', {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': `RadioS2S/1.1.1/${run_as}`,
                }
            })
            .then(response => response.json())
            .then((results) => {
                if (results.status === 'OK') {
                    _servers.push(server);
                }
            })
            .catch(error => {
                console.error(`Error: ${error} `);
            })
        ))
        .then(data => { //the first server with status OK is stored in _servers
            servers = JSON.parse(localStorage.getItem("servers"));
            if ((jQuery.isEmptyObject(servers))) { //in this case init() hasn't yet started
                localStorage.setItem('servers', JSON.stringify(_servers));
                init();
            } else {
                localStorage.setItem('servers', JSON.stringify(_servers));
            }
            // console.log(`servers: ${_servers}`);
        })
}

function test_makeTaffy() { //run once in init() to make taffy_favorits for testing
    var favorits = TAFFY(testjson);
    favorits.store('favorits');
}

var testjson = [{id: "85745", tit: "NPO Radio 4 - Concerten", rat: 5},
    {id: "66458", tit: "Klara Continuo", rat: 5},
    {id: "64095", tit: "BBC Radio 3", rat: 4},
    {id: "111183", tit: "Radio Swiss Classic", rat: 3},
    {id: "49601", tit: "NPO Radio 4", rat: 2},
    {id: "86716", tit: "24/7 Bach", rat: 1},
    {id: "101487", tit: "Concertzender Geen dag zonder Bach", rat: 2},
    {id: "94556", tit: "Radio Symphony", rat: 2},
    {id: "89644", tit: "BNR Nieuwsradio", rat: 1},
    {id: "85586", tit: "NPO Radio 1", rat: 1},
    {id: "11957", tit: "Venice Classic Radio", rat: 3},
    {id: "126840", tit: "Concertzender Klassiek", rat: 3},
    {id: "101494", tit: "Concertzender Gaudeamus", rat: 2},
    {id: "101488", tit: "Concertzender Klassieke Muziek", rat: 2}];
