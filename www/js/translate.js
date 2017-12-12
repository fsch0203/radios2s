﻿var countries = [
    //us
    ["Afghanistan","Albania","Algeria","American Samoa","Andorra","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Bahamas","Bailiwick of Jersey","Barbados","Basque Country","Belarus","Belgium","Belize","Benin","Bermuda","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Bulgaria","Burkina Faso","Cambodia","Canada","Cape Verde","Cayman Islands","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","England","Estonia","Ethiopia","Faroe Islands","Fiji","Finland","France","Galiza","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kosovo","Kuwait","Laos","Latvia","Lebanon","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malaysia","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","Netherlands Sint Maarten","New Zealand","Nicaragua","Nigeria","Norway","Pakistan","Palestine","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Republic of Panama","Republic of San Marino","Romania","Russia","Saint Lucia","Saint Vincent and the Grenadines","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South America","South Korea","Spain","Sri Lanka","St. Helena","Suriname","Sweden","Switzerland","Syria","Taiwan","Thailand","Tibet","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turks & Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","US Virgin Islands","Uzbekistan","Vatican City State","Venezuela","Yemen","Zambia","Zimbabwe"],
    //nl
    ["Afghanistan","Albanië","Algerije","Amerikaans Samoa","Andorra","Anguilla","Antigua en Barbuda","Argentinië","Armenië","Aruba","Australië","Oostenrijk","Bahamas","Bailiwick van Jersey","Barbados","Baskenland","Wit-Rusland","België","Belize","Benin","Bermuda","Bolivia","Bosnië-Herzegovina","Botswana","Brazilië","Britse Maagdeneilanden","Bulgarije","Burkina Faso","Cambodja","Canada","Kaapverdië","Kaaiman Eilanden","Chili","China","Colombia","Congo","Cook Islands","Costa Rica","Kroatië","Cuba","Cyprus","Tsjechische Republiek","Denemarken","Dominica","Dominicaanse Republiek","Ecuador","Egypte","El Salvador","Engeland","Estland","Ethiopië","Faeröer","Fiji","Finland","Frankrijk","Galiza","Gambia","Georgië","Duitsland","Ghana","Gibraltar","Griekenland","Groenland","Grenada","Guatemala","Guinea","Guyana","Haïti","Honduras","Hong Kong","Hongarije","IJsland","Indië","Indonesië","Iran","Irak","Ierland","Isle of Man","Israël","Italië","Ivoorkust","Jamaica","Japan","Jordanië","Kazachstan","Kenia","Kosovo","Koeweit","Laos","Letland","Libanon","Liechtenstein","Litouwen","Luxemburg","Macedonië","Madagascar","Maleisië","Mali","Malta","Mauritanië","Mauritius","Mexico","Moldavië","Monaco","Montenegro","Montserrat","Marokko","Mozambique","Namibië","Nepal","Nederland","Nederlandse Antillen","Nederland Sint Maarten","Nieuw Zeeland","Nicaragua","Nigeria","Noorwegen","Pakistan","Palestina","Paraguay","Peru","Filippijnen","Polen","Portugal","Puerto Rico","Katar","Republiek Panama","Republiek San Marino","Roemenië","Rusland","Saint Lucia","Saint Vincent en de Grenadines","Saoedi-Arabië","Senegal","Servië","Seychellen","Sierra Leone","Singapore","Slowakije","Slovenië","Zuid-Afrika","Zuid-Amerika","Zuid-Korea","Spanje","Sri Lanka","St-Helena","Suriname","Zweden","Zwitserland","Syrië","Taiwan","Thailand","Tibet","Gaan","Tonga","Trinidad en Tobago","Tunesië","Turkije","Turks en Caicoseilanden","Oeganda","Oekraïne","Verenigde Arabische Emiraten","Verenigd Koningkrijk","de Verenigde Staten van Amerika","Uruguay","Amerikaanse Maagdeneilanden","Oezbekistan","Vaticaanstad","Venezuela","Jemen","Zambia","Zimbabwe"],
    //de
    ["Afghanistan","Albanien","Algerien","Amerikanischen Samoa-Inseln","Andorra","Anguilla","Antigua und Barbuda","Argentinien","Armenien","Aruba","Australien","Österreich","Bahamas","Bailiwick von Jersey","Barbados","Baskenland","Weißrussland","Belgien","Belize","Benin","Bermuda","Bolivien","Bosnien und Herzegowina","Botswana","Brasilien","Britische Jungferninseln","Bulgarien","Burkina Faso","Kambodscha","Kanada","Kap Verde","Cayman Inseln","Chile","China","Kolumbien","Kongo","Cookinseln","Costa Rica","Kroatien","Kuba","Zypern","Tschechien","Dänemark","Dominica","Dominikanische Republik","Ecuador","Ägypten","El Salvador","England","Estland","Äthiopien","Färöer Inseln","Fidschi","Finnland","Frankreich","Galiza","Gambia","Georgia","Deutschland","Ghana","Gibraltar","Griechenland","Grönland","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hongkong","Ungarn","Island","Indien","Indonesien","Iran","Irak","Irland","Isle of Man","Israel","Italien","Elfenbeinküste","Jamaika","Japan","Jordanien","Kasachstan","Kenia","Kosovo","Kuwait","Laos","Lettland","Libanon","Liechtenstein","Litauen","Luxemburg","Mazedonien","Madagaskar","Malaysia","Mali","Malta","Mauretanien","Mauritius","Mexiko","Moldawien","Monaco","Montenegro","Montserrat","Marokko","Mosambik","Namibia","Nepal","Niederlande","Niederländische Antillen","Niederlande Sint Maarten","Neuseeland","Nicaragua","Nigeria","Norwegen","Pakistan","Palästina","Paraguay","Peru","Philippinen","Polen","Portugal","Puerto Rico","Katar","Republik Panama","Republik San Marino","Rumänien","Russland","St. Lucia","St. Vincent und die Grenadinen","Saudi Arabien","Senegal","Serbien","Seychellen","Sierra Leone","Singapur","Slowakei","Slowenien","Südafrika","Südamerika","Südkorea","Spanien","Sri Lanka","St. Helena","Suriname","Schweden","Schweiz","Syrien","Taiwan","Thailand","Tibet","Gehen","Tonga","Trinidad und Tobago","Tunesien","Truthahn","Turks- und Caicosinseln","Uganda","Ukraine","Vereinigte Arabische Emirate","Großbritannien","vereinigte Staaten von Amerika","Uruguay","US Jungferninseln","Usbekistan","Vatikanstadt","Venezuela","Jemen","Sambia","Simbabwe"]
];
var languages = [
	//us
	["Afrikaans","Albanian","Alsatian","Amharic","Arabic","Armenian","Azerbaijani","Bahasa Indonesia","Basque","Basque, Spanish","Belarusian","Bosnian","Breton","Bulgarian","Cantonese","Catalan","Creole","Croatian","Czech","Danish","Dari","Dutch","English","Español","Esperanto","Estonian","Faroese","Filipino","Finnish","Fongbe","French","Galician","Georgian","German","Greek","Haitian","Hawaiian","Hebrew","Hindi","Hungarian","Icelandic","Indonesian","Irish","Italian","Jamaican","Japanese","Kalaallusit","Kanuri","Kazakh","Khmer","Korean","Kreyol","Kurdish","Kyrgyz","Ladin","Laotian","Latvian","Lithuanian","Luganda","Luxembourgish","Macedonian","Malagasy","Malay","Malayalam","Maltese","Mandarin","Min Nan","Moldov","Montenegrin","Multilingual","Nepali","Norwegian","Occitan","Papiamento","Pashto","Persian","Plautdietsch","Polish","Portuguese","Punjabi","Romanian","Romansh","Russian","Sami","Scottish Gaelic","Serbian","Sinhalese","Slovak","Slovakian","Slovenian","Somali","Spanish","Swedish","Tagalog","Tajik","Tamil","Tatar","Thai","Tongan","Turkish","Turkmen","Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Yiddish","Zazaca"],
	//nl
    ["Afrikaans","Albanees","Elzasser","Amhaars","Arabisch","Armeens","Azerbeidzjaans","Bahasa Indonesia","Baskisch","Baskisch, Spaans","Belarusian","Bosnisch","Bretons","Bulgaars","Cantonees","Catalaans","Creols","Kroatisch","Tsjechisch","Deens","Dari","Nederlands","Engels","Español","Esperanto","Estlands","Faeröer","Filippijns","Fins","Fongbe","Frans","Galicisch","Georgisch","Duits","Grieks","Haïtiaans","Hawaiiaans","Hebreeuws","Hindi","Hongaars","IJslands","Indonesisch","Iers","Italiaans","Jamaican","Japans","Kalaallusit","Kanuri","Kazachse","Khmer","Koreaans","kreyol","Koerdisch","Kirgizische","Ladin","Laotiaans","Lets","Litouws","Luganda","Luxemburgs","Macedonisch","Madagaskars","Maleis","Malayalam","Maltees","Mandarijn","Min Nan","Moldov","Montenegrijns","Meertalig","Nepali","Noors","Occitaans","Papiamento","Pashto","Perzisch","Plautdietsch","Pools","Portugees","Punjabi","Roemeense","Reto-Romaans","Russisch","Sami","Schots Gaelic","Servisch","Sinhalees","Slowaaks","Slowaakse","Sloveens","Somalisch","Spaans","Zweeds","Tagalog","Tadzjiekse","Tamil","Tartaar","Thais","Tongaans","Turks","Turkmeens","Oekraïens","Urdu","Oezbeeks","Vietnamees","Wels","Jiddisch","Zazaca"],
    //de
    ["Afrikaans","Albanisch","Elsässisch","Amharic","Arabisch","Armenisch","Aserbaidschanischen","Bahasa Indonesien","Baskisch","Baskisch, Spanisch","Belarussisch","Bosnisch","Bretonisch","Bulgarisch","Kantonesisch","Katalanisch","Kreolisch","Kroatisch","Tschechisch","Dänisch","Dari","Niederländisch","Englisch","Español","Esperanto","Estnisch","Färöisch","Philippinischen","Finnisch","Fongbe","Französisch","Galizisch","Georgisch","Deutsche","Griechisch","Haitianisch","Hawaiisch","Hebräisch","Hindi","Ungarisch","Isländisch","Indonesisch","Irisch","Italienisch","Jamaikanisch","Japanisch","Kalaallusit","Kanuri","Kasachischen","Khmer","Koreanisch","Kreyol","Kurdisch","Kirgisischen","Ladin","Laotisch","Lettisch","Litauisch","Luganda","Luxemburgisch","Mazedonisch","Madagasisch","Malaiisch","Malayalam","Maltesisch","Mandarin","Min Nan","Moldaw","Montenegrinisch","Mehrsprachig","Nepalesisch","Norwegisch","Okzitanisch","Papiamento","Pashto","Persisch","Plautdietsch","Polieren","Portugiesisch","Punjabi","Rumänisch","Rätoromanisch","Russisch","Sami","Schottisch Gälisch","Serbisch","Singhalesisch","Slowakisch","Slowakisch","Slowenisch","Somali","Spanisch","Schwedisch","Tagalog","Tadschikisch","Tamilisch","Tatarisch","Siamesisch","Tongan","Türkisch","Turkmenen","Ukrainisch","Urdu","Usbekisch","Vietnamesisch","Walisisch","Jiddisch","Zazaca"]
];
var styles = [
	//us
	["00s","50s","60s","70s","80s","90s","abc","aboriginal","active rock","adult album alternative","adult contemporary","adult hits","alternative","ambient","apm","bbc","beat","bible","blues","bollywood","boston","caribbean","catholic","cbc","celtic","charts","chicago","children","chill","chillout","christian","christmas","classic","classic hits","classic rock","classical","club","college","comedy","commercial","community","contemporary","country","cultural","culture","dance","dancehall","deep house","denver","disco","dubstep","easy listening","eclectic","edm","electro","electronic","electronica","entertainment","ethnic programming","experimental","features","folk","folk music","freeform","funk","gospel","gothic","greek","hard rock","heavy metal","hiphop","hits","hot adult contemporary","house","humor","ici premiere","india","indie","information","instrumental","italian pop","jazz","kids","latin","live","local","local news","london","los angeles","lounge","mediaset","merengue","metal","misc","modern rock","montreal","multicultural","multilingual","music","new age","new york city","news","news talk","non-commercial","noticias","npr","oldies","ottawa","outre-mer","pacifica","politics","pop","prague","pri","progressive","psychedelic","public","punk","r&b","rap","reggae","reggaeton","regional","relax","religion","rfe-rl","rnb","rock","rogers","roma","salsa","schlager","smooth jazz","soul","soundtrack","sport","sr","student radio","sveriges radio","talk","techno","top 40","toronto","trance","tropical","university","urban","vallenato","vancouver","variety","video game","waynesboro","winnipeg","world music"],
	//nl
    ["00s","50s","60s","70s","80s","90s","abc","aboriginal","actieve rock","adult album alternatief","adult contemporary","adult hits","alternatief","ambient","apm","bbc","beat","bijbel","blues","bollywood","boston","caraïbisch","katholiek","cbc","keltisch","charts","chicago","kinderen","chill","chillout","christelijk","kerstmis","classic","klassieke hits","klassieke rock","klassieke muziek","club","college","komedie","commercieel","gemeenschap","contemporary","country","cultureel","cultuur","dance","dancehall","deep house","denver","disco","dubstep","easy listening","eclectic","edm","electro","electronic","electronica","entertainment","ethnic programming","experimenteel","features","folk","folk music","freeform","funk","gospel","gothic","greek","hard rock","heavy metal","hiphop","hits","hot adult contemporary","house","humor","ici premiere","india","indie","informatie","instrumentaal","Italiaanse pop","jazz","kids","latin","live","lokaal","lokaal nieuws","Londen","Los Angeles","lounge","mediaset","merengue","metal","misc","modern rock","Montreal","multicultureel","meertalig","muziek","new age","New York City","nieuws","nieuwsberichten","niet-commercieel","noticias","npr","oldies","Ottawa","outre-mer","pacifica","politiek","pop","Praag","pri","progressief","psychedelisch","public","punk","r&b","rap","reggae","reggaeton","regionaal","relax","godsdienst","rfe-rl","rnb","rock","rogers","roma","salsa","schlager","smooth jazz","soul","soundtrack","sport","sr","studentenradio","Zweedse radio","praten","techno","top 40","Toronto","trance","tropisch","universiteit","urban","vallenato","Vancouver","variety","video game","waynesboro","winnipeg","wereldmuziek"],
    //de
    ["00s","50s","60s","70s","80s","90s","abc","Aboriginal","Aktiver Rock","adult album alternatief","adult contemporary","adult hits","Alternative","ambient","apm","bbc","beat","Bibel","Blues","Bollywood","Boston","Karibik","katholisch","Cbc","keltisch","charts","Chicago","Kinder","chill","chillout","Christian","Weihnachten","classic","Klassische Hits","Klassischer Rock","klassische Musik","club","college","Komödie","kommerziell","Gemeinschaft","Zeitgenössisch","country","Kulturelle","Kultur","dance","Tanzsaal","Tiefes Haus","Denver","Disko","Dubstep","Leicht zuhören","eklektisch","Edm","Elektro","Elektronisch","Electronica","Unterhaltung","Ethnische Programmierung","Experimental-","Eigenschaften","Volk","Volksmusik","Freiform","Funk","Evangelium","gotisch","griechisch","Hardrock","heavy metal","HipHop","Schlägt","hot adult contemporary","house","Humor","ici premiere","Indien","Indie","Information","instrumental","Italienischer Pop","Jazz","Kinder","lateinisch","Leben","lokal","Lokalnachrichten","London","Los Angeles","Salon","Mediaset","Merengue","Metall","Misc","Moderner Rock","Montreal","Multikulturell","mehrsprachig","Musik","new age","New york city","Nachrichten","Nachrichtengespräch","Nicht kommerziell","Noticias","npr","Oldies","Ottawa","Outre-mer","Pacifica","Politik","Pop","Prag","Pri","Progressiv","psychedelisch","public","Punk","R & b","Rap","Reggae","Reggaeton","Regional","relax","Religion","Rfe-rl","Rnb","Rock","Rogers","Roma","Salsa","Schlager","Glatter Jazz","Seele","Soundtrack","Sport","Sr","Studentenradio","Schwedischer Radio","talk","Techno","Oben 40","Toronto","Trance","tropisch","Universität","urban","Vallenato","Vancouver","Vielfalt","Videospiel","Waynesboro","Winnipeg","Weltmusik"]
];

