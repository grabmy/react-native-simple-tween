# react-native-simple-tween

Simple variables transition between 2 values with ease.

This library will animate values (floats and hex colors) and call an update function to retrieve the modified values, based on requestAnimationFrame and setTimeout, setInterval as fallback.

## Table of Contents

1. [Install](#install)
2. [Quick starts](#quick-start)
3. [Features](#features)
4. [API](#api)
5. [Status variables](#status-variables)
6. [Changelog](#changelog)

## Install

<a name="install"></a>

```
npm install --save react-native-simple-tween
```

## Quick start

<a name="quick-start"></a>

```js
import SimpleTween from "react-native-simple-tween";

const from = {
  x: 0,
  y: 1000,
  color: "#123456",
};
const to = {
  x: 100,
  y: 500,
  color: "#FFFFFF",
};
const tween = new SimpleTween(from, to, 1000);

tween.onUpdate((values) => {
  // Use the values here
  console.log("values", values);
});

tween.start();
```

## Features

<a name="features"></a>

### Chain the functions

```js
tween.setDuration(500).setStartDelay(100).setCycle(true).start();

tween.pause().removeValue({ x: 0 }).resume();
```

### Events system

List of events:

- Start: triggered when the animation start
- End: triggered when the animation end and stop
- Cycle: triggered when the animation reach 100% and reverse direction
- Repeat: triggered when the animation repeat
- Message: triggered when emit a message on important actions

```
With no cycle and no repeat
Start          End
0%-->--50%-->--100%

With cycle and no repeat
Start          Cycle            End
0%-->--50%-->--100%-->--50%-->--0%

With no cycle and repeat = 2
Start          Repeat              End
0%-->--50%-->--100%-0%-->--50%-->--100%

With cycle and repeat = 2
Start  Cycle    Repeat  Cycle    End
0%-->--100%-->--0%-->---100%-->--0%
```

### Duration and delays

The duration and delays are not perfectly accurate, depending on the device and task priorities. The animated values are updated when the device call requestAnimationFrame (setTimeout and setInterval as fallback) and the device might launch the updates with a few ms of shift. It means that the animation on loop may accumulate a big variation in time.

There is different types of delay:

- startDelay: delay before starting to animate the values at start
- cycleDelay: delay before cycle backward, only used with setCycle(true)
- repeatDelay: delay before repeating the animation, only used with repeat greater than 1 (repeat if default to 1)
- endDelay: delay after ending the animation

During delays, the animation is assumed as playing.

Duration is the time in ms to go from start to end. If the animation cycle, it will go from start to end in the duration and from end to start in the duration, so the whole animation will have 2 times the duration.

If the animation repeat, the whole duration will be multiplied by the number of repeat.

For example, an animation with 100ms duration, cycle = true and repeat = 2 will have a total time of 400ms from start to end.

```
With cycle, repeat = 2 and duration = 100 ms
0ms    100ms    200ms   300ms    400ms
Start  Cycle    Repeat  Cycle    End
0%-->--100%-->--0%-->---100%-->--0%
```

## API

### Constructor (startValues, endValues, duration)

Instanciation takes 3 parameters: the start values, the end values and the duration of the animation.

```js
const from = { a: 0, test: 1000 };
const to = { a: 1, test: 0 };
// Instanciate the tween object
const tween = new SimpleTween(from, to, 1000);
```

### Events

#### onUpdate (func)

Call a function and retrieve the values every time the values are updated (depends on the update time, changed with setUpdateTime).

The update event can be triggered multiple times with the same values, on cycle and repeat for example.

```js
// Register update function
tween.onUpdate((values) => {
  console.log("update values", values);
});
```

#### onStart (func)

Call a function and retrieve the values every time the animation starts. It will be called on start and every time the animation reach an end in cycle mode.

```js
// Register start function
tween.onStart((values) => {
  console.log("start values", values);
});
```

#### onEnd (func)

Call a function and retrieve the values every time the animation ends. It will be called when the animation reach the end and stops.

```js
// Register end function
tween.onEnd((values) => {
  console.log("end values", values);
});
```

#### onCycle (func)

Call a function and retrieve the values every time the animation reach 100% and cycle back.

```js
// Register cycle function
tween.onCycle((values) => {
  console.log("cycle values", values);
});
```

#### onRepeat (func)

Call a function and retrieve the values every time the animation repeats. Only works if repeat greated than 1.

```js
// Register repeat function
tween.onRepeat((values) => {
  console.log("repeat values", values);
});
```

#### onMessage (message)

Call a function and provide a system message for debug purpose.

```js
// Show the message in console
tween.onMessage((message) => {
  console.log("Message: " + message);
});
```

### Controls

#### start ()

Start the animation.

```js
// Start the animation
tween.start();
```

#### stop ()

Stop the naimation.

```js
// Stop the animation
tween.stop();
```

#### pause ()

Pause the animation. Stop event is not triggered.

```js
// Pause the animation
tween.pause();
```

#### resume ()

Resume an animation after a pause. Start is not triggered

```js
// Resume the animation
tween.resume();
```

#### to (values, duration)

Start an animation from the current values to the provided values in a duration.

```js
// Start animation of x in 1 sec
tween.to({ x: 100 }, 1000);
```

#### reset ()

Stop the animation and reset the current values to the start values. Current values have changed
so the update event is triggered.

```js
// Reset to start values
tween.reset();
```

#### setValues (values)

Stop the animation, set the current values and call update

```js
// Set the values
tween.setValues({ x: 0 });
```

#### stopValue (valueName)

Stop one value in the animation. Animation will not stop and the value will be returned with the same current value.

```js
// Stop x value
tween.stopValue("x");
```

#### removeValue (valueName)

Remove a value from the animation. Animation will not stop and the value will no longer be returned.

```js
// Remove y value
tween.removeValue("y");
```

### Settings

#### setUpdateTime (ms)

Set the time between update in ms. Default is 16 ms (60 update per second).

```js
// Set update to 100 ms or 10 updates / sec
tween.setUpdateTime(100);
```

#### setDuration (ms)

Set the duration of the animation of the values in ms.

```js
// Set duration of animation to 1 sec
tween.setDuration(1000);
```

#### setCycle (bool)

Set if the animation must cycle (yoyo), the values will go from start to end, then from end to start, then stop. Default is false.

```js
// Set cycle
tween.setCycle(true);
```

#### setResetOnStart (bool)

Reset values to start values when starting the animation. Default is true.

```js
// Set reset on start
tween.setResetOnStart(true);
```

#### setResetOnEnd (bool)

Reset values to end values when ending the animation. Default false.

```js
// Set cycle
tween.setCycle(true);
```

#### setDelays (startDelay, cycleDelay, repeatDelay, endDelay)

Set start, cycle, repeat and end delay in ms. Default is 0.

```js
// Set the delays
tween.setDelays(100, 100, 100, 0);
```

#### setStartDelay (ms)

Set the start delay in ms. Default is 0.

```js
// Set the delay
tween.setStartDelay(100);
```

#### setEndDelay (ms)

Set the end delay in ms. Default is 0.

```js
// Set the delay
tween.setEndDelay(100);
```

#### setCycleDelay (ms)

Set the cycle delay in ms. Default is 0.

```js
// Set the delay
tween.setCycleDelay(100);
```

#### setRepeatDelay (ms)

Set the repeat delay in ms. Default is 0.

```js
// Set the delay
tween.setRepeatDelay(100);
```

#### setEasing (func)

Set if the animation easing function. There is a list of usefull easing function in SimpleTween.Easing :

- Linear (None)
- Quadratic (In, Out, InOut)
- Cubic (In, Out, InOut)
- Quartic (In, Out, InOut)
- Quintic (In, Out, InOut)
- Sinusoidal (In, Out, InOut)
- Exponential (In, Out, InOut)
- Circular (In, Out, InOut)
- Elastic (In, Out, InOut)
- Back (In, Out, InOut)
- Bounce (In, Out, InOut)
- Vibrate (Once, Repeat2, Repeat3, Repeat5, Repeat10, Repeat15, Repeat20, Repeat30)

```js
// Set easing to linear
tween.setEasing(SimpleTween.Easing.Linear.None);
// Set easing to Quartic In
tween.setEasing(SimpleTween.Easing.Quartic.In);
// Set easing to Sinusoidal In and Out
tween.setEasing(SimpleTween.Easing.Sinusoidal.InOut);
```

## Status variables

### isPlaying

Returns true when playing. On delays, animation is assumed as playing.

```js
// Show if the animation is playing
console.log(tween.isPlaying);
```

### isPaused

Return true when paused.

```js
// Show if the animation is paused
console.log(tween.isPaused);
```

## Changelog

### Version 0.3

## DONE

- Implement request animation frame
- Add setTimeout / setInterval as fallback
- Pausing and starting trigger update event
- Function getValues() returns the current values
- Adding tests with command "npm test"
- Improve event system with cycle and repeat events
- Rename delay to startDelay

## TODO

- Add cycleDelay, endDelay and repeatDelay
- Function to disable requestAnimationFrame
- Add test to check disable requestAnimationFrame
- Add tests to new delays
- Animate deg and px string
- Implement deep values in objects / arrays to be animated
- Add smooth option to damp velocity
- Add sequence animation with names
- Test with continuous loop for several hours
- Implement a function to add a value
- Don't trigger update when values did not change

## PENDING

- Synchronize animation in a group
- Synchronize start between SimpleTween instances
