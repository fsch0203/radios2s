var DEVICE_STATE = {
    'IDLE': 0,
    'ACTIVE': 1,
    'WARNING': 2,
    'ERROR': 3
};

/**
 * Constants of states for CastPlayer 
 **/
var PLAYER_STATE = {
    'IDLE': 'IDLE',
    'LOADING': 'LOADING',
    'LOADED': 'LOADED',
    'PLAYING': 'PLAYING',
    'PAUSED': 'PAUSED',
    'STOPPED': 'STOPPED',
    'SEEKING': 'SEEKING',
    'ERROR': 'ERROR'
};

var CastPlayer = function () {
    /* device variables */
    // @type {DEVICE_STATE} A state for device
    this.deviceState = DEVICE_STATE.IDLE;

    /* receivers available */
    // @type {boolean} A boolean to indicate availability of receivers
    this.receivers_available = false;

    /* Cast player variables */
    // @type {Object} a chrome.cast.media.Media object
    this.currentMediaSession = null;
    // @type {Number} volume
    this.currentVolume = 0.5;
    // @type {Boolean} A flag for autoplay after load
    this.autoplay = true;
    // @type {string} a chrome.cast.Session object
    this.session = null;
    // @type {PLAYER_STATE} A state for Cast media player
    this.castPlayerState = PLAYER_STATE.IDLE;

    /* Local player variables */
    // @type {PLAYER_STATE} A state for local media player
    this.localPlayerState = PLAYER_STATE.IDLE;
    // @type {HTMLElement} local player
    this.localPlayer = null;
    // @type {Boolean} Fullscreen mode on/off
    // this.fullscreen = false;

    /* Current media variables */
    // @type {Boolean} Audio on and off
    this.audio = true;
    // @type {Number} A number for current media index
    // this.currentMediaIndex = 0;
    // @type {Number} A number for current media time
    this.currentMediaTime = 0;
    // @type {Number} A number for current media duration
    // this.currentMediaDuration = -1;
    // @type {Timer} A timer for tracking progress of media
    this.timer = null;
    // @type {Boolean} A boolean to stop timer update of progress when triggered by media status event 
    // this.progressFlag = true;
    // @type {Number} A number in milliseconds for minimal progress update
    // this.timerStep = 1000;

    /* media contents from JSON */
    this.mediaContents = null;

    this.initializeCastPlayer();
    this.initializeLocalPlayer();
};

/**
 * Initialize local media player 
 */
CastPlayer.prototype.initializeLocalPlayer = function () {
    this.localPlayer = document.getElementById('player');
    this.localPlayer.addEventListener('loadeddata', this.onMediaLoadedLocally.bind(this));
};

CastPlayer.prototype.initializeCastPlayer = function () {

    if (!chrome.cast || !chrome.cast.isAvailable) {
        setTimeout(this.initializeCastPlayer.bind(this), 1000);
        return;
    }
    var applicationID = '4F8B3483';
    var autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
    var sessionRequest = new chrome.cast.SessionRequest(applicationID);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
        this.sessionListener.bind(this),
        this.receiverListener.bind(this),
        autoJoinPolicy);

    chrome.cast.initialize(apiConfig, this.onInitSuccess.bind(this), this.onError.bind(this));

    this.initializeUI();
};

/**
 * Callback function for init success 
 */
CastPlayer.prototype.onInitSuccess = function () {
    console.log("init success");
    this.updateMediaControlUI();
};

/**
 * Generic error callback function 
 */
CastPlayer.prototype.onError = function () {
    console.log("error");
};

/**
 * @param {!Object} e A new session
 * This handles auto-join when a page is reloaded
 * When active session is detected, playback will automatically
 * join existing session and occur in Cast mode and media
 * status gets synced up with current media of the session 
 */
