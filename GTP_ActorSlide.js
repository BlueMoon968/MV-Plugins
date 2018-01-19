/*
 * ==============================================================================
 * * GTP: Gamefall Team Plugins - Actore Slide Changer
 * ------------------------------------------------------------------------------
 *  GTP_ActorSlide.js  Version 1.0
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.GTP_ActorSlide = true;
Imported.GTP_ActorSlide.version = 1.0;

/*:
* @plugindesc Change the actors' movement to the start position at the beginning of a battle.
* @author Gamefall Team || Luca
* @help The plugin's parameter customize the movement to the start position of the battler in the Battle.
* The Default Value for all the parameters is 0.
* @param Actor Slide X
* @desc The value of the actor Slide X
* Default: 0
* @default 0
* @param Actor Slide Y
* @desc The value of the actor Slide Y
* Default: 0
* @default 0
* @param Actor Slide Width
* @desc The value of the actor Slide Width
* Default: 0
* @default 0
*/

var Gamefall = Gamefall || {};
Gamefall.ActorSlide.parameters = PluginManager.parameters('GTP_ActorSlide');
Gamefall.ActorSlide.ActorX = Number(Gamefall.ActorSlide.parameters["Actor Slide X"] || 0);
Gamefall.ActorSlide.ActorY = Number(Gamefall.ActorSlide.parameters["Actor Slide Y"] || 0);
Gamefall.ActorSlide.ActorWidth = Number(Gamefall.ActorSlide.parameters["Actor Slide Width"] || 0);


Sprite_Actor.prototype.moveToStartPosition = function() {
    this.startMove(Gamefall.ActorSlide.ActorX, Gamefall.ActorSlide.ActorY, Gamefall.ActorSlide.ActorWidth);
};