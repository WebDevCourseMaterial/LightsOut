
/**
 * @fileoverview Serves as the model for the Lights Out example.
 *
 * @author fisherds@gmail.com (Dave Fisher)
 */

goog.provide('lightsout.LinearGame');

goog.require('goog.math');
goog.require('goog.array');

/**
 * Model object that keeps the state for the Lights game.
 *
 * @constructor
 * @param {number} numLights Number of lights in this game.
 */
lightsout.LinearGame = function(numLights) {
  // Validate the input parameter.
  if (!numLights || !goog.isNumber(numLights) ||
      numLights < lightsout.LinearGame.MIN_NUM_LIGHTS) {
    // Consider: Could throw an error even.
    numLights = lightsout.LinearGame.MIN_NUM_LIGHTS;
  }
  
  /**
   * Number of lights on the game board.
   * @type {number}
   */
  this.numLights = numLights;
  
  /**
   * Keeps track of the number of moves taken so far.
   * @type {number}
   */
  this.numMovesTaken = 0;
  
  /**
   * Array to keep track of the board state.  True means a light is on.
   * False indicates a light is off.
   * @type {Array.<boolean>}
   */
  this.lightStates = [];
  for (var i = 0; i < numLights; i++) {
    this.lightStates.push(false);
  }
  
  /**
   * Boolean flag that indicated when the game is doing setup work.
   * @type {boolean}
   * @private
   */
  this.doingSetup_ = false;
  
  
  this.newGame();
};

/**
 * Minimum number of lights to play the game.
 * @type {number}
 * @const
 */
lightsout.LinearGame.MIN_NUM_LIGHTS = 3;

/**
 * When initializing a game use this many random button clicks to scramble
 * the board starting state.
 * @type {number}
 * @const
 */
lightsout.LinearGame.NUM_RANDOM_INITIAL_CLICKS = 200;


/**
 * Logger for this class.
 * @type {goog.debug.Logger}
 */
lightsout.LinearGame.prototype.logger =
    goog.debug.Logger.getLogger('lightsout.LinearGame');


/**
 * Resets the game state for a new game.
 */
lightsout.LinearGame.prototype.newGame = function() {
  this.doingSetup_ = true;
  for (var i = 0; i < this.numLights; i++) {
    this.lightStates[i] = false;
  }
  
  // Randomly click a bunch of buttons to scramble the game state.
  for (var i = 0; i < lightsout.LinearGame.NUM_RANDOM_INITIAL_CLICKS; i++) {
    this.pressedLightAtIndex(goog.math.randomInt(this.numLights));
  }
  // Make sure you didn't magically end up in a win state for the start.
  if(this.checkForWin()) {
    this.pressedLightAtIndex(goog.math.randomInt(this.numLights));
  }
  this.numMovesTaken = 0;
  this.doingSetup_ = false;
};


/**
 * When the user presses a button call this method to update the game
 * then read values to determine the updated game state.
 * 
 * @param {number} lightIndex The light that is pressed in the view.
 * @return {boolean} Returns true if this press resulted in a win!
 */
lightsout.LinearGame.prototype.pressedLightAtIndex = function(lightIndex) {
  if (lightIndex < 0 || lightIndex >= this.numLights) {
    return false;  // Could also throw an error.
  }
  if (!this.doingSetup_ && this.checkForWin()) {
    return true;  // The gmae has already been won.  Ignore clicks.
  }
  this.numMovesTaken++;
  this.toggleStateAtIndex_(lightIndex-1);
  this.toggleStateAtIndex_(lightIndex);
  this.toggleStateAtIndex_(lightIndex+1);
  return this.checkForWin();
};


/**
 * Toggles the state of a light.
 * @param {number} lightIndex The light to toggle.
 * @private
 */
lightsout.LinearGame.prototype.toggleStateAtIndex_ = function(lightIndex) {
  if (lightIndex >= 0 && lightIndex < this.numLights) {
    this.lightStates[lightIndex] = !this.lightStates[lightIndex];
  }
};


/**
 * Returns if the game is in a win state.
 * See also: Return value of pressedLightAtIndex.
 * 
 * @return {boolean} true if all the lights are out.
 */
lightsout.LinearGame.prototype.checkForWin = function() {
  for (var i = 0; i < this.numLights; i++) {
    if (this.lightStates[i]) {
      return false; // If any light is on return false (game not won).
    }
  }
  return true; // All the lights were off.
};


/**
 * Returns the state of the light.
 *
 * @param {number} lightIndex Index of the light to query.
 * @return {boolean} True if the light is on.  False if the light is off.
 */
lightsout.LinearGame.prototype.isLightOnAtIndex = function(lightIndex) {
  return this.lightStates[lightIndex];
};


/**
 * Returns the number of moves taken so far this game.
 * @return {number} Number of moves taken this game.
 */
lightsout.LinearGame.prototype.getNumMovesTaken = function() {
  return this.numMovesTaken;
};
