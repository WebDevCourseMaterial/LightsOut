
/**
 * @fileoverview Serves as the view controller for the Lights Out game.
 *
 * @author fisherds@gmail.com (Dave Fisher)
 */

goog.provide('lightsout.LightsOutController');

goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.ui.Control');
goog.require('lightsout.LinearGame');



/**
 * Connects listeners to the buttons.
 *
 * @param {!Element} contentElement The element for this controller’s content.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
lightsout.LightsOutController = function(contentElement) {
  goog.base(this);

  /**
   * Container element for this controller's content.
   * @type {!Element}
   * @private
   */
  this.container_ = contentElement;

  /**
   * Array of light controls.
   * @type {Array.<goog.ui.Control>}
   * @private
   */
  this.lightControls_ = [];

  /**
   * Control for the new game button.
   * @type {goog.ui.Control}
   * @private
   */
  this.newGameControl_ = null;
  
  /**
   * Model object that will keep track of the game state.
   * @type {lightsout.LinearGame}
   * @private
   */
  this.game_ = new lightsout.LinearGame(13);
  
  /**
   * Holds events that should only be removed when the controller is disposed.
   * @type {goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);

  this.init_();
};
goog.inherits(lightsout.LightsOutController, goog.events.EventTarget);


/**
 * Logger for this class.
 * @type {goog.debug.Logger}
 */
lightsout.LightsOutController.prototype.logger =
    goog.debug.Logger.getLogger('lightsout.LightsOutController');


/**
 * Initialize the view controller.
 * @private
 */
lightsout.LightsOutController.prototype.init_ = function() {

  // Add control objects to the buttons.
  var lightEls = goog.dom.getElementsByClass('light');
  for (var i = 0; i < lightEls.length; i++) {
    var lightControl = new goog.ui.Control('');
    lightControl.decorate(lightEls[i]);
    this.eventHandler_.listen(lightControl, goog.ui.Component.EventType.ACTION,
        this.handleLightPress_);
    this.lightControls_.push(lightControl);
  }
  
  // Add a control for the new game button.
  this.newGameControl_ = new goog.ui.Control('');
  this.eventHandler_.listen(this.newGameControl_,
      goog.ui.Component.EventType.ACTION, this.handleNewGame_);
  this.newGameControl_.decorate(goog.dom.getElementByClass('new-game-button'));

  this.updateView_();
};


/**
 * Handles a click on a light.
 * @param {goog.events.Event} e Click event.
 * @private
 */
lightsout.LightsOutController.prototype.handleLightPress_ = function(e) {
//  this.logger.info("You clicked on a light");
  var lightIndex = goog.array.indexOf(this.lightControls_, e.target);
//  this.logger.info("You clicked on light number " + lightIndex);
//  var lightEl = e.target.getElement();
//  goog.dom.classes.add(lightEl, 'light-on');
  this.game_.pressedLightAtIndex(lightIndex);
  this.updateView_();
};


/**
 * Handles a click on a the new game button.
 * @param {goog.events.Event} e Click event.
 * @private
 */
lightsout.LightsOutController.prototype.handleNewGame_ = function(e) {
  this.game_.newGame();
  this.updateView_();
};


/**
 * Updates the light states.
 * @private
 */
lightsout.LightsOutController.prototype.updateView_ = function() {
  var titleEl = goog.dom.getElementByClass('title');
  var numMoves = this.game_.getNumMovesTaken();
  var gameWon = this.game_.checkForWin();
  if (gameWon) {
    titleEl.innerHTML = "You won in " + numMoves + " moves!";
  } else {
    if (numMoves == 0) {
      titleEl.innerHTML = "Turn the lights off!";
    } else if (numMoves == 1) {
      titleEl.innerHTML = "You have taken " + numMoves + " move.";  
    } else {
      titleEl.innerHTML = "You have taken " + numMoves + " moves.";
    }   
  }
  for (var i = 0; i < this.lightControls_.length; i++) {
    if (gameWon) {
      goog.dom.classes.remove(this.lightControls_[i].getElement(), 'light-on');
      goog.dom.classes.add(this.lightControls_[i].getElement(), 'game-won');
    } else {
      goog.dom.classes.remove(this.lightControls_[i].getElement(), 'game-won');
      if (this.game_.isLightOnAtIndex(i)) {
        goog.dom.classes.add(this.lightControls_[i].getElement(), 'light-on');
      } else {
        goog.dom.classes.remove(this.lightControls_[i].getElement(), 'light-on');
      }      
    }
  }
};


/** @inheritDoc */
lightsout.LightsOutController.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  // Remove listeners added.
  this.eventHandler_.removeAll();
  goog.dispose(this.eventHandler_);
  delete this.eventHandler_;

  // Remove listeners added by controls.
  for (var i = 0; i < this.lightControls_.length; i++) {
    goog.dispose(this.lightControls_[i]);
  }
  delete this.lightControls_;
  goog.dispose(this.newGameControl_);
  delete this.newGameControl_;

  // Remove the DOM elements.
  goog.dom.removeChildren(this.container_);
};
