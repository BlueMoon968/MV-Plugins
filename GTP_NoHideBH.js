/*
 * ==============================================================================
 * * GTP: Gamefall Team Plugins - Non Hiding Battle Hud
 * ------------------------------------------------------------------------------
 *  GTP_NoHideBH.js  Version 1.0
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.GTP_NoHideBH = true;
Imported.GTP_NoHideBH.version = 1.0;

/*:
* @plugindesc The actor status window stay visible during Show Text command in battles.
* @author Gamefall Team || Luca Mastroianni || Nebula Games
* @help As the plugin description explain, this simple plugin allow
* the status window to stay visible during the show text command in battles.
* The effect are NOT visible in TEST battle.
* -- CHANGELOG --
* Version 1.0 : Plugin is released.
*
*/


Scene_Battle.prototype.updateStatusWindow = function() {
    if ($gameMessage.isBusy()) {
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    } else if (this.isActive() && !this._messageWindow.isClosing()) {
        this._statusWindow.open();
    }
};
