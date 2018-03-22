//===================================================================================
//
// GAMEFALL DEBUGGER
//
//===================================================================================

/*:
* @plugindesc v1.00 Useful console developer tools.
* @author Gamefall Team || Luca Mastroianni
* @help
* CHANGELOG:
* - VERSION v1.00: Plugin released;
* 
* ♦ METHODS
* - console.findByName(group, name)
* This methods filter the inserted group by the name 
* of the content. 
* Ex. console.findByName($dataActors, 'Harold')
*
* - console.allWindows()
* This methods gets all the windows added 
* inside the current scene.
*
* -console.crash()
* Forces the game to crash;
*
* - console.actor(id)
* Returns the actor of the chosen id in a table;
*
* -console.mapInfo(id)
* Returns the map info of the chosen id in a table;
*
* ♦ PROPERTIES
* - console.scene
* Returns the current scene;
*
* - console.party
* Returns the current party members;
*
* - console.spriteset
* Returns the current spritest (if there is)
*
* LICENSE: MIT
*/

/* ♦ UTILITIES FOR RPG MAKER SCRIPT DEVELOPMENT */


Array.prototype.findIndex = Array.prototype.findIndex || function(callback) {
  if (this === null) {
    throw new TypeError('Array.prototype.findIndex called on null or undefined');
  } else if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }
  var list = Object(this);
  // Makes sures is always has an positive integer as length.
  var length = list.length >>> 0;
  var thisArg = arguments[1];
  for (var i = 0; i < length; i++) {
    if ( callback.call(thisArg, list[i], i, list) ) {
      return i;
    }
  }
  return -1;
};

//===================================================================================
//
// CONSOLE
//
//===================================================================================

(function($) {

	$.findByName = function(group, name) {
		var filt = group.filter(function(el) { if(el) return el.name.toLowerCase().contains(name.toLowerCase()) })
		if(filt.length <= 0) return this.error(`Any result found for ${name}`);
		return filt
	}

  Object.defineProperties($, {
    scene: {get: function() { return SceneManager._scene }, configurable: true},
    party: {get: function() { return $gameParty.members() }, configurable: true},
    spriteset: {get: function() { 
      if(!SceneManager._scene) return null;
      if(!SceneManager._scene._spriteset) return null;
      return SceneManager._scene._spriteset
    }, configurable: true}
  })

  $.allWindows = function() {
    if(!this.scene) return this.error('Any scene is available right now.');
    var layers = this.scene.children.filter(function(layer) { return layer instanceof WindowLayer })
    if(layers.length <= 0) return this.error('Any window layer found.');
    return layers.map(function(layer) { return layer.children })
  }

  $.crash = function() {
    return delete PIXI
  }

  $.actor = function(id) {
    var actor = $gameActors.actor(id)
    this.groupCollapsed(actor.name() + ` Id: ${id}`)
    Object.keys(actor).forEach(function(key) {
      this.groupCollapsed(key)
      this.log(actor[key])
      this.groupEnd()
    }, this)
    this.groupEnd()
  }

  $.mapInfo = function(id) {
    var info = $dataMapInfos[id]
    this.groupCollapsed(`Map ID: %c${id}`, 'fill: red;')
    Object.keys(info).forEach(function(key) {
      this.groupCollapsed(key)
      this.log(info[key])
      this.groupEnd()
    }, this)
    this.groupEnd()
  }

})(console)