const Easing = require("./Easing.js");

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
  animationFrameId = 0;

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
   * Delay when starting animation at start
   */
  startDelay = 0;

  /**
   * Number of times to repeat for each animation
   */
  repeat = 1;

  /**
   * Smoothnes of velocity when changing direction or destination with to()
   */
  smooth = 0;

  isPaused = false;
  pauseTime = 0;
  pauseStartTime = 0;
  pauseEndTime = 0;

  linearProgress = 0;

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
    this.previousValues = Object.assign({}, this.currentValues);
    //console.log("constructor: previous", this.previousValues);
    this.duration = duration;

    this.forward();

    this.process = this.process.bind(this);

    this.timeoutId = 0;
    this.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    this.cancelAnimationFrame =
      window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Tools

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  rgbToHex(color) {
    var newColor = [];

    let hex = Math.round(color.r).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    newColor.push(hex);

    hex = Math.round(color.g).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    newColor.push(hex);

    hex = Math.round(color.b).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    newColor.push(hex);

    return "#" + newColor.join("");
  }

  getValues(baseValues, defaultValues, previousValues) {
    const values = Object.assign({}, this.currentValues);
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

  computeVelocity(previousValues, currentValues) {
    this.previousValues = Object.assign({}, this.currentValues);
    this.previousVelocity = Object.assign({}, this.velocity);

    this.deltaTime = (Date.now() - this.velocityTime) / 1000 || 0;
    this.velocityTime = Date.now();
    const velocity = {};
    const previousKeys = Object.keys(previousValues);

    for (let index = 0; index < previousKeys.length; index++) {
      const name = previousKeys[index];
      if (
        previousValues[name] !== undefined &&
        currentValues[name] !== undefined &&
        typeof previousValues[name] == "number" &&
        typeof currentValues[name] == "number"
      ) {
        velocity[name] =
          this.deltaTime <= 0
            ? 0
            : (currentValues[name] - previousValues[name]) / this.deltaTime;
      }
    }
    this.velocity = velocity;
    //console.log("deltaTime", this.deltaTime);
    //console.log("velocity", this.velocity);
  }

  triggerEvent(name, data) {
    if (!this[name + "Function"]) {
      return;
    }
    if (!data) {
      this[name + "Function"](this.currentValues);
    } else {
      this[name + "Function"](data);
    }
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

  setDelays(startDelay, cycleDelay, repeatDelay, endDelay) {
    this.startDelay = startDelay;
    this.cycleDelay = cycleDelay;
    this.repeatDelay = repeatDelay;
    this.endDelay = endDelay;
    return this;
  }

  setStartDelay(startDelay) {
    this.startDelay = startDelay;
    return this;
  }

  setEndDelay(endDelay) {
    this.endDelay = endDelay;
    return this;
  }

  setCycleDelay(cycleDelay) {
    this.cycleDelay = cycleDelay;
    return this;
  }

  setRepeatDelay(repeatDelay) {
    this.repeatDelay = repeatDelay;
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
    this.triggerEvent("update");
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
    delete this.previousValues[name];

    return this;
  }

  setSmooth(smooth) {
    if (smooth < 0) {
      this.smooth = 0;
    } else if (this.smooth > 1) {
      this.smooth = 1;
    } else {
      this.smooth = smooth;
    }
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

  onCycle(cycleFunction) {
    this.cycleFunction = cycleFunction;
    return this;
  }

  onRepeat(repeatFunction) {
    this.repeatFunction = repeatFunction;
    return this;
  }

  onMessage(messageFunction) {
    this.messageFunction = messageFunction;
    return this;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Control functions

  start(resetRepeat = true) {
    if (resetRepeat) {
      this.triggerEvent("message", "Starting animation");
    } else {
      this.triggerEvent("message", "Restarting animation");
    }

    if (this.isPlaying) {
      this.stop();
    }

    if (resetRepeat) {
      this.repeatRest = this.repeat;
    }

    this.hasReachEndTime = false;

    this.startTime = Date.now();
    this.endTime = Date.now() + this.duration;

    // Setting the next wait delay
    if (this.cycle && this.direction === 1 && this.cycleDelay > 0) {
      this.triggerEvent(
        "message",
        "Using cycle delay (" + this.cycleDelay + ") for next wait time"
      );
      this.waitTime = Date.now() + this.duration + this.cycleDelay;
    } else if (
      this.repeatDelay > 0 &&
      ((!this.cycle && this.repeatRest > 1) ||
        (this.direction === -1 && this.repeatRest > 1))
    ) {
      this.triggerEvent(
        "message",
        "Using repeat delay (" + this.repeatDelay + ") for next wait time"
      );
      this.waitTime = Date.now() + this.duration + this.repeatDelay;
    } else if (this.endDelay > 0) {
      this.triggerEvent(
        "message",
        "Using end delay for (" + this.endDelay + ") next wait time"
      );
      this.waitTime = Date.now() + this.duration + this.endDelay;
    }

    // Adding delay on first start
    if (resetRepeat) {
      this.startTime += this.startDelay;
      this.endTime += this.startDelay;
      this.waitTime += this.startDelay;
    }

    this.isPlaying = true;

    if (this.resetOnStart && this.direction === 1) {
      this.currentValues = this.getValues(
        this.startValues,
        this.endValues,
        this.currentValues
      );
    }

    // Set the next process time
    this.processTime = Date.now() + this.updateTime;

    //console.log("processTime", this.processTime);
    //console.log("Date.now()", Date.now());
    this.setProcessRequest();
    if (resetRepeat) {
      this.triggerEvent("start");
    }
    this.triggerEvent("update");

    return this;
  }

  setProcessRequest() {
    if (this.requestAnimationFrame) {
      this.triggerEvent(
        "message",
        "Set process progress: using requestAnimationFrame"
      );
      this.animationFrameId = this.requestAnimationFrame(this.process);
    } else {
      this.triggerEvent(
        "message",
        "Set process progress: using setTimeout and setInterval"
      );
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
        clearTimeout(this.timeoutId);
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
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
      clearTimeout(this.timeoutId);
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  process() {
    // On pause we do nothing and skip to next process
    if (this.isPaused) {
      this.setNextProcessRequest();
      return;
    }

    // If animation is not started, skip to next process
    if (Date.now() < this.startTime) {
      this.setNextProcessRequest();
      return;
    }

    // If process call too soon, skip to next process
    if (Date.now() < this.processTime) {
      this.setNextProcessRequest();
      return;
    }

    // Animation is waiting in delay
    if (Date.now() > this.endTime && Date.now() < this.waitTime) {
      // Update values only once when reaching endTime
      if (!this.hasReachEndTime) {
        this.computeValues();
        this.triggerEvent("update");
        this.hasReachEndTime = true;
        this.triggerEvent("message", "Waiting " + (this.waitTime - Date.now()));
      }
      this.setNextProcessRequest();
      return;
    }

    this.computeValues();

    this.checkComplete();

    this.triggerEvent("update");

    // console.log('linearProgress = ' + this.linearProgress + ', direction = ' + this.direction);

    this.processTime = Date.now() + this.updateTime;
    this.setNextProcessRequest();
  }

  checkComplete() {
    // end at 100% forward
    if (this.linearProgress >= 1 && this.direction === 1) {
      if (this.cycle) {
        // cycle backward
        this.triggerEvent("cycle");

        this.reverse();
        this.start(false);
      } else if (this.repeatRest > 1) {
        // Repeat
        this.triggerEvent("repeat");
        this.repeatRest--;
        this.stop();
        if (this.resetOnEnd) {
          this.currentValues = this.getValues(
            this.startValues,
            this.endValues,
            this.currentValues
          );
          this.triggerEvent("update");
        }
        this.start(false);
      } else {
        // animation end
        if (this.repeatRest > 0) {
          this.repeatRest--;
        }

        // end now
        this.triggerEvent("end");
        this.stop();
        if (this.resetOnEnd) {
          this.currentValues = this.getValues(
            this.startValues,
            this.endValues,
            this.currentValues
          );
          this.triggerEvent("update");
        }
      }
    }
    // end at 0% backward
    else if (this.linearProgress >= 1 && this.direction === -1) {
      this.forward();
      if (this.repeatRest > 1) {
        // Repeat
        this.triggerEvent("repeat");
        this.repeatRest--;
        if (this.resetOnEnd) {
          this.currentValues = this.getValues(
            this.startValues,
            this.endValues,
            this.currentValues
          );
          this.triggerEvent("update");
        }
        this.start(false);
      } else {
        // animation end
        if (this.repeatRest > 0) {
          this.repeatRest--;
        }
        this.triggerEvent("end");
        this.stop();
        if (this.resetOnEnd) {
          this.currentValues = this.getValues(
            this.startValues,
            this.endValues,
            this.currentValues
          );
          this.triggerEvent("update");
        }
      }
    }
  }

  computeValues() {
    //console.log("-----------------------");
    //console.log("computeValues");
    this.computeVelocity(this.previousValues, this.currentValues);

    this.linearProgress = 0;
    this.linearProgress =
      Date.now() < this.endTime
        ? 1 - (this.endTime - Date.now()) / (this.endTime - this.startTime)
        : 1;

    if (this.linearProgress <= 0) {
      this.linearProgress = 0;
    } else if (this.linearProgress > 1) {
      this.linearProgress = 1;
    }

    let progress = this.linearProgress;
    if (this.easing) {
      progress = this.easing(progress);
    }

    const keys = Object.keys(this.currentValues);

    // For every value
    for (let index = 0; index < keys.length; index++) {
      // Name of the value
      const name = keys[index];

      let startValue = this.startValues[name];
      let endValue = this.endValues[name];

      if (this.direction === -1) {
        startValue = this.endValues[name];
        endValue = this.startValues[name];
      }

      // Check if must apply transition to this value
      if (
        startValue !== endValue &&
        startValue !== undefined &&
        endValue !== undefined
      ) {
        if (typeof startValue == "number" && typeof endValue == "number") {
          // For float
          const newValue = startValue + (endValue - startValue) * progress;
          //console.log("compute new velocity");
          const currentVelocity = this.deltaTime
            ? (newValue - this.currentValues[name]) / this.deltaTime
            : 0;
          const previousVelocity =
            this.previousVelocity[name] !== undefined
              ? this.previousVelocity[name]
              : 0;

          // Without smooth
          //this.currentValues[name] = newValue;

          // Apply smooth velocity here
          if (this.deltaTime) {
            this.currentValues[name] = this.applyVelocity(
              newValue,
              currentVelocity,
              previousVelocity
            );
          } else {
            // No time has passed, just set the values
            this.currentValues[name] = newValue;
          }
        } else if (
          typeof startValue == "string" &&
          typeof endValue == "string"
        ) {
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
  }

  applyVelocity(value, currentVelocity, previousVelocity) {
    //console.log("-------------------- smoothValue");
    //console.log("value", value);
    //console.log("currentVelocity", currentVelocity);
    //console.log("previousVelocity", previousVelocity);
    //console.log("smooth", this.smooth);
    //console.log("linearProgress", this.linearProgress);

    if (currentVelocity == 0 || this.smooth == 0 || this.linearProgress == 1) {
      return value;
    }

    let result =
      value +
      ((previousVelocity - currentVelocity) *
        (1 - this.linearProgress) *
        this.smooth *
        this.deltaTime) /
        3;
    //console.log("- result = ", result);
    return result;
    /*
    let result =
      value - (velocity) * (1 - this.linearProgress) * this.smooth;
    console.log("smoothValue result", result);
    console.log("-");

    return result;
    */
  }

  stop() {
    if (!this.isPlaying) {
      return this;
    }

    this.triggerEvent("message", "Stopping animation");

    this.computeValues();
    this.isPlaying = false;
    this.hasReachEndTime = true;
    this.cancelProcessRequest();
    this.triggerEvent("update");

    return this;
  }

  pause() {
    if (this.isPaused || !this.isPlaying) {
      return this;
    }

    this.computeValues();

    this.isPaused = true;
    this.pauseTime = Date.now();
    this.pauseStartTime = this.startTime - this.pauseTime;
    this.pauseEndTime = this.endTime - this.pauseTime;

    this.triggerEvent("update");

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
    this.startValues = Object.assign({}, this.currentValues);
    //console.log("to startValues", this.startValues);
    this.forward();
    this.endValues = values;
    //console.log("to startValues", this.endValues);
    this.setDuration(duration || this.duration);
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
