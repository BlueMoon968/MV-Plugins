/*
 * ==============================================================================
 * * GTP: Gamefall Team Plugins - Command Selection Color
 * ------------------------------------------------------------------------------
 *  GTP_SelectionColor.js  Version 1.1
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.SelectionColor = true;
Imported.SelectionColor.version = 1.1;

/*:
* @plugindesc Change the color of the current selection.
* @author Gamefall || Luca
* @help Insert in img/system the image of the background, paying attention
* to the file name.
*
* -- CHANGELOG --
* Version 1.0 : Plugin is released.
* Version 1.1 : Plugin Updated and fixed some problems;
* @param Selection Color
* @desc The number of the selection color.
* Default: 5
* @default 5
*/



// Parameters

var Gamefall = Gamefall || {};
Gamefall.SecColor = Gamefall.SecColor || {}
Gamefall.parameters = PluginManager.parameters('GTP_SelectionColor');
Gamefall.SecColor.selectionColor = Number(Gamefall.parameters['Selection Color'] || 5);


Gamefall.SecColor.oldDrawItem = Window_Command.prototype.drawItem
Window_Command.prototype.drawItem = function(index) {
    if(this.index() === index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.changeTextColor(this.textColor(Gamefall.SecColor.selectionColor));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    }
    else Gamefall.SecColor.oldDrawItem.call(this, index)
};

Gamefall.SecColor.oldUpdateCursor = Window_Command.prototype.updateCursor
Window_Command.prototype.updateCursor = function() {
    Gamefall.SecColor.oldUpdateCursor.call(this)
    this.refresh();
};