CastPlayer.prototype.sessionListener = function (e) {
    this.session = e;
    if (this.session) {
        this.deviceState = DEVICE_STATE.ACTIVE;
        if (this.session.media[0]) {
            this.onMediaDiscovered('activeSession', this.session.media[0]);
            this.syncCurrentMedia(this.session.media[0].media.contentId);
            // this.selectMediaUpdateUI(this.currentMediaIndex);
            this.updateDisplayMessage();
        } else {
            this.loadMedia();
        }
        this.session.addUpdateListener(this.sessionUpdateListener.bind(this));
    }
};

/**
 * @param {string} currentMediaURL
 */

/**
 * @param {string} e Receiver availability
 * This indicates availability of receivers but
 * does not provide a list of device IDs
 */
CastPlayer.prototype.receiverListener = function (e) {
    var hd = "Chromecast";
    var msg = "";
    if (e === 'available') {
        this.receivers_available = true;
        // castconnected = "available";
        this.updateMediaControlUI();
        console.log("receiver found");
        msg = "<p>Receiver found</p>";
    } else {
        console.log("receiver list empty");
        msg = "<p>No receiver found</p>";
    }
    // showMessage(hd,msg);
};

/**
 * session update listener
 */
CastPlayer.prototype.sessionUpdateListener = function (isAlive) {
    if (!isAlive) {
        this.session = null;
        this.deviceState = DEVICE_STATE.IDLE;
        this.castPlayerState = PLAYER_STATE.IDLE;
        this.currentMediaSession = null;
        clearInterval(this.timer);
        this.updateDisplayMessage();

        var online = navigator.onLine;
        if (online == true) {
            // continue to play media locally
            console.log("current time: " + this.currentMediaTime);
            this.playMediaLocally();
            this.updateMediaControlUI();
        }
    }
};


/**
 * Select a media content
 * @param {Number} mediaIndex A number for media index 
 */
// CastPlayer.prototype.selectMedia = function(mediaIndex) {
CastPlayer.prototype.selectMedia = function () {
    if (!this.currentMediaSession) {
        this.localPlayerState = PLAYER_STATE.IDLE;
        this.playMediaLocally();
    } else {
        this.castPlayerState = PLAYER_STATE.IDLE;
        this.playMedia();
    }
    // this.selectMediaUpdateUI(mediaIndex);
};

/**
 * Requests that a receiver application session be created or joined. By default, the SessionRequest
 * passed to the API at initialization time is used; this may be overridden by passing a different
 * session request in opt_sessionRequest. 
 */
CastPlayer.prototype.launchApp = function () {
    console.log("launching app...");
    chrome.cast.requestSession(
        this.sessionListener.bind(this),
        this.onLaunchError.bind(this));
    if (this.timer) {
        clearInterval(this.timer);
    }
};

/**
 * Callback function for request session success 
 * @param {Object} e A chrome.cast.Session object
 */
CastPlayer.prototype.onRequestSessionSuccess = function (e) {
    console.log("session success: " + e.sessionId);
    this.session = e;
    this.deviceState = DEVICE_STATE.ACTIVE;
    this.updateMediaControlUI();
    this.loadMedia();
    this.session.addUpdateListener(this.sessionUpdateListener.bind(this));
};

/**
 * Callback function for launch error
 */
CastPlayer.prototype.onLaunchError = function () {
    console.log("launch error: " + DEVICE_STATE.ERROR);
    this.deviceState = DEVICE_STATE.ERROR;
};

/**
 * Stops the running receiver application associated with the session.
 */
CastPlayer.prototype.stopApp = function () {
    this.session.stop(this.onStopAppSuccess.bind(this, 'Session stopped'),
        this.onError.bind(this));

};

/**
 * Callback function for stop app success 
 */
CastPlayer.prototype.onStopAppSuccess = function (message) {
    console.log(message);
    this.deviceState = DEVICE_STATE.IDLE;
    this.castPlayerState = PLAYER_STATE.IDLE;
    this.currentMediaSession = null;
    clearInterval(this.timer);
    this.updateDisplayMessage();

    // continue to play media locally
    console.log("current time: " + this.currentMediaTime);
    this.playMediaLocally();
    this.updateMediaControlUI();
};

