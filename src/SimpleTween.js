
const Easing = require('./Easing.js');

class SimpleTween {

  /**
   * The current timeout id, set to 0 if not set
   */
  timeoutId = 0;

  /**
   * The current interval id, set to 0 if not set
   */
  intervalId = 0;
  
  /**
   * The current animation frame id, set to 0 if not set
   */
  animationFrameId = 0
  
  /**
   * Starting position for all the variables
   */
  startValues = {};

  /**
   * Ending position for all the variables
   */
  endValues = {};

  /**
   * Current position for all the variables
   */
  currentValues = {};

  /**
   * Time in ms between updates
   */
  updateTime = 1000 / 60;

  /**
   * If cycle is true, 
   */
  cycle = false;

  /**
   * Current animation direction
   */
  direction = 1;

  /**
   * Reset current values to start values when starting
   */
  resetOnStart = true;

  /**
   * Reset current values to start values when ending
   */
  resetOnEnd = false;

  /**
   * Easing function applied to values animation
   */
  easing = Easing.Linear.None;

  /**
   * True if is playing
   */
  isPlaying = false;

  /**
   * uration of the animation
   */
  duration = 0;

  /**
   * Delay before launching animation at start and end
   */
  delay = 0;

  /**
   * Number of times to repeat for each animation
   */
  repeat = 1;

  isPaused = false;
  pauseTime = 0;
  pauseStartTime = 0;
  pauseEndTime = 0;

