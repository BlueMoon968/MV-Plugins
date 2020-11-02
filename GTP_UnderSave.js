/*
 * ==============================================================================
 * * GTP: Gamefall Team Plugins - Undertale Save System
 * ------------------------------------------------------------------------------
 *  GTP_UnderSave.js  Version 2.0
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.GTP_UnderSave = true;
Imported.GTP_UnderSave.version = 2.0;

/*:
* @plugindesc V 2.1 The save scene is changed like the one of Undertale
* @author Gamefall Team || Luca Mastroianni
* @help Insert in img/system the image of the background, paying attention
* to the file name.
*
* For opening the Undertale window, you should use this script call:
* 
* this.startUnderSave()
*
* Do you like this plugin?
* Please, mind a support donation on paypal <3
*
* https://www.paypal.me/GamefallTeamPlugins/usd
*
* Thank you!
*
* -- CHANGELOG --
* Version 1.0 : Plugin is released.
* Version 1.1: Rewrite portion of code.
* --------------------------------------------------
* Version 2.0: Complete code rewriting;
* Version 2.1: Removed Timeout;
*
*
* @param No location
* @desc The text displayed when there isn't a display location
* Default: ???
* @type text
* @default ???
*
* @param File Saved Text
* @desc The text displayed when the game is saved
* Default: File Saved.
* @type text
* @default File Saved.
*
* @param After Save Color
* @desc The color of the text when the game is saved successfully-
* Default: 17
* @type number
* @default 17
*
* @param Cursor Offset
* @desc The amount of space the cursor moves;
* @type number
* @default 170
*/

var Gamefall = Gamefall || {};
Gamefall.UnderSave = Gamefall.UnderSave || {};

(function($) {

    $.parameters = PluginManager.parameters('GTP_UnderSave')
    $.noLoc = String($.parameters["No location"]);
    $.underTextSave = String($.parameters["File Saved Text"]);
    $.colorSave = JSON.parse($.parameters["After Save Color"]);
    $.cursorMove = JSON.parse($.parameters["Cursor Offset"]);


    //###############################################################################
    //
    // GAME SYSTEM
    //
    //###############################################################################

    Game_System.prototype.underPlaytime = function() {
        return Math.floor(Graphics.frameCount / 60);
    };

    Game_System.prototype.underPlaytimeText = function() {
        var hour = Math.floor(this.underPlaytime() / 60 / 60);
        var min = Math.floor(this.underPlaytime() / 60) % 60;
        return hour.padZero(1) + ':' + min.padZero(2);
    };

    //###############################################################################
    //
    // GAME INTERPRETER
    //
    //###############################################################################

    Game_Interpreter.prototype.startUnderSave = function() {
        var scene = SceneManager._scene;
        var underWindow = new Window_Base(0,0, 430, 200);
        (function(p, self) {
            p.x = Graphics.boxWidth / 2 - p.width / 2;
            p.y = Graphics.boxHeight / 2 - p.height / 2
            p.called = false;

            p.openness = 0;

            p.backOpacity = 255

            p.standardBackOpacity = function() {
                return 255;
            }

            p.saveColor = function() {
                return this.changeTextColor(this.textColor($.colorSave));
            }

            p.drawActorLevel = function(actor, x, y) {
                this.drawText('LV', x, y, this.contents.width - 20, 'center');
                this.drawText(actor.level, x + this.textWidth('LV'), y, this.contents.width - 20, 'center');
            }

            p.refresh = function() {
                this.contents.clear()
                var actor = $gameParty.leader()
                if(this.called) this.saveColor()
                this.drawText(actor.name(), 20, 0, this.contents.width)
                this.drawActorLevel(actor, 0, 0)
                this.drawText($gameSystem.underPlaytimeText(), 20, 0, this.contents.width - 40, 'right');
                var loc = $gameMap.displayName() ? $gameMap.displayName() : $.noLoc
                this.drawText(loc, 20, this.fittingHeight(0) + 10, this.contents.width, 'left');
                if(this.called) this.drawText($.underTextSave, 60, this.fittingHeight(2), this.contents.width, 'left')
                else {
                    this.drawText(TextManager.save, 60, this.fittingHeight(2), this.contents.width, 'left')
                    this.drawText(TextManager.cancel, 60, this.fittingHeight(2), this.contents.width - this.textWidth(TextManager.cancel), 'right')
                }

            }

            p.refresh()

            p.curs = new Sprite()
            p.curs.bitmap = ImageManager.loadSystem('Save')
            p.curs.position.set(p.padding + 15, p.padding + p.fittingHeight(2))
            p.addChild(p.curs)
            p.index = 0;
            p.update = function() {
                Window_Base.prototype.update.call(this)
                if(this.called) {
                    if(Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered() || TouchInput.isCancelled()) {
                        SoundManager.playOk()
                        this.close()
                        this.parent.removeChild(this)
                        self._underSave = false;
                        Input.clear()
                    }
                    return;
                }
                if(Input.isTriggered('right') || Input.isTriggered('left')) {
                    SoundManager.playCursor()
                    this.index = this.index === 0 ? 1 : 0
                    this.curs.x = this.padding + 15 + (this.index * $.cursorMove)
                    return Input.clear()
                }
                if(Input.isTriggered('ok')) {
                    if(this.index > 0) {
                        SoundManager.playCancel()
                        this.close()
                        self._underSave = false;
                        this.parent.removeChild(this)
                        this.removeChild(this.curs)
                        return Input.clear()
                    }
                    $gameSystem.onBeforeSave()
                    self._underSave = false;
                    if(DataManager.saveGame(1)) {
                        SoundManager.playSave();
                        StorageManager.cleanBackup(1);
                        this.called = true
                        self._underSave = true;
                        self.setWaitMode('underSave')
                        this.refresh()
                    }
                    else {
                        SoundManager.playBuzzer()
                        this.close()
                        self._underSave = false;
                        this.parent.removeChild(this)
                    }
                    this.removeChild(this.curs)
                    return Input.clear()
                }
                if(Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                    SoundManager.playCancel()
                    this.close()
                    this.parent.removeChild(this)
                    self._underSave = false;
                    this.removeChild(this.curs)
                    return Input.clear()
                }
            }

        })(underWindow, this);
        this._underSave = true;
        this.setWaitMode('underSave')
        scene.addChild(underWindow)
        underWindow.open()
    }

      $.Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
      Game_Interpreter.prototype.updateWaitMode = function() {
        var waiting = null;
        if(this._waitMode === 'underSave') {
          waiting = this._underSave
        }
        if(waiting) {
          return true;
        } else if(waiting === false) {
          this._waitMode = '';
          return false;
        }
        return $.Game_Interpreter_updateWaitMode.apply(this, arguments);
      };

    //###############################################################################
    //
    // WINDOW MENU COMMAND
    //
    //###############################################################################

    Window_MenuCommand.prototype.addSaveCommand = function() {};


})(Gamefall.UnderSave)