/**
 * Loads media into a running receiver application
 * @param {Number} mediaIndex An index number to indicate current media content
 */
CastPlayer.prototype.loadMedia = function () {
    if (!this.session) {
        console.log("no session");
        this.playMedia();
        return;
    }
    // console.log("loading..." + this.mediaContents[mediaIndex]['title']);
    // var mediaInfo = new chrome.cast.media.MediaInfo(this.mediaContents[mediaIndex]['sources'][0]);
    var mediaInfo = new chrome.cast.media.MediaInfo(urlplaying);

    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.contentType = 'audio/mpeg';

    // mediaInfo.metadata.title = this.mediaContents[mediaIndex]['title'];
    // mediaInfo.metadata.images = [{'url': MEDIA_SOURCE_ROOT + this.mediaContents[mediaIndex]['thumb']}];

    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = this.autoplay;
    if (this.localPlayerState == PLAYER_STATE.PLAYING) {
        request.currentTime = this.localPlayer.currentTime;
        this.localPlayer.pause();
        this.localPlayerState = PLAYER_STATE.STOPPED;
    } else {
        request.currentTime = 0;
    }

    this.castPlayerState = PLAYER_STATE.LOADING;
    this.session.loadMedia(request,
        this.onMediaDiscovered.bind(this, 'loadMedia'),
        this.onLoadMediaError.bind(this));
};

/**
 * Callback function for loadMedia success
 * @param {Object} mediaSession A new media object.
 */
CastPlayer.prototype.onMediaDiscovered = function (how, mediaSession) {
    console.log("new media session ID:" + mediaSession.mediaSessionId + ' (' + how + ')');
    this.currentMediaSession = mediaSession;
    if (how == 'loadMedia') {
        if (this.autoplay) {
            this.castPlayerState = PLAYER_STATE.PLAYING;
        } else {
            this.castPlayerState = PLAYER_STATE.LOADED;
        }
    }

    if (how == 'activeSession') {
        this.castPlayerState = this.session.media[0].playerState;
        this.currentMediaTime = this.session.media[0].currentTime;
    }

    this.currentMediaSession.addUpdateListener(this.onMediaStatusUpdate.bind(this));

    if (this.localPlayerState == PLAYER_STATE.PLAYING) {
        this.localPlayerState = PLAYER_STATE.STOPPED;
    }
    // update UIs
    this.updateMediaControlUI();
    this.updateDisplayMessage();
};

/**
 * Callback function when media load returns error 
 */
CastPlayer.prototype.onLoadMediaError = function (e) {
    console.log("media error");
    this.castPlayerState = PLAYER_STATE.IDLE;
    // update UIs
    this.updateMediaControlUI();
    this.updateDisplayMessage();
};

/**
 * Callback function for media status update from receiver
 * @param {!Boolean} e true/false
 */
CastPlayer.prototype.onMediaStatusUpdate = function (e) {
    if (e == false) {
        this.currentMediaTime = 0;
        this.castPlayerState = PLAYER_STATE.IDLE;
    }
    console.log("updating media");
    // this.updateProgressBar(e);
    this.updateDisplayMessage();
    this.updateMediaControlUI();
};

/**
 * Play media in local player
 */
CastPlayer.prototype.playMediaLocally = function () {
    if (this.localPlayerState != PLAYER_STATE.PLAYING && this.localPlayerState != PLAYER_STATE.PAUSED) {
        // this.localPlayer.src = this.mediaContents[this.currentMediaIndex]['sources'][0];
        this.localPlayer.src = urlplaying;
        this.localPlayer.load();
    } else {
        this.localPlayer.play();
        // start progress timer
        // this.startProgressTimer(this.incrementMediaTime);
    }
    this.localPlayerState = PLAYER_STATE.PLAYING;
    this.updateMediaControlUI();
};

