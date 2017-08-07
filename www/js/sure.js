var version = "Version 0.1.1";
var stations = TAFFY(); //base database of stations
var xtrastat = TAFFY(); //stations added by user
var favorits = TAFFY(); //stations marked as favorit (with rating)
var lim = 500;
var start = 0; //start record in query
var file = "res/csv/stations.csv";
favorits.store("favorits"); //synchronize database in localstorage with name "favorits"
xtrastat.store("xtrastat"); //synchronize database in localstorage with name "xtrastat"
var player;
var castconnected = "unavailable";
var urlplaying;
var titplaying;

var countries = ["Afghanistan","Albania","Algeria","American Samoa","Andorra","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Bahamas","Bailiwick of Jersey","Barbados","Basque Country","Belarus","Belgium","Belize","Benin","Bermuda","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Bulgaria","Burkina Faso","Cambodia","Canada","Cape Verde","Cayman Islands","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","England","Estonia","Ethiopia","Faroe Islands","Fiji","Finland","France","Galiza","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kosovo","Kuwait","Laos","Latvia","Lebanon","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malaysia","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","Netherlands Sint Maarten","New Zealand","Nicaragua","Nigeria","Norway","Pakistan","Palestine","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Republic of Panama","Republic of San Marino","Romania","Russia","Saint Lucia","Saint Vincent and the Grenadines","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South America","South Korea","Spain","Sri Lanka","St. Helena","Suriname","Sweden","Switzerland","Syria","Taiwan","Thailand","Tibet","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turks & Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United Kingdom & MALAYSIA","United States of America","Uruguay","US Virgin Islands","Uzbekistan","Vatican City State","Venezuela","Yemen","Zambia","Zimbabwe"];

var languages = ["Afrikaans","Albanian","Alsatian","Amharic","Arabic","Armenian","Azerbaijani","Bahasa Indonesia","Basque","Basque, Spanish","Belarusian","Bosnian","Breton","Bulgarian","Cantonese","Catalan","Creole","Croatian","Czech","Danish","Dari","Dutch","English","Espa&#241;ol","Esperanto","Estonian","Faroese","Filipino","Finnish","Fongbe","French","Galician","Georgian","German","Greek","Haitian","Hawaiian","Hebrew","Hindi","Hungarian","Icelandic","Indonesian","Irish","Italian","Jamaican","Japanese","Kalaallusit","Kanuri","Kazakh","Khmer","Korean","Kreyol","Kurdish","Kyrgyz","Ladin","Laotian","Latvian","Lithuanian","Luganda","Luxembourgish","Macedonian","Malagasy","Malay","Malayalam","Maltese","Mandarin","Min Nan","Moldov","Montenegrin","Multilingual","Nepali","Norwegian","Occitan","Papiamento","Pashto","Persian","Plautdietsch","Polish","Portuguese","Punjabi","Romanian","Romansh","Russian","Sami","Scottish Gaelic","Serbian","Sinhalese","Slovak","Slovakian","Slovenian","Somali","Spanish","Swedish","Tagalog","Tajik","Tamil","Tatar","Thai","Tongan","Turkish","Turkmen","Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Yiddish","Zazaca"];

var styles = ["00s","50s","60s","70s","80s","90s","abc","aboriginal","active rock","adult album alternative","adult contemporary","adult hits","alternative","alternative rock","ambient","apm","bbc","beat","bible","blues","bollywood","boston","caribbean music","catholic","cbc","celtic","charts","chicago","children","chill","chillout","christian","christmas","christmas music","classic","classic hits","classic rock","classical","club","college","college radio","comedy","commercial","community","community radio","contemporary","contemporary hits","country","cultural","culture","dance","dancehall","deep house","denver","disco","dubstep","easy listening","eclectic","edm","electro","electronic","electronica","entertainment","ethnic programming","experimental","features","folk","folk music","freeform","funk","gospel","gothic","greek","hard rock","heavy metal","hiphop","hits","hot adult contemporary","house","humor","ici premiere","india","indie","indie rock","information","instrumental","italian pop","jazz","kids","latin","latin music","latin pop","latino","live","local","local music","local news","local programming","london","los angeles","lounge","m3u8","mediaset","merengue","metal","misc","modern rock","montreal","multicultural","multilingual","music","new age","new york city","news","news talk","non-commercial","noticias","npr","oldies","ottawa","outre-mer","pacifica","politics","pop","pop rock","prague","pri","progressive","psychedelic","public","public radio","punk","r&b","radio canada","rap","reggae","reggaeton","regional","regional radio","relax","religion","rfe-rl","rnb","rock","rogers","roma","rtbf","salsa","schlager","smooth jazz","soul","soundtrack","sport","sports news","sr","student radio","sveriges radio","talk","techno","top 40","toronto","trance","tropical","university","university radio","urban","vallenato","vancouver","variety","video game","waynesboro","winnipeg","world music"];

