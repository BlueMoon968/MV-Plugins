/*
 * ==============================================================================
 *  GTP: Gamefall Team Plugins - Small Menu System
 * ------------------------------------------------------------------------------
 *  GTP_SmallMenu.js  Version 1.0
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.GTP_SmallMenu = true;
Imported.GTP_SmallMenu.version = 1.0;

/*:
* @plugindesc Plugin that creates a menu like the one shown in the "Witch's house" game
* @author Gamefall Team || Luca Mastroianni || Nebula Games
* @help No plugin command.
* --CHANGELOG--
* Version 1.0 : Plugin released!
* @param Level or Custom Text?
* @desc Do you want to draw the level of the actor
* or a personal text? true-- PERSONAL false-- LEVEL
* Default: true
* @default true
* @param Custom Text Name
* @desc Select the name of the text under the actor name;
* Default: Age
* @default Age
* @param Custom Text
* @desc the text shown;
* Default: 20
* @default 20
*/


var Gamefall = Gamefall || {};
Gamefall.SmallMenu.parameters = PluginManager.parameters('GTP_SmallMenu');
Gamefall.SmallMenu.textEval = String(Gamefall.SmallMenu.parameters["Level or Custom Text?"] || 'true').toLowerCase();
Gamefall.SmallMenu.ageTextName = String(Gamefall.SmallMenu.parameters["Custom Text Name"] || 'Age');
Gamefall.SmallMenu.ageText = String(Gamefall.SmallMenu.parameters["Custom Text"] || '20');

//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.

function Scene_Menu() {
    this.initialize.apply(this, arguments);
}

Scene_Menu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Menu.prototype.constructor = Scene_Menu;

Scene_Menu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createStatusWindow();

    this._commandWindow.x = 20;
    this._commandWindow.y = Graphics.boxHeight - this._commandWindow.height - 60;
    this._statusWindow.x = this._commandWindow.x + 220;
    this._statusWindow.y = Graphics.boxHeight - this._statusWindow.height - 30;
};

Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
};

Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(0, 0);
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    this._commandWindow.setHandler('load',      this.commandLoad.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Menu.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_WStatus(0, 0);
    this.addWindow(this._statusWindow);
};



Scene_Menu.prototype.commandItem = function() {
    SceneManager.push(Scene_Item);
};

Scene_Menu.prototype.commandLoad = function() {
    SceneManager.push(Scene_Load);
};



//-----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.

function Window_MenuCommand() {
    this.initialize.apply(this, arguments);
}

Window_MenuCommand.prototype = Object.create(Window_Command.prototype);
Window_MenuCommand.prototype.constructor = Window_MenuCommand;

Window_MenuCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.selectLast();
};

Window_MenuCommand._lastCommandSymbol = null;

Window_MenuCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_MenuCommand.prototype.windowWidth = function() {
    return 200;
};

Window_MenuCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addOriginalCommands();
    this.addSaveCommand();
};

Window_MenuCommand.prototype.addMainCommands = function() {
    this.addCommand(TextManager.item, 'item');
};

Window_MenuCommand.prototype.addOriginalCommands = function() {
};


Window_MenuCommand.prototype.addSaveCommand = function() {
    this.addCommand('Load', 'load');
};



Window_MenuCommand.prototype.areMainCommandsEnabled = function() {
    return $gameParty.exists();
};