/**
 * Callback when media is loaded in local player 
 */
CastPlayer.prototype.onMediaLoadedLocally = function () {
    this.localPlayer.play();
};

/**
 * Play media in Cast mode 
 */
CastPlayer.prototype.playMedia = function () {
    if (!this.currentMediaSession) {
        this.playMediaLocally();
        return;
    }

    switch (this.castPlayerState) {
        case PLAYER_STATE.LOADED:
        case PLAYER_STATE.PAUSED:
            this.currentMediaSession.play(null,
                this.mediaCommandSuccessCallback.bind(this, "playing started for " + this.currentMediaSession.sessionId),
                this.onError.bind(this));
            this.currentMediaSession.addUpdateListener(this.onMediaStatusUpdate.bind(this));
            this.castPlayerState = PLAYER_STATE.PLAYING;
            // start progress timer
            // this.startProgressTimer(this.incrementMediaTime);
            break;
        case PLAYER_STATE.IDLE:
        case PLAYER_STATE.LOADING:
        case PLAYER_STATE.STOPPED:
            this.loadMedia();
            this.currentMediaSession.addUpdateListener(this.onMediaStatusUpdate.bind(this));
            this.castPlayerState = PLAYER_STATE.PLAYING;
            break;
        default:
            break;
    }
    this.updateMediaControlUI();
    this.updateDisplayMessage();
};

/**
 * Pause media playback in Cast mode  
 */
CastPlayer.prototype.pauseMedia = function () {
    if (!this.currentMediaSession) {
        this.pauseMediaLocally();
        return;
    }

    if (this.castPlayerState == PLAYER_STATE.PLAYING) {
        this.castPlayerState = PLAYER_STATE.PAUSED;
        this.currentMediaSession.pause(null,
            this.mediaCommandSuccessCallback.bind(this, "paused " + this.currentMediaSession.sessionId),
            this.onError.bind(this));
        this.updateMediaControlUI();
        this.updateDisplayMessage();
        clearInterval(this.timer);
    }
};

/**
 * Pause media playback in local player 
 */
CastPlayer.prototype.pauseMediaLocally = function () {
    this.localPlayer.pause();
    this.localPlayerState = PLAYER_STATE.PAUSED;
    this.updateMediaControlUI();
    clearInterval(this.timer);
};

/**
 * Stop media playback in either Cast or local mode  
 */
CastPlayer.prototype.stopMedia = function () {
    if (!this.currentMediaSession) {
        this.stopMediaLocally();
        return;
    }

    this.currentMediaSession.stop(null,
        this.mediaCommandSuccessCallback.bind(this, "stopped " + this.currentMediaSession.sessionId),
        this.onError.bind(this));
    this.castPlayerState = PLAYER_STATE.STOPPED;
    clearInterval(this.timer);

    this.updateDisplayMessage();
    this.updateMediaControlUI();
};

/**
 * Stop media playback in local player
 */
CastPlayer.prototype.stopMediaLocally = function () {
    this.localPlayer.stop();
    this.localPlayerState = PLAYER_STATE.STOPPED;
    this.updateMediaControlUI();
};

/**
 * Set media volume in Cast mode
 * @param {Boolean} mute A boolean  
 */
CastPlayer.prototype.setReceiverVolume = function (mute) {
    if (!mute) {
        console.log('this.currentVolume' + ': ' + this.currentVolume);
        this.session.setReceiverVolumeLevel(this.currentVolume,
            this.mediaCommandSuccessCallback.bind(this),
            this.onError.bind(this));
    } else {
        this.session.setReceiverMuted(true,
            this.mediaCommandSuccessCallback.bind(this),
            this.onError.bind(this));
    }
    this.updateMediaControlUI();
};

/**
 * Mute media function in either Cast or local mode 
 */