var app = {
    testing_on_desktop: true,
    // Application Constructor
    initialize: function() {
        if (document.URL.indexOf("http://" || "file://") === -1) {
            this.testing_on_desktop = false;
        }
        this.bindEvents();
    },
    // Bind Event Listeners Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        if (this.testing_on_desktop) {
            this.loadScript("https://www.gstatic.com/cv/js/sender/v1/cast_sender.js", function(){
                console.log('Desktop: Loaded cast_sender.js');
            });
            this.loadScript("js/CastVideos.js", function(){
                // console.log('Desktop: Loaded CastVideos.js');
                var castPlayer = new CastPlayer();
            });
        }else{
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
    },
    // deviceready Event Handler The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        this.loadScript("js/CastVideos.js", function(){
            console.log('Device: Loaded CastVideos.js');
            var castPlayer = new CastPlayer();
        });
    },
    loadScript: function (url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
};

Papa.parse(file, {
    download: true,
    header: true,
    complete: function (results) {
        stations = TAFFY(results.data);
        if (xtrastat().count() > 0) {
            var id, tit, cou, sty, lan, u1, btr;
            var xtr = xtrastat().get();
            for (var n = 0; n < xtr.length; n++) {
                id = xtr[n].id;
                tit = xtr[n].tit;
                cou = xtr[n].cou;
                sty = xtr[n].sty;
                lan = xtr[n].lan;
                u1 = xtr[n].u1;
                btr = xtr[n].btr;
                stations.insert({id:id, tit: tit, cou:cou, sty:sty, lan:lan, u1:u1, btr:btr});
            }
        }
        console.log("Finished reading csv");
        player = document.getElementById('player');
        FillSelectOptions();
        ShowFavorits();
        var last = localStorage.getItem("laststation");
        if (last) {
            SetStation(last);
        }
        var vol = localStorage.getItem("lastvolume");
        if (vol) {
            setVolume(vol);
            var rngvolume = document.getElementById('rngVolume');
            rngvolume.value=vol;
        }
        //uncomment to see all stations at start
        // Select('','',''); 
    }
});

function w3_open() { //sidebar open, overlay for dark background
    $("#mySidebar").show();
    $("#myOverlay").show();
}
function w3_close() {
    $("#mySidebar").hide();
    $("#myOverlay").hide();
}

