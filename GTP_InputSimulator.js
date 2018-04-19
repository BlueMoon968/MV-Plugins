var Gamefall = Gamefall || {};
Gamefall.InputSimulator = Gamefall.InputSimulator || {};

var Imported = Imported || {};
Imported.GTP_InputSimulator = true;
Gamefall.InputSimulator.version = 1.00;

//==============================================================================
/*:
 * @plugindesc v1.00 Simulates the main MV System triggers
 * @author Gamefall Team || Luca Mastroianni
 * @help 
 * CHANGELOG
 * - VERSION 1.00: Plugin Released!
 * You can simulate a trigger using the plugin command:
 * simulate trigger [type]
 * simulate press [type]
 *
 * or you can use the script call:
 * simulateTrigger(type)
 * simulatePress(type, duration)
 *
 * You have this type:
 * - "ok" --> Simulate the action command;
 * - "cancel" --> Simulate the cancel command;
 * - "menu" --> Simulate the menu command;
 * - "shift" --> Simulate shift command;
 * - "left" --> Simulate left command;
 * - "right" --> Simulate right command;
 * - "up" --> Simulate up command;
 * - "down" -->Simulate down command;
 * - "pageup" --> Simulate pageup command;
 * - "pagedown" --> Simulate pagedown command;
 *
 * duration (in frames) = the duration arg is related to the press command; 
 * It communicates to the system how much time the button needs to be pressed;
 *
 * Examples:
 *
 * simulate trigger ok
 * simulate trigger menu
 * simulate press down 25
 *
 * simulateTrigger("ok")
 * simulateTrigger("menu")
 * simulatePress("down", 25)
 *
 * WARNING! On Script call pay attention to the commas ""
 *
 * Do you like this plugin? If you want, please support my contents!
 *
 * https://www.paypal.me/GamefallTeamPlugins/1usd
 *
 * Thank you!
 * 
 */
//==============================================================================

(function($) {

	//###############################################################################
	//
	// INPUT
	//
	//###############################################################################

	$.lastTrigger = null;
	$.lastPress = null;

	$.oldTrigger = Input.isTriggered 
	Input.isTriggered = function(keyName) {
	    if($.lastTrigger) {
	        this._latestButton = $.lastTrigger
	        $.lastTrigger = null;
	        this._pressedTime = 0
	        return $.oldTrigger.call(this, keyName)
	    }
	    return $.oldTrigger.call(this, keyName)
	};

	$.oldPress = Input.isPressed
	Input.isPressed = function(keyName) {
		if($.lastPress) {
			var trig = $.lastPress.slice()
			$.lastPress = null;
			var ms = Math.round(trig[1] * 16.66)
			this._currentState[trig[0]] = true
			setTimeout(function() {
				this._currentState[trig[0]] = false
				this.update()
			}.bind(this), ms)
			return !!this._currentState[trig[0]];
		}
		return $.oldPress.call(this, keyName)
	};


	if(!window.simulateTrigger) window.simulateTrigger = function(keyName) { return $.lastTrigger = keyName}
	if(!window.simulatePress) window.simulatePress = function(keyName, duration) { return $.lastPress = [keyName, duration]}

	//###############################################################################
	//
	// PLUGIN COMMANDS
	//
	//###############################################################################

	$.oldInterpreterPluginCommand = Game_Interpreter.prototype.pluginCommand
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
	    $.oldInterpreterPluginCommand.apply(this, arguments)
	    if(command.toLowerCase() === 'simulate') {
	    	if(args[0].toLowerCase() === 'trigger') return simulateTrigger(String(args[1]))
	    	else if(args[0].toLowerCase() === 'press') return simulatePress(String(args[1]), parseInt(args[2]))
	    }
	};



})(Gamefall.InputSimulator)