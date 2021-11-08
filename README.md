# react-native-simple-tween

Simple animation library based on setTimeout.

This library will animate values (floats and hex colors) and call an update function to retrieve the modified values.

## Install

```
npm install --save react-native-simple-tween
```

## Quick starts

```js
import SimpleTween from 'react-native-simple-tween';

const from = {
    x: 0,
    y: 1000,
    color: '#123456'
};
const to = {
    x: 100,
    y: 500,
    color: '#FFFFFF'
};
const tween = new SimpleTween(from, to, 1000);

tween.onUpdate((values) => {
    // Use the values here
    console.log('values', values);
});

tween.start();
```

### Chain the functions

```
tween.setDuration(500)
    .setDelay(100)
    .setCycle(true)
    .start();

tween.pause()
    .removeValue({x: 0})
    .resume();
```

## API

### Constructor (startValues, endValues, duration)

Instanciation takes 3 parameters: the start values, the end values and the duration of the animation.

```js
// Instanciate the tween object
const tween = new SimpleTween(from, to, 1000);
```

### Events

#### onUpdate (func)

Call a function and retrieve the values every time the values are updated (depends on the update time, changed with setUpdateTime).

```js
// Register update function
tween.onUpdate((values) => {
    console.log('update values', values);
});
```

#### onStart (func)

Call a function and retrieve the values every time the animation starts. It will be called on start and every time the animation reach an end in cycle mode.

```js
// Register start function
tween.onStart((values) => {
    console.log('start values', values);
});
```

#### onEnd (func)

Call a function and retrieve the values every time the animation ends. It will be called on start and every time the animation reach an end in cycle mode.

```js
// Register end function
tween.onEnd((values) => {
    console.log('end values', values);
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
tween.to({x: 100}, 1000);
```

#### setValues (values)

Stop the animation and set the current values

```js
// Set the values
tween.setValues({x: 0});
```

#### stopValue (valueName)

Stop one value in the animation. Animation will not stop and the value will be returned with the same current value.

```js
// Stop x value
tween.stopValue('x');
```

#### removeValue (valueName)

Remove a value from the animation. Animation will not stop and the value will no longer be returned.

```js
// Remove y value
tween.removeValue('y');
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

#### setDelay (ms)

Set a delay before starting the animation in ms. Default is 0.

```js
// Set the delay
tween.setDelay(500);
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

## TODO

- Implement request animation frame
- Add setInterval in backup
- Test with continuous loop for several hours