function FillSelectOptions() {
    var list, sel, n;
    list = '<option value="">Country</option>';
    for (n = 0; n < countries.length; n++) {
        list += "<option value=" + countries[n] + ">" + countries[n] + "</option>";
    }
    $('.country').html(list);
    list = '<option value="">Style</option>';
    for (n = 0; n < styles.length; n++) {
        list += "<option value=" + styles[n] + ">" + styles[n] + "</option>";
    }
    $('.style').html(list);
    list = '<option value="">Language</option>';
    for (n = 0; n < languages.length; n++) {
        list += "<option value=" + languages[n] + ">" + languages[n] + "</option>";
    }
    $('.language').html(list);
}

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
$(window).scroll(function(event){
    didScroll = true;
});
setInterval(function() { //check scroll every 250ms
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);
function hasScrolled() {
    var navbarHeight = $('header').outerHeight();
    var st = $(this).scrollTop();
    start = (st === 0) ? 0 : start; //reset start if on top
    var sh = $('body').outerHeight(); //scroll height
    var p = st / sh;
    if (p > 0.8) { // almost at bottum: get new records
        start += 1;
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

function setVolume(volume) {
    console.log('volume' + ': '+ volume);
    player.volume = volume;
    localStorage.setItem("lastvolume", volume);
}

function SetStation(tit){
    titplaying = tit;
    urlplaying = stations({tit: tit}).get()[0].u1;
    // if(urlplaying.endsWith("m3u")){
    //     urlplaying = urlplaying.substr(0,urlplaying.length-4);
    // }
    localStorage.setItem("laststation", tit);
    var btr = stations({tit: tit}).get()[0].btr; //bitrate
    $("#selectedstation").html(tit + " - " + btr + " kbps");
    if(favorits({tit:tit}).count()>0){ //selected station is favorit
        var r = favorits({tit:tit}).get()[0].rat;
        $('.setrating').starRating('setRating', r, true)
    }else{ //no favorit
        $('.setrating').starRating('setRating', 0, true)
    }
    var id = stations({tit: tit}).get()[0].id;
    $.post("http://www.radio-browser.info/webservice/v2/json/url/" + id, //get playable station url
    function(results) {
        console.log('urlplaying id' + ': ' + urlplaying+' '+id);
        urlplaying = results.url;
        $("#player").attr("src", urlplaying);
        var x1 = jQuery.trim(urlplaying).substring(0, 42).trim(this);
        x1 = (urlplaying.length > x1.length) ? x1 + "..." : x1;
        $(".url").html(x1);
        var pl = document.getElementById('play');
        pl.click(); //activate CastVideo.js
        console.log('urlplaying' + ': '+ urlplaying);
    });
    $.post("http://www.radio-browser.info/webservice/json/stations/byid/" + id, 
    function(results){
        var urlfavicon = results[0].favicon;
        if(results[0].favicon){
            $('.favicon').css({"background-image":"url(" + urlfavicon + ")", "display":"block"})
        }else{
            $('.favicon').css("display","none")
            
        }
    });
}

function EditStation(tit){
    var rs = xtrastat({tit: tit}).get()[0];
    // var u1 = xtrastat({tit: tit}).get()[0].u1;
    // var cou = xtrastat({tit: tit}).get()[0].cou;
    // var sty = xtrastat({tit: tit}).get()[0].sty;
    // var lan = xtrastat({tit: tit}).get()[0].lan;
    // var hom = xtrastat({tit: tit}).get()[0].hom;
    // var sta = xtrastat({tit: tit}).get()[0].sta;
    // var fav = xtrastat({tit: tit}).get()[0].fav;
    document.getElementById('editstation').style.display='block';
    $("#itit").val(tit);
    $("#icou").val(rs.cou);
    $("#isty").val(rs.sty);
    $("#ilan").val(rs.lan);
    $("#iu1").val(rs.u1);
    $("#ihom").val(rs.hom);
    $("#ista").val(rs.sta);
    $("#ifav").val(rs.fav);
}

function Select() {
    var sel;
    var st = start * lim;
    cou = $("#cou").val();
    sty = $("#sty").val();
    lan = $("#lan").val();
    filter = $("#myFilter").val();
    $('#cont-cou, #cou, #cont-sty, #sty, #cont-lan, #lan').removeClass('fs-dark-gray').addClass('fs-black');        
    if (cou === '' && sty === '' && lan === '') {
        sel = stations({tit:{likenocase:filter}}).start(st).limit(lim).get();
    } else if (cou !== '' && sty === '' && lan === '') {
        $('#cont-cou, #cou').removeClass('fs-black').addClass('fs-dark-gray');        
        sel = stations({
            cou: {likenocase:cou},
            tit:{likenocase:filter}
        }).order('tit').start(st).limit(lim).get();
    } else if (cou === '' && sty !== '' && lan === '') {
        $('#cont-sty, #sty').removeClass('fs-black').addClass('fs-dark-gray');        
        sel = stations({
            sty: {likenocase:sty},
            tit: {likenocase:filter}
        }).order('tit').start(st).limit(lim).get();
    } else if (cou === '' && sty === '' && lan !== '') {
        $('#cont-lan, #lan').removeClass('fs-black').addClass('fs-dark-gray');        
        sel = stations({
            lan: {likenocase:lan},
            tit: {likenocase:filter}
        }).order('tit').start(st).limit(lim).get();
    } else if (cou !== '' && sty !== '' && lan === '') {
        $('#cont-cou, #cou, #cont-sty, #sty').removeClass('fs-black').addClass('fs-dark-gray');        
        sel = stations({
            cou: {likenocase:cou},
            sty: {likenocase:sty},
            tit: {likenocase:filter}
        }).order('tit').start(st).limit(lim).get();
    } else if (cou !== '' && sty === '' && lan !== '') {
        $('#cont-cou, #cou, #cont-lan, #lan').removeClass('fs-black').addClass('fs-dark-gray');
        sel = stations({
            cou: {likenocase:cou},
            lan: {likenocase:lan},
            tit:{likenocase:filter}
        }).order('tit').start(st).limit(lim).get();
    } else if (cou === '' && sty !== '' && lan !== '') {
        $('#cont-sty, #sty, #cont-lan, #lan').removeClass('fs-black').addClass('fs-dark-gray');
        sel = stations({
            sty: {likenocase:sty},
            lan: {likenocase:lan},
            tit: {likenocase:filter}
        }).order('tit').start(st).limit(lim).get();
    } else if (cou !== '' && sty !== '' && lan !== '') {
        $('#cont-cou, #cou, #cont-sty, #sty, #cont-lan, #lan').removeClass('fs-black').addClass('fs-dark-gray');        
        sel = stations({
            cou: {likenocase:cou},
            sty: {likenocase:sty},
            lan: {likenocase:lan},
            tit: {likenocase:filter}
        }).order('tit').start(st).limit(lim).get();
    }
    var list = '';
    for (var n = 0; n < sel.length; n++) {
        list += "<tr><td>" + sel[n].tit + "</td></tr>";
    }
    if (start === 0) {
        $('#activelist').html(list);
    } else {
        $('#activelist').append(list);
    }
}

function ShowFavorits(){
    var x;
    var list = '';
    // clear option boxes and search field
    $("#cou, #sty, #lan").val('').prop('selected', true);
    $("#myFilter").val('');
    $('#cont-cou, #cou, #cont-sty, #sty, #cont-lan, #lan').removeClass('fs-dark-gray').addClass('fs-black');        
    if (favorits().count() > 0){
        for (var i = 5; i > 0; i--) {
            x = favorits({rat:i}).order('tit').limit(lim).get();
            if(x.length>0){
                if(i===1){
                    list += '<tr><th>'+i+' star</th></tr>';
                }else{
                    list += '<tr><th>'+i+' stars</th></tr>';
                }
            }
            for (var n = 0; n < x.length; n++) {
                list += "<tr><td>" + x[n].tit + "</td></tr>";
            }
        }
        $('#activelist').html(list);
    } else { //no favorits yet
        var msg = "<h4>You have no favorits yet</h4><p>Show radio stations by selecting country, style and/or language, ";
        msg += "or use the search bar. ";
        msg += "Make a station favorit by giving it one or more stars. </p>";
        var hd = "Hi there!";
        $("#favicon").removeClass("favicon2");
        showMessage(hd,msg);
        Select();
    }
}

function UrlCheck(url){
    var exp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
    var regex = new RegExp(exp);
    if (url.match(regex)) {
        return true;
    } else {
        return false;
    }
}

function onLoad() {
    // console.log('eventlistener deviceready');
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    var loadCastInterval = setInterval(function () {
        if (chrome.cast.isAvailable) {
            clearInterval(loadCastInterval);
            initializeCastApi();
        } else {
        }
    }, 1000);
}

function showMessage(hd,msg) {
    $("#popupheader").html(hd);
    $("#popupmessage").html(msg);
    $("#popup01").show();
}

function swipe() { //activates swiperight and swipeleft
    var maxTime = 1000, // allow movement if < 1000 ms (1 sec)
        maxDistance = 10, // swipe movement of 50 pixels triggers the swipe
        target = $('#verticalbar'),
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

$(document).ready(function () {
    document.getElementById("play").style.display = 'none';
    document.getElementById("pause").style.display = 'block';
    swipe();
    $('#myFilter').on("focus", function(){
        $('#footer').removeClass('footerup').addClass('footerdown');
    });
    $('#myFilter').on("focusout", function(){
        $('#footer').removeClass('footerdown').addClass('footerup');
    });
    $("#cou, #sty, #lan").change(function () {
        start = 0;
        Select();
    });
    $("#favorits").on('click', function () {
        ShowFavorits();
    });
    $(".setrating").starRating({
        initialRating: 0,
        disableAfterRate: false,
        useFullStars: true,
        starSize: 20,
        callback: function (rating) {
            var ftit = stations({tit: titplaying}).get()[0].tit;
            if(rating>0){ 
                if(favorits({tit:ftit}).count()>0){ //update of rating
                    favorits({tit:ftit}).update({rat:rating});
                    ShowFavorits();
                    console.log("updated",ftit, rating);
                }else{ //new rating
                    favorits.insert({tit: ftit, rat:rating});
                }
            }else{ //no longer favorit
                favorits({tit:ftit}).remove();
                ShowFavorits(); //#TODO: only show favorits if favorits are selected
            }
        }
    });
    $("#activelist").on('click', 'td', function() {
        var tit = stations({tit: $(this).text()}).get()[0].tit;
        SetStation(tit);
    });
    $("#editlist").on('click', 'tr', function() {
        var tit = xtrastat({tit: $(this).text()}).get()[0].tit;
        $('#editstationslist').hide();
        EditStation(tit);
    });
    //Check to see if the window is top, if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	//Click event to scroll to top
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
    $("#makenewstation").on('click', function () {
        w3_close();
        $('#editstation').show();
        $("#itit, #icou, #isty, #ilan, #iu1, #hom, #sta, #fav").val('');
        $('#btn-newstation').hide(); //hide button new
        $('#btn-deletestation').hide(); //hide button delete
        $("#titleeditform").text('New station');
    });
    $("#infothisstation").on('click', function(){
        w3_close();
        $.post("http://www.radio-browser.info/webservice/json/stations/bynameexact/" + titplaying,  //get playing station
        function(results) {
            var rs = results[0];
            if(rs.favicon){
                $("#favicon").addClass("favicon2");
                $('.favicon2').css({"background-image":"url(" + rs.favicon + ")", "display":"block"})
            }
            var hd = "Playing station";
            var msg = "<h2>"+ titplaying +"</h2>";
            msg += "<p>" + urlplaying + "</p>";
            msg += "<table class='w3-table-all w3-margin-top'>";
            // msg += "<tr><td>Stream:&nbsp;</td><td>" + urlplaying + "</td></tr>";
            msg += "<tr><td>Home:&nbsp;</td><td><a href='" + rs.homepage +"' target='_blank'>" + rs.homepage + "</a></td></tr>";
            msg += "<tr><td>Country:&nbsp;</td><td>" + rs.country + "</td></tr>";
            msg += "<tr><td>State:&nbsp;</td><td>" + rs.state + "</td></tr>";
            msg += "<tr><td>Style:&nbsp;</td><td>" + rs.tags + "</td></tr>";
            msg += "<tr><td>Language:&nbsp;</td><td>" + rs.language + "</td></tr>";
            msg += "<tr><td>Codex:&nbsp;</td><td>" + rs.codec + "</td></tr>";
            msg += "<tr><td>Bitrate:&nbsp;</td><td>" + rs.bitrate + "&nbsp;kb/s</td></tr>";
            msg += "</table>";
            msg += "<hr/><p style='font-size:0.8em;'>Copyright &copy; 2017, Frans Schrijver</p>";
            showMessage(hd,msg);
        });
    });
    $("#goabout").on('click', function () {
        w3_close();
        $("#favicon").removeClass("favicon2");
        var hd = "About";
        var msg = "<p>Simply Radio is a simple and free internet radio player by Frans Schrijver</p>";
        msg += "<p><a href='https://simplyradio.scriptel.nl' target='_blank'>simplyradio.scriptel.nl</a></p>";
        msg += "<p>" + version + "</p><p>Copyright &copy; 2017, Frans Schrijver</p><hr/>";
        msg += "<p>Many thanks to <a href='http://www.radio-browser.info/' target='_blank'>Radio Browser</a>";
        msg += ", a community approach to collect as many internet radio stations as possible.</p><hr/>";
        msg += "<p class='italic'>This program is free software: you can redistribute it and/or modify ";
        msg +="it under the terms of the GNU General Public License as published by";
        msg +="the Free Software Foundation, either version 3 of the License, or";
        msg +="(at your option) any later version.</p>";
        msg +="<p class='italic'>This program is distributed in the hope that it will be useful, ";
        msg += "but WITHOUT ANY WARRANTY; without even the implied warranty of";
        msg += "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the";
        msg += "GNU General Public License for more details.</p>";
        showMessage(hd,msg);
    });
    $("#goeditstations").on('click', function () {
        w3_close();
        $('#editstationslist').show();
        $('#btn-newstation').show();
        $('#btn-deletestation').show();
        $("#titleeditform").text('Edit station');
        var sel = xtrastat().get();
        var list = '';
        if (sel.length === 0) {
            list += "<td>No stations to edit yet</td>";
        } else {
            for (var n = 0; n < sel.length; n++) {
                list += "<tr><td>" + sel[n].tit + "</td></tr>";
            }
        }
        $('#editlist').html(list);
    });
    $('#btn-newstation').on('click', function () { //clear edit station form
        $("#itit, #icou, #isty, #ilan, #iu1").val('');
        $("#titleeditform").text('New station');
    });
    $('#btn-deletestation').on('click', function () { //save or update new or edited station
        var itit = $("#itit").val();
        if (xtrastat({tit:itit}).count() > 0) {
            xtrastat({tit:itit}).remove();
            stations({tit:itit}).remove();
        }
        $('#editstation').hide();
        $('#editstationslist').show();
        var sel = xtrastat().get();
        var list = '';
        for (var n = 0; n < sel.length; n++) {
            list += "<tr><td>" + sel[n].tit + "</td></tr>";
        }
        $('#editlist').html(list);
    });
    $('#cancelstation').on('click', function () { //cancel edit station form
        $("#itit, #icou, #isty, #ilan, #iu1").val('');
        $('#editstation').hide();
    });
    $('#savestation').on('click', function () { //save or update new or edited station
        var stationrb = {
            name: $("#itit").val(),
            url: $("#iu1").val(),
            homepage: $("#ihom").val(),
            favicon: $("#ifav").val(),
            country: $("#icou").val(),
            state: $("#ista").val(),
            language: $("#ilan").val(),
            tags: $("#isty").val()
        };
        if (stationrb.name === '') {
            alert("Enter name");
        } else if (!UrlCheck(stationrb.url)) {
            alert("Enter correct url");
        } else {
            if (xtrastat({tit:stationrb.name}).count() > 0){ //station exists in xtrastat
                var id = xtrastat({tit: stationrb.name}).get()[0].id;
                $.post("http://www.radio-browser.info/webservice/json/edit/" + id, stationrb,
                function(results){
                    if(results.ok == 'true'){
                        alert(results.message);
                        stationrb.id = results.id;
                        updateLocal(stationrb);
                    } else {
                        alert(results.message);
                    }
                });
            } else { //new station
                $.post("http://www.radio-browser.info/webservice/json/add", stationrb, 
                function(results) {
                    if(results.ok == 'true'){
                        alert(results.message);
                        stationrb.id = results.id;
                        stationrb.stream_check_bitrate = results.stream_check_bitrate;
                        updateLocal(stationrb);
                    } else {
                        alert(results.message);
                    }
                });
            }
        }
        $('#editstation').hide();
    });
});
// }

function updateLocal(strb) {
    if (xtrastat({tit:strb.name}).count() > 0){ //station exists in xtrastat
        xtrastat({tit:strb.name}).update({cou:strb.country, sty:strb.tags, lan:strb.language, u1:strb.url, id:strb.id, btr:strb.stream_check_bitrate, hom:strb.homepage, sta:strb.state, fav:strb.favicon});
    }else{ //new station
        xtrastat.insert({tit:strb.name, cou:strb.country, sty:strb.tags, lan:strb.language, u1:strb.url, id:strb.id, btr:strb.stream_check_bitrate, hom:strb.homepage, sta:strb.state, fav:strb.favicon});
    }
    if (stations({id:strb.id}).count() > 0){ //station exists stations
        stations({id:strb.id}).update({tit:strb.name, cou:strb.country, sty:strb.tags, lan:strb.language, u1:strb.url, btr:strb.stream_check_bitrate});
    }else{ //new station
        stations.insert({tit:strb.name, cou:strb.country, sty:strb.tags, lan:strb.language, u1:strb.url, id:strb.id, btr:strb.stream_check_bitrate});
    }
}
