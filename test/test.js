const SimpleTween = require('../index.js');

const tween = new SimpleTween({
    color: '#123456',
}, {
    color: "#ffffff"
}, 1000);


tween.setUpdateTime(100)
.onUpdate((values) => {
    console.log(values);
}).start();