// Language file. Use as follows:
// var lg = translate.de;
// alert(lg.book); //Alerts "Speicher"
var translate = {
    us: { 
        Country:        "Country",
        Style:          "Style",
        Language:       "Language",
        Close:          "Close",
        Makenewstation: "New Station",
        EditStation:    "Edit station",
        Playingstation: "You're listening to...",
        initcast:       "Init chromecast",
        About1:          "About Radio S<span class='w3-medium'>2</span>S",
        About2:          "About Radio S<span class='w3-xlarge'>2</span>S",
        Favorits:       "Favorites",
        homeurl:        "Home",
        State:          "State",
        Tags:           "Style",
        Codec:          "Codec",
        Bitrate:        "Bitrate",
        Rating:         "Rating",
        Votes:          "Votes",
        NameStation:    "Name",
        Stream:         "Stream (url)",
        Homepage:       "Homepage (url)",
        Favicon:        "Favicon (url)",
        New:            "New",
        Delete:         "Delete",
        Save:           "Save",
        Cancel:         "Cancel",
        EditStations:   "Edit Stations",
        nothingtoedit:  "No stations to edit yet",
        star:           "star",
        stars:          "stars",
        closeapp:       "Exit App",
        Searchfor:      "Search for stations...",
        noinfo:         "Sorry, no information available",
        msg01:          "Radio Station-to-Station is a simple and free internet radio player by Frans Schrijver, Scriptel. Radio S2s is available as android app and as chrome extension.",
        msg02:          "Many thanks to ",
        msg03:          ", a community approach to collect as many internet radio stations as possible.",
        wrn01:          "Hi there!",
        wrn02:          "You have no favorites yet",
        msg04:          "This program is free software: you can redistribute it and/or modify it under the terms of the GNU    General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.",
        msg05:          "This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.",
        wrn03:          "Show radio stations by selecting country, style and/or language, or use the search bar. Make a station favorit by giving it one or more stars.",

    },
    nl: { 
        Country:        "Land",
        Style:          "Genre",
        Language:       "Taal",
        Close:          "Sluiten",
        Makenewstation: "Nieuw radiostation",
        EditStation:    "Bewerk radiostation",
        Playingstation: "Je luistert naar...",
        initcast:       "Activeer chromecast",
        About1:          "Over Radio S<span class='w3-small'>2</span>S",
        About2:          "Over Radio S<span class='w3-xlarge'>2</span>S",
        Favorits:       "Favorieten",
        homeurl:        "Home",
        State:          "Regio",
        Tags:           "Genre",
        Codec:          "Codec",
        Bitrate:        "Bitsnelheid",
        Rating:         "Rating",
        Votes:          "Stemmen",
        NameStation:    "Naam",
        Stream:         "Stream (url)",
        Homepage:       "Homepagina (url)",
        Favicon:        "Logo (url)",
        New:            "Nieuw",
        Delete:         "Wis",
        Save:           "Bewaar",
        Cancel:         "Annuleer",
        EditStations:   "Bewerk radiostations",
        nothingtoedit:  "Nog geen stations om te bewerken",
        closeapp:       "App afsluiten",
        star:           "ster",
        stars:          "sterren",
        Searchfor:      "Zoek radiostations...",
        noinfo:         "Sorry, geen informatie beschikbaar",
        msg01:          "Radio Station-to-Station is een simpele en gratis internet radio speler van Frans Schrijver, Scriptel. Radio S2s is beschikbaar als android app en als chrome extensie.",
        msg02:          "Veel dank aan ",
        msg03:          ", een community-aanpak om zo veel mogelijk internetradiozenders te verzamelen.",
        wrn01:          "Hallo!",
        wrn02:          "Je hebt nog geen favorieten",
        msg04:          "Dit programma is gratis software: je kunt deze opnieuw distribueren en/of wijzigen onder de voorwaarden van de GNU General Public License, zoals gepubliceerd door de Free Software Foundation, versie 3 van de licentie, of (naar keuze) elke latere versie.",
        msg05:          "Dit programma is verspreid in de hoop dat het nuttig zal zijn, maar zonder enige garantie. Zonder zelfs de impliciete garantie van VERKOOPBAARHEID of GESCHIKTHEID VOOR EEN BEPAALD DOEL. Raadpleeg de GNU General Public License voor meer informatie.",
        wrn03:          "Kies radiostations door land, genre en/of taal te selecteren of gebruik de zoekbalk. Maak een station favoriet door het een of meer sterren te geven.",
    },
    de: { 
        Country:        "Land",
        Style:          "Genre",
        Language:       "Sprache",
        Close:          "Close",
        Makenewstation: "Neue Radiosender ",
        EditStation:    "Edit Radiosender",
        Playingstation: "Du hörst...",
        initcast:       "Activate Chrome",
        About:          "Über Radio S<span class='w3-xlarge'>2</span>S",
        Favorits:       "Favoriten",
        homeurl:        "Home",
        State:          "Region",
        Tags:           "Genre",
        Codec:          "Codec",
        Bitrate:        "Bitrate",
        Rating:         "Rating",
        Votes:          "Stimmen",
        NameStation:    "Name",
        Stream:         "Stream (url)",
        Homepage:       "Startseite (URL)",
        Favicon:        "Logo (URL)",
        New:            "Neu",
        Delete:         "Löschen",
        Save:           "Speicher",
        Cancel:         "Abbrechen",
        EditStations:   "Edit Radiosender ",
        nothingtoedit:  "Keine Sender zu bearbeiten",
        star:           "Star",
        stars:          "Stars",
        closeapp:       "Exit App",
        Searchfor:      "Suche nach Radiosendern ...",
        noinfo:         "Sorry, keine Informationen verfügbar ",
        msg01:          "Radio Station-to-Station ist ein einfacher und kostenloser Internet-Radio-Player von Frans Schrijver, Scriptel. Radio S2s ist als Android-App und als Chrome-Extension verfügbar.",
        msg02:          "Vielen Dank an ",
        msg03:          ", ein Gemeinschaftskonzept um so viel wie möglich Internet-Radiosender zu sammeln.",
        wrn01:          "Hallo!",
        wrn02:          "Sie haben noch keine Favoriten",
        msg04:          "Dieses Programm ist freie Software: Sie können es verbreiten und/oder es unter den Bedingungen des GNU General Public License ändern, wie von der Free Software Foundation veröffentlicht, entweder Version 3 der Lizenz oder (nach Ihrer Wahl) jede spätere Version.",
        msg05:          "Dieses Programm wird wird verteilt in der Hoffnung, dass es nützlich ist, aber ohne Garantie. Sogar ohne die implizite Gewährleistung der Marktfähigkeit oder Eignung für einen bestimmten Zweck. Lesen Sie die GNU General Public License für weitere Details.",
        wrn03:          "Zeigen Radiosender durch Auswählen Land, Genre und/oder die Sprache, oder verwenden Sie die Suchleiste . Machen Sie eine favorit Station durch einen oder mehr Sterne zu geben.",
    }
};