CastPlayer.prototype.muteMedia = function () {
    if (this.audio == true) {
        this.audio = false;
        document.getElementById('audio_on').style.display = 'none';
        document.getElementById('audio_off').style.display = 'block';
        if (this.currentMediaSession) {
            this.setReceiverVolume(true);
            console.log('setReceiverVolume' + ': ' + 'true');
        } else {
            this.localPlayer.muted = true;
        }
    } else {
        this.audio = true;
        document.getElementById('audio_on').style.display = 'block';
        document.getElementById('audio_off').style.display = 'none';
        if (this.currentMediaSession) {
            this.setReceiverVolume(false);
            console.log('setReceiverVolume' + ': ' + 'false');
        } else {
            this.localPlayer.muted = false;
        }
    }
    this.updateMediaControlUI();
};


/**
 * media seek function in either Cast or local mode
 * @param {Event} e An event object from seek 
 */
/**
 * Callback function for seek success
 * @param {String} info A string that describe seek event
 */
CastPlayer.prototype.onSeekSuccess = function (info) {
    console.log(info);
    this.castPlayerState = PLAYER_STATE.PLAYING;
    this.updateDisplayMessage();
    this.updateMediaControlUI();
};

/**
 * Callback function for media command success 
 */
CastPlayer.prototype.mediaCommandSuccessCallback = function (info, e) {
    console.log(info);
};

/**
 * Update progress bar when there is a media status update
 * @param {Object} e An media status update object 
 */
/**
 * Update display message depending on cast mode by deviceState 
 */
CastPlayer.prototype.updateDisplayMessage = function () {};

/**
 * Update media control UI components based on localPlayerState or castPlayerState
 */
CastPlayer.prototype.updateMediaControlUI = function () {
    // console.log('castconnected' + ': ' + castconnected);
    var playerState = this.deviceState == DEVICE_STATE.ACTIVE ? this.castPlayerState : this.localPlayerState;
    switch (playerState) {
        case PLAYER_STATE.LOADED:
        case PLAYER_STATE.PLAYING:
            document.getElementById("play").style.display = 'none';
            document.getElementById("pause").style.display = 'block';
            break;
        case PLAYER_STATE.PAUSED:
            // case PLAYER_STATE.IDLE:
        case PLAYER_STATE.LOADING:
        case PLAYER_STATE.STOPPED:
            // console.log('playerState' + ': ' + playerState);
            document.getElementById("play").style.display = 'block';
            document.getElementById("pause").style.display = 'none';
            break;
        default:
            break;
    }

    if (!this.receivers_available) {
        // castconnected = "unavailable";
        document.getElementById("casticonactive").style.display = 'none';
        document.getElementById("casticonidle").style.display = 'none';
        return;
    }

    if (this.deviceState == DEVICE_STATE.ACTIVE) {
        // castconnected = "active";
        document.getElementById("casticonactive").style.display = 'block';
        document.getElementById("casticonidle").style.display = 'none';
        // this.hideFullscreenButton();
    } else {
        console.log('receivers_available' + ': ' + this.receivers_available);
        document.getElementById("casticonidle").style.display = 'block';
        document.getElementById("casticonactive").style.display = 'none';
        // this.showFullscreenButton();
    }
};

/**
 * Initialize UI components and add event listeners 
 */
CastPlayer.prototype.initializeUI = function () {
    document.getElementById("casticonidle").addEventListener('click', this.launchApp.bind(this));
    document.getElementById("casticonactive").addEventListener('click', this.stopApp.bind(this));
    document.getElementById("play").addEventListener('click', this.loadMedia.bind(this));
    document.getElementById("pause").addEventListener('click', this.pauseMedia.bind(this));
};

/**
 * Show the volume slider
 */
CastPlayer.prototype.showVolumeSlider = function () {};

/**
 * Hide the volume slider 
 */
CastPlayer.prototype.hideVolumeSlider = function () {};

window.CastPlayer = CastPlayer;