  /**
   * Construct
   * 
   * @param {Object} startValues Start position for variables
   * @param {Object} endValues End position for variables
   * @param {integer} duration Duration in ms
   */
  constructor(startValues, endValues, duration) {
      this.startValues = startValues;
      this.endValues = endValues;
      this.currentValues = this.getValues(this.startValues, this.endValues);
      this.duration = duration;

      this.forward();

      this.process = this.process.bind(this);
      
      this.timeoutId = 0;
    
      this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Tools

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  rgbToHex(color) {
    var newColor = [];

    let hex = Math.round(color.r).toString(16);
    if (hex.length < 2) { hex = "0" + hex; }
    newColor.push(hex);

    hex = Math.round(color.g).toString(16);
    if (hex.length < 2) { hex = "0" + hex; }
    newColor.push(hex);

    hex = Math.round(color.b).toString(16);
    if (hex.length < 2) { hex = "0" + hex; }
    newColor.push(hex);

    return "#" + newColor.join("");
  }

  getValues(baseValues, defaultValues, previousValues) {
    const values = {};
    if (baseValues) {
      const baseKeys = Object.keys(baseValues);
      for (let index = 0; index < baseKeys.length; index++) {
        values[baseKeys[index]] = baseValues[baseKeys[index]];
      }
    }
    if (defaultValues) {
      const defaultKeys = Object.keys(defaultValues);
      for (let index = 0; index < defaultKeys.length; index++) {
        if (values[defaultKeys[index]] === undefined) {
          values[defaultKeys[index]] = defaultValues[defaultKeys[index]];
        }
      }
    }
    if (previousValues) {
      const previousKeys = Object.keys(previousValues);
      for (let index = 0; index < previousKeys.length; index++) {
        if (values[previousKeys[index]] === undefined) {
          values[previousKeys[index]] = previousValues[previousKeys[index]];
        }
      }
    }
    return values;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Setting options

  setUpdateTime(updateTime) {
    this.updateTime = updateTime;
    return this;
  }

  setDuration(duration) {
    this.duration = duration;
    return this;
  }

  setCycle(cycle) {
    this.cycle = cycle;
    return this;
  }

  setResetOnStart(resetOnStart) {
    this.resetOnStart = resetOnStart;
    return this;
  }

  setResetOnEnd(resetOnEnd) {
    this.resetOnEnd = resetOnEnd;
    return this;
  }

  setDelay(delay) {
    this.delay = delay;
    return this;
  }

  setDuration(duration) {
    this.duration = duration;
    return this;
  }

  setEasing(easingFunction) {
    this.easing = easingFunction;
    return this;
  }

  setValues(values) {
    if (this.isPlaying) {
      this.stop();
    }
    this.currentValues = values;
    if (this.updateFunction) {
      this.updateFunction(this.currentValues);
    }
    return this;
  }

  setRepeat(repeat) {
    this.repeat = repeat;
    return this;
  }

  stopValue(name) {
    if (this.currentValues[name] !== undefined) {
      this.startValues[name] = this.currentValues[name];
      this.endValues[name] = this.currentValues[name];
    }
    return this;
  }

  removeValue(name) {
    delete this.currentValues[name];
    delete this.startValues[name];
    delete this.endValues[name];
    return this;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Events

  onUpdate(updateFunction) {
    this.updateFunction = updateFunction;
    return this;
  }

  onStart(startFunction) {
    this.startFunction = startFunction;
    return this;
  }

  onEnd(endFunction) {
    this.endFunction = endFunction;
    return this;
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Control functions
  
  start(resetReapeat = true)
  {
    if (this.isPlaying) {
      this.stop();
    }

    if (resetReapeat) {
      this.repeatRest = this.repeat;
    }

    this.startTime = Date.now() + this.delay;
    this.endTime = Date.now() + this.delay + this.duration;
    this.isPlaying = true;

    if (this.resetOnStart && this.direction === 1) {
      this.currentValues = this.getValues(this.startValues, this.endValues, this.currentValues);
    }

    if (this.startFunction) {
      this.startFunction(this.currentValues);
    }
    
    // Set the next process time
    this.processTime = Date.now() + this.delay + this.updateTime;
    
    return this;
  }
  
  setProcessRequest() {
    if (this.requestAnimationFrame) {
      this.animationFrameId = this.requestAnimationFrame(Process);
    } else {
      this.timeoutId = setTimeout(() => {
          this.process();
      }, this.updateTime);
      this.intervalId = setInterval(() => {
          this.process();
      }, this.updateTime);
    }
  }

    
  setNextProcessRequest() {
    if (!this.requestAnimationFrame) {
      if (this.timeoutId) {
        this.cancelTimeout(this.timeoutId);
      }
      if (this.intervalId) {
        this.cancelInterval(this.intervalId);
      }
      this.timeoutId = setTimeout(() => {
          this.process();
      }, this.updateTime);
      this.intervalId = setInterval(() => {
          this.process();
      }, this.updateTime);
    }
  }

  cancelProcessRequest() {
    if (this.cancelAnimationFrame && this.animationFrameId) {
      this.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.timeoutId) {
      this.cancelTimeout(this.timeoutId);
    }
    if (this.intervalId) {
      this.cancelInterval(this.intervalId);
    }
  }
  
  process() {
    // On pause we do nothing and skip to next process
    if (this.isPaused) {
      this.setNextProcessRequest();
      return;
    }
    
    // If animation if not started, skip to next process
    if (Date.now() < this.startTime) {
      this.setNextProcessRequest();
      return;
    }
    
    // If process call too soon, skip to next process
    if (Date.now() < this.processTime) {
      this.setNextProcessRequest();
      return;
    }

    let linearProgress = 0;
    linearProgress = Date.now() < this.endTime ? 1 - (this.endTime - Date.now()) / (this.endTime - this.startTime) : 1;

    if (linearProgress <= 0) {
        linearProgress = 0;
    } else if (linearProgress > 1) {
        linearProgress = 1;
    }

    let progress = linearProgress;
    if (this.easing)
    {
      progress = this.easing(progress);
    }

    if (Date.now() < this.endTime)
    {
        this.timeoutId = setTimeout(() => {
            this.process();
        }, this.updateTime);
    }

    const keys = Object.keys(this.currentValues);
    for (let index = 0; index < keys.length; index++) {
      const name = keys[index];
      let startValue = this.startValues[name];
      let endValue = this.endValues[name];
      if (this.direction === -1) {
        startValue = this.endValues[name];
        endValue = this.startValues[name];
      }
      if (startValue !== endValue && startValue !== undefined && endValue !== undefined) {
        if (typeof startValue == 'number' && typeof endValue == 'number') {
          // For float
          this.currentValues[name] = startValue + (endValue - startValue) * progress;
        } else if (typeof startValue == 'string' && typeof endValue == 'string') { 
          // for color
          const startColor = this.hexToRgb(startValue);
          const endColor = this.hexToRgb(endValue);
          const newColor = {
            r: startColor.r + (endColor.r - startColor.r) * progress,
            g: startColor.g + (endColor.g - startColor.g) * progress,
            b: startColor.b + (endColor.b - startColor.b) * progress,
          };
          this.currentValues[name] = this.rgbToHex(newColor);
        }
      }      
    }

    if (this.updateFunction) {
      this.updateFunction(this.currentValues);
    }

    if (linearProgress >= 1 || Date.now() > this.endTime)
    {
      if (this.resetOnEnd) {
        this.getValues(this.startValues, this.endValues, this.currentValues);
        this.updateFunction(this.currentValues);
      }

      if (this.endFunction) {
        this.endFunction(this.currentValues);
      }
      this.stop();
      if (this.cycle)
      {
        this.reverse();
        if (this.direction == -1) {
          this.start(false);
        }
      }
    }

    if (!this.isPlaying && this.repeatRest) {
      if (this.repeatRest > 0) {
        this.repeatRest--;
      }
      if (this.repeatRest !== 0) {
        this.start(true);
      } else {
        this.stop();
      }
    }

    this.processTime = Date.now() + this.updateTime;
  }

  stop() {
    this.isPlaying = false;
    cancelProcessRequest();
    return this;
  }

  pause() {
    if (this.isPaused) {
      return this;
    }
    this.isPaused = true;
    this.pauseTime = Date.now();
    this.pauseStartTime = this.startTime - this.pauseTime;
    this.pauseEndTime = this.endTime - this.pauseTime;

    return this;
  }

  resume() {
    if (!this.isPaused) {
      return this;
    }
    this.isPaused = false;
    this.pauseTime = 0;
    this.startTime = Date.now() + this.pauseStartTime;
    this.endTime = Date.now() + this.pauseEndTime;
    return this;
  }

  reverse() {
    if (this.isPlaying) {
      this.stop();
    }
    this.direction = -this.direction;
    return this;
  }

  forward() {
    if (this.isPlaying) {
      this.stop();
    }
    this.direction = 1;
    return this;
  }

  backward() {
    if (this.isPlaying) {
      this.stop();
    }
    this.direction = -1;
    return this;
  }

  to(values, duration) {
    if (this.isPlaying) {
      this.stop();
    }
    this.startValues = this.currentValues;
    this.forward();
    this.endValues = values;
    this.setDuration(duration);
    this.start();
    return this;
  }

  reset() {
    this.resetStart();
  }
  
  resetStart() {
    if (this.isPlaying) {
      this.stop();
    }
    this.setValues(this.startValues);
  }
  
  resetEnd() {
    if (this.isPlaying) {
      this.stop();
    }
    this.setValues(this.endValues);
  }
}

SimpleTween.Easing = Easing;

module.exports = SimpleTween;
