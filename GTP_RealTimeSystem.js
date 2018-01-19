
/*
 * ==============================================================================
 *  GTP: Gamefall Team Plugins - Real Time System
 * ------------------------------------------------------------------------------
 *  GTP_RealTimeSystem.js  Version 1.0
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.GTP_RealTimeSystem = true;
Imported.GTP_RealTimeSystem.version = 1.0;

/*:
* @plugindesc This plugin set an in game day-cycle based on the time of the player's pc.
* @author Gamefall Team || Luca Mastroianni || Nebula Games
* @help For interior maps must be used the notetag <interior>, so 
* so the day cycle will be arrested in that place.
* --CHANGELOG--
* Version 1.0 : Plugin released!
* @param Dawn Tint
* @desc The tint screen of the dawn;
* Default: -60, -60, -30, 10
* @default -60, -60, -30, 10
* @param Day Tint
* @desc The tint screen of day time;
* Default: 0, 0, 0, 0
* @default 0, 0, 0, 0
* @param Afternoon Tint
* @desc The tint screen of the afternoon;
* Default: 32, 48, 32, 0
* @default 32, 48, 32, 0
* @param Sunset Tint
* @desc The tint screen of the sunset;
* Default: 68, -34, -34, 0
* @default 68,-34,-34,0
* @param Evening Tint
* @desc The tint screen of the evening;
* Default: -40, -40, -10, 30
* @default -40, -40, -10, 30
* @param Night Tint
* @desc The tint screen of the night;
* Default: -68, -68, 0, 68
* @default -68, -68, 0, 68
* @param Clock window in menu?
* @desc Do you want the clock window in menu?
* true ---- YES    false ---- NO
* Default: true
* @default true
*/


var Gamefall = Gamefall || {};
Gamefall.RealTime.parameters = PluginManager.parameters('GTP_RealTimeSystem');
Gamefall.RealTime.dawnTint = String(Gamefall.RealTime.parameters["Dawn Tint"] || "-59, -61, -29, 10");
Gamefall.RealTime.dayTint = String(Gamefall.RealTime.parameters["Day Tint"] || "0, 0, 0, 0");
Gamefall.RealTime.afternoonTint = String(Gamefall.RealTime.parameters["Afternoon Tint"] || "34, -34, 51, 0");
Gamefall.RealTime.sunsetTint = String(Gamefall.RealTime.parameters["Sunset Tint"] || "68, -34, -34, 0");
Gamefall.RealTime.eveningTint = String(Gamefall.RealTime.parameters["Evening Tint"] || "-68, -51, -17, 68");
Gamefall.RealTime.nightTint = String(Gamefall.RealTime.parameters["Night Tint"] || "-115, -100, 0, 150");
Gamefall.RealTime.clockWindow = String(Gamefall.RealTime.parameters["Clock window in menu?"] || "true").toLowerCase();

Game_Map.prototype.create = function() {
    this._changing = false;
    this._options = { hour12: false };
};

Gamefall.RealTime.gameMapUpdate = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    this.updateHours();
    this.updateCycle();
    Gamefall.RealTime.gameMapUpdate.call(this, sceneActive);
    //this.updateMonth();
};

Game_Map.prototype.updateHours = function() {
    this._date = new Date();
    this._date.toLocaleString('en-US', this._options);
    this._hours = this._date.getHours();
};

/*Game_Map.prototype.updateMonth = function() {
    this._month = this._date.getMonth().toString();
};*/

Game_Map.prototype.tintMaking = function(arr) {
  if (arr.length > 0) { arr[0] = Number(arr[0]); } else { arr.push(0); }
  if (arr.length > 1) { arr[1] = Number(arr[1]);} else { arr.push(0); }
  if (arr.length > 2) { arr[2] = Number(arr[2]); } else { arr.push(0); }
  if (arr.length > 3) { arr[3] = Number(arr[3]); } else { arr.push(0); }
  $gameScreen.startTint(arr, 120);
};

Game_Map.prototype.dayCycle = function() {
    var tintString = '';
    var tintArr = [0, 0, 0, 0];
    if(this._hours >= 4 && this._hours < 8 && tintString !== Gamefall.RealTime.dawnTint) {
        tintString = Gamefall.RealTime.dawnTint;
        tintArr = tintString.split(',');
        //$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 2);
        this.tintMaking(tintArr);
    }
    if(this._hours >= 8 && this._hours < 15 && tintString !== Gamefall.RealTime.dayTint) {
        tintString = Gamefall.RealTime.dayTint;
        tintArr = tintString.split(',');
        this.tintMaking(tintArr);
    }
    if(this._hours >= 15 && this._hours < 18 && tintString !== Gamefall.RealTime.afternoonTint) {
        tintString = Gamefall.RealTime.afternoonTint;
        tintArr = tintString.split(',');
        this.tintMaking(tintArr);
    }
    if(this._hours >= 18 && this._hours < 20 && tintString !== Gamefall.RealTime.sunsetTint) {
        tintString = Gamefall.RealTime.sunsetTint;
        tintArr = tintString.split(',');
        this.tintMaking(tintArr);
    }
    if(this._hours >= 20 && this._hours < 23 && tintString !== Gamefall.RealTime.eveningTint) {
        tintString = Gamefall.RealTime.eveningTint;
        tintArr = tintString.split(',');
        this.tintMaking(tintArr);
    }
    if(this._hours >= 23 && tintString !== Gamefall.RealTime.nightTint) {
        tintString = Gamefall.RealTime.nightTint;
        tintArr = tintString.split(',');
        this.tintMaking(tintArr);
    }
    if(this._hours >= 0 && this._hours < 4 && tintString !== Gamefall.RealTime.nightTint) {
        tintString = Gamefall.RealTime.nightTint;
        tintArr = tintString.split(',');
        this.tintMaking(tintArr);
    }

};

Game_Map.prototype.updateCycle = function() {
    if($dataMap.note.match(/<interior>/im)) { 
        return null;
    }
    else { 
        return this.dayCycle();
    };
};

var gamefall_sceneMapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    gamefall_sceneMapStart.call(this);
    if($dataMap.note.match(/<interior>/im)) { 
        return $gameScreen.startTint([0, 0, 0, 0], 0);
    }

};


//Clock Window
function Window_Clock() {
    this.initialize.apply(this, arguments);
}

Window_Clock.prototype = Object.create(Window_Base.prototype);
Window_Clock.prototype.constructor = Window_Clock;

Window_Clock.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};

Window_Clock.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this._date = new Date();
};

Window_Clock.prototype.windowWidth = function() {
    return 240;
};

Window_Clock.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_Clock.prototype.refresh = function() {
    this.contents.clear();
    this.contents.fontSize = 23;
    this.drawText(this._date.toLocaleString(), 0, 0, 168, 'left');
};

Window_Clock.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

//Scene Menu

Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createGoldWindow();
    this.createStatusWindow();
    this.creatingClock();
};

Scene_Menu.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this.updatingClock();
};

Scene_Menu.prototype.createClockWindow = function() {
    this._clockWindow = new Window_Clock(0, 0);
    this.addWindow(this._clockWindow);
};

Scene_Menu.prototype.creatingClock = function() {
    if(Gamefall.RealTime.clockWindow === 'true') {
        this.createClockWindow();
        this._clockWindow.x = this._goldWindow.x;
        this._clockWindow.y = this._goldWindow.y - this._clockWindow.height;     
    }
    else { return null; }
};

Scene_Menu.prototype.updatingClock = function() {
    if(Gamefall.RealTime.clockWindow === 'true') {
        return this._clockWindow.refresh()
    }
};