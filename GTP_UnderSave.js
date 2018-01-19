/*
 * ==============================================================================
 * * GTP: Gamefall Team Plugins - Undertale Save System
 * ------------------------------------------------------------------------------
 *  GTP_UnderSave.js  Version 1.1
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.GTP_UnderSave = true;
Imported.GTP_UnderSave.version = 1.1;

/*:
* @plugindesc The save scene is changed like the one of Undertale
* @author Gamefall Team || Luca Mastroianni || Nebula Games
* @help Insert in img/system the image of the background, paying attention
* to the file name.
* -- CHANGELOG --
* Version 1.0 : Plugin is released.
* Version 1.1: Rewrite portion of code.
* @param Actor ID
* @desc The Actor name and level ID displayed in the save scene
* Default: 1
* @default 1
* @param No location
* @desc The text displayed when there isn't a display location
* Default: ???
* @default ???
* @param File Saved Text
* @desc The text displayed when the game is saved
* Default: File Saved.
* @default File Saved.
* @param After Save Color
* @desc The color of the text when the game is saved successfully-
* Default: 17
* @default 17
*/

//Plugin Parameters

var Gamefall = Gamefall || {};
Gamefall.UnderSave.parameters = PluginManager.parameters('GTP_UnderSave.js');
Gamefall.UnderSave.actorUnderId = Number(Gamefall.UnderSave.parameters["Actor ID"] || 1);
Gamefall.UnderSave.noLoc = String(Gamefall.UnderSave.parameters["No location"] || '???');
Gamefall.UnderSave.underTextSave = String(Gamefall.UnderSave.parameters["File Saved Text"] || 'File Saved.');
Gamefall.UnderSave.colorSave = Number(Gamefall.UnderSave.parameters["After Save Color"] || 17);


//Game System

Game_System.prototype.underPlaytime = function() {
    return Math.floor(Graphics.frameCount / 60);
};

Game_System.prototype.underPlaytimeText = function() {
    var hour = Math.floor(this.underPlaytime() / 60 / 60);
    var min = Math.floor(this.underPlaytime() / 60) % 60;
    return hour.padZero(1) + ':' + min.padZero(2);
};


//-----------------------------------------------------------------------------
// Scene_File
//
// The superclass of Scene_Save and Scene_Load.

var heartsCommands = ['Save', 'Return'];

function Scene_UnderSave() {
    this.initialize.apply(this, arguments);
}

Scene_UnderSave.prototype = Object.create(Scene_MenuBase.prototype);
Scene_UnderSave.prototype.constructor = Scene_UnderSave;

Scene_UnderSave.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_UnderSave.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    DataManager.loadAllSavefileImages();
    this.createUnderSaving();
    this.createWindowLayer();
    this.createHeartCommands()
    this.createListWindow();
    
    this._underSavingWindow.x = 230;
    this._underSavingWindow.y = 200;
    this._listWindow.x = this._underSavingWindow.x;
    this._listWindow.y = this._underSavingWindow.y + 128;
    this._listWindow.opacity = 0;
    this._heartCommands.x = this._underSavingWindow.x;
    this._heartCommands.y = this._listWindow.y + 17;
};

Scene_UnderSave.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh();
};

Scene_UnderSave.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this._heartCommands.bitmap = ImageManager.loadSystem(heartsCommands[this._listWindow._index]);
};

Scene_UnderSave.prototype.createListWindow = function() {
    this._listWindow = new Window_UnderFile(0, 0);
    this._listWindow.setHandler('Save',     this.onSavefileOk.bind(this));
    this._listWindow.setHandler('Return', this.popScene.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};

Scene_UnderSave.prototype.createHeartCommands = function () {
    this._heartCommands = new Sprite();
    this.addChild(this._heartCommands);
};

Scene_UnderSave.prototype.createUnderSaving = function() {
    this._underSavingWindow = new Window_UnderSaving(0, 0);
    this._underSavingWindow.setHandler('ok', this.popScene.bind(this));
    this._underSavingWindow.refresh();
    this.addWindow(this._underSavingWindow);
};

Scene_UnderSave.prototype.activateListWindow = function() {
    this._listWindow.activate();
};


Scene_UnderSave.prototype.onSavefileOk = function() {
};

//-----------------------------------------------------------------------------
// Scene_Save
//
// The scene class of the save screen.

function Scene_Save() {
    this.initialize.apply(this, arguments);
}

Scene_Save.prototype = Object.create(Scene_UnderSave.prototype);
Scene_Save.prototype.constructor = Scene_Save;

Scene_Save.prototype.initialize = function() {
    Scene_UnderSave.prototype.initialize.call(this);
};

Scene_Save.prototype.onSavefileOk = function() {
    Scene_UnderSave.prototype.onSavefileOk.call(this);
    $gameSystem.onBeforeSave();
    if (DataManager.saveGame()) {
        this.onSaveSuccess();
    } else {
        this.onSaveFailure();
    }
};

Scene_Save.prototype.onSaveSuccess = function() {
    SoundManager.playSave();
	StorageManager.cleanBackup();
    this._underSavingWindow.onSaved();
    this._listWindow.close();
    this.removeChild(this._heartCommands);
    this._underSavingWindow.activate();
};


Scene_Save.prototype.onSaveFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};