Window_MenuCommand.prototype.processOk = function() {
    Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_MenuCommand.prototype.selectLast = function() {
    this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
};

//-----------------------------------------------------------------------------
// Window_WStatus
//
// The window for displaying the party's WStatus.

function Window_WStatus() {
    this.initialize.apply(this, arguments);
}

Window_WStatus.prototype = Object.create(Window_Base.prototype);
Window_WStatus.prototype.constructor = Window_WStatus;

Window_WStatus.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

Window_WStatus.prototype.windowWidth = function() {
    return 560;
};

Window_WStatus.prototype.windowHeight = function() {
    return 180;
};

Window_WStatus.prototype.leader = function() {
    return $gameParty.members()[0];
};

Window_WStatus.prototype.drawActorAge = function(x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText(Gamefall.SmallMenu.ageTextName, x, y, 48);
    this.resetTextColor();
    this.drawText(Gamefall.SmallMenu.ageText, x + 40, y, 36, 'right');
};

Window_WStatus.prototype.customEval = function() {
    if(Gamefall.SmallMenu.textEval == 'true') {
        return this.drawActorAge(this.fittingHeight(3) + 20, this.fittingHeight(1));
    }
    else {
        return this.drawActorLevel(this.leader(), this.fittingHeight(3) + 20, this.fittingHeight(1));
    }
};

Window_WStatus.prototype.refresh = function() {
    this.contents.clear();
    this.drawActorFace(this.leader(), 0, 0);
    this.drawActorName(this.leader(), this.fittingHeight(3) + 20, this.fittingHeight(0) - 20, 168);
    this.customEval();
    this.drawActorHp(this.leader(), this.fittingHeight(7) + 15, this.fittingHeight(1) + 10, 186);
};

Window_WStatus.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

//-----------------------------------------------------------------------------
// Scene_Item
//
// The scene class of the item screen.

function Scene_Item() {
    this.initialize.apply(this, arguments);
}

Scene_Item.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Item.prototype.constructor = Scene_Item;

Scene_Item.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Item.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createItemWindow();
    this.createActorWindow();

    this._helpWindow.x = 0;
    this._helpWindow.y = 0;
    this._itemWindow.x = 0;
    this._itemWindow.y = Graphics.boxHeight - this._itemWindow.height;
};


Scene_Item.prototype.createItemWindow = function() {
    var wy = 0;
    var wh = 165;
    this._itemWindow = new Window_ItemList(0, 0, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._itemWindow.setCategory('all');
    this._itemWindow.activate();
    this._itemWindow.select(0);
    this.addWindow(this._itemWindow);
};

Scene_Item.prototype.user = function() {
    var members = $gameParty.movableMembers();
    var bestActor = members[0];
    var bestPha = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].pha > bestPha) {
            bestPha = members[i].pha;
            bestActor = members[i];
        }
    }
    return bestActor;
};


Scene_Item.prototype.onItemOk = function() {
    $gameParty.setLastItem(this.item());
    this.determineItem();
};

Scene_Item.prototype.onItemCancel = function() {
    this.popScene();
};

Scene_Item.prototype.playSeForItem = function() {
    SoundManager.playUseItem();
};

Scene_Item.prototype.useItem = function() {
    Scene_ItemBase.prototype.useItem.call(this);
    this._itemWindow.redrawCurrentItem();
};

//-----------------------------------------------------------------------------
// Window_ItemList
//
// The window for selecting an item on the item screen.

function Window_ItemList() {
    this.initialize.apply(this, arguments);
}

Window_ItemList.prototype = Object.create(Window_Selectable.prototype);
Window_ItemList.prototype.constructor = Window_ItemList;

Window_ItemList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = 'none';
    this._data = [];
};

Window_ItemList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.resetScroll();
    }
};

Window_ItemList.prototype.maxCols = function() {
    return 2;
};

Window_ItemList.prototype.spacing = function() {
    return 48;
};

Window_ItemList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_ItemList.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_ItemList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};

Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
    case 'all':
        return true;
    default:
        return false;
    }
};

Window_ItemList.prototype.needsNumber = function() {
    return true;
};

Window_ItemList.prototype.isEnabled = function(item) {
    return $gameParty.canUse(item);
};

Window_ItemList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems().filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_ItemList.prototype.selectLast = function() {
    var index = this._data.indexOf($gameParty.lastItem());
    this.select(index >= 0 ? index : 0);
};

Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_ItemList.prototype.numberWidth = function() {
    return this.textWidth('000');
};

Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

Window_ItemList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_ItemList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};
