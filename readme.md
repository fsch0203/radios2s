# RadioS2S

RadioS2S is an android application and chromium extension with which you can listen to every radio station that is available on the web. You can already choose from more than 25.000 stations, but you can add your own if one is missing. Every weblink that is playable in a webbrowser (HTML5) can be added. With the quick search option it's very easy to find you station.

You can find the Android app in the [Google Playstore](https://play.google.com/store/apps/details?id=com.scriptel.simplyradio). And the Chrome extension in the [Chrome Web Store](https://chrome.google.com/webstore/detail/radio-station-to-station/bjgdhmgldpmbfokgehkdkddahldjjmnc).

I have tried to make the user interface as simple as possible:
* select on country, style (genre) or language
* quick search by typing in (part of the) the name of the station
* give one or more stars if you want to save a station as a favoritee

RadioS2S is working together with Community Radio Browser, a wiki-like directory of internet radio stations from around the world.

## Usage

Based on config.xml the android apk is build in build.phonegap.com. The chromium extension is configured in manifest.json.

## Change log

#### Version 1.1.3 (2020-10-30)
- Minor bugs

#### Version 1.1.2 (2020-05-28)
- Make volume-slider draggable in mobile device
- Added country flag in favorites list

#### Version 1.1.1 (2020-05-18)
- Removed chromecast
- Comply to new api of radio-browser
- Migration utility to restore old favorites lists
- Option added to remove station from favorites list
- Show favicon of all favorites

#### Version 1.1.0
- Improved scaling of volume slider
- Small changes in layout
- Added date field in favorites list
- Option added to show and edit information of non-playing station
- Skipped storage permission
- History of listened stations visible in favorites list
- Added option to sort favorites
- Save position and size of window

#### Version 1.0.0
- First stable version
- TargetSdkVersion greater than 26

#### Version 0.3.3
- App starts in its own window (chrome extension)

#### Version 0.3.2
- New slider based on simple-slider.js
- No longer remote script injection
- Minor bugs solved
- Multi language: Dutch and German added

#### Version 0.3.1
- Minor bugs solved
- Made app available as chrome extension

#### Version 0.3.0
- Real-time usage of radio-browser database
- all stations always available
- station information is always up to date

#### Version 0.2.3
-Language errors corrected

#### Version 0.2.2
- New stations added
- Minor bugs solved

#### Version 0.2.1
- New stations added
- Support for other languages (Dutch, German)
- Minor bugs solved
- Changed name to Radio Station-to-Station

#### Version 0.2.0
- New stations added
- Updated list of countries, styles
- Show playing station on favicon
- Improved volume slider
- Added rating to info playingstation screen
- Voting service added
- Remember recent selection (country, style, language)
- Minor improvements

#### Version 0.1.1
- Minor bugs solved
- New stations added

#### Version 0.1.0
- Integration with RadioBrowser.info

#### Version 0.0.1
- Initial release