//-----------------------------------------------------------------------------
// Window_UnderFile
//
// The window for selecting a save file on the save and load screens.

function Window_UnderFile() {
    this.initialize.apply(this, arguments);
}

Window_UnderFile.prototype = Object.create(Window_HorzCommand.prototype);
Window_UnderFile.prototype.constructor = Window_UnderFile;

Window_UnderFile.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    this.loadWindowskin();
};

Window_UnderFile.prototype.windowWidth = function() {
    return 430;
};

Window_UnderFile.prototype.maxCols = function() {
    return 2;
};

Window_UnderFile.prototype.updateBackOpacity = function() {
    this.backOpacity = 255;
};


Window_UnderFile.prototype.update = function() {
	Window_HorzCommand.prototype.update.call(this);
};

Window_UnderFile.prototype.makeCommandList = function() {
    this.addCommand('Save',    'Save');
    this.addCommand('Return',  'Return');
};

DataManager.maxSavefiles = function() {
    return 1;
};

Window_UnderFile.prototype.playOkSound = function() {
};

Window_UnderFile.prototype.close = function() {
    Window_Base.prototype.close.call(this);
};


//-----------------------------------------------------------------------------
// Window_UnderSaving
//
// The window for displaying the party's UnderSaving.

function Window_UnderSaving() {
    this.initialize.apply(this, arguments);
}

Window_UnderSaving.prototype = Object.create(Window_Selectable.prototype);
Window_UnderSaving.prototype.constructor = Window_UnderSaving;

Window_UnderSaving.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this._called = false;
};

Window_UnderSaving.prototype.windowWidth = function() {
    return 430;
};

Window_UnderSaving.prototype.windowHeight = function() {
    return 200;
};

Window_UnderSaving.prototype.updateBackOpacity = function() {
    this.backOpacity = 255;
};

Window_UnderSaving.prototype.refresh = function() {
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    this.drawUnderPlaytime();
    this.drawActorName($gameActors.actor(Gamefall.UnderSave.actorUnderId), this.fittingHeight(0), 0, width);
    this.drawActorLevel($gameActors.actor(Gamefall.UnderSave.actorUnderId), this.fittingHeight(4), 0);
    this.drawUnderLocation();
    if(this._called) {
        this.changeTextColor(this.textColor(Gamefall.UnderSave.colorSave));
        this.drawText(Gamefall.UnderSave.underTextSave, 80, this.fittingHeight(2), 168, 'left');
    }
};

Window_UnderSaving.prototype.drawActorLevel = function(actor, x, y) {
    if(!this._called) {
        this.resetTextColor(); }
    else {
        this.changeTextColor(this.textColor(Gamefall.UnderSave.colorSave));
    }
    this.drawText('LV', x, y, 48);
    this.drawText(actor.level, x + 10, y, 36, 'right');
};

Window_UnderSaving.prototype.underLocation = function() {
        if ($gameMap.displayName()) {
                return $gameMap.displayName();
        }
        else {
            return Gamefall.UnderSave.noLoc;
        }
};

Window_UnderSaving.prototype.drawActorName = function(actor, x, y, width) {
    width = width || 168;
    if(!this._called) {
        this.changeTextColor(this.hpColor(actor)); }
    else {
        this.changeTextColor(this.textColor(Gamefall.UnderSave.colorSave));
    }
    this.drawText(actor.name(), x, y, width);
};

Window_UnderSaving.prototype.drawUnderLocation = function(width) {
    width = width || 168;
    if(!this._called) {
        this.resetTextColor(); }
    else {
        this.changeTextColor(this.textColor(Gamefall.UnderSave.colorSave));
    }
    this.drawText(this.underLocation(), this.fittingHeight(0), this.fittingHeight(1) - 20, width - 6, 'left');
};

Window_UnderSaving.prototype.drawUnderPlaytime = function(width) {
    width = width || 168;
    if(!this._called) {
        this.resetTextColor(); }
    else {
        this.changeTextColor(this.textColor(Gamefall.UnderSave.colorSave));
    }
    this.drawText($gameSystem.underPlaytimeText(), this.fittingHeight(7), 0, width - 6, 'left');
};

Window_UnderSaving.prototype.onSaved = function() {
    this._called = true;
    this.refresh();
};


Window_UnderSaving.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};


// Scene Menu Updating


Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addGameEndCommand();
};

Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(0, 0);
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);

};