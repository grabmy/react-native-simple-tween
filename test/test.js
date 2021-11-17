

const expect  = require('chai').expect;
const SimpleTween = require('../index.js');

// Simulating requestAnimationFrame
window.requestAnimationFrame = (fn) => {
    return setInterval(fn, 15);
};
window.cancelAnimationFrame = (id) => {
    clearInterval(id);
};



it('Testing', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 500);

    tween.setUpdateTime(50).setCycle(true).onMessage(message => {
        console.log('message: ' + message);
    }).onStart((values) => {
        console.log('on start', values);
    }).onUpdate((values) => {
        console.log('on update', values);
    }).onEnd((values) => {
        console.log('on end', values);
        done();
    }).start();
});



/*
it('Triggers start event', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 1, }, 100);
    let passed = false;

    tween.setUpdateTime(50).onStart(values => {
        passed = true;
    }).start();
    
    setTimeout(() => {
        expect(passed).to.equal(true);
        tween.stop();
        done();
    }, 200);
});


it('Triggers end event', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 1, }, 100);
    let passed = false;

    tween.setUpdateTime(50).onStop(values => {
        passed = true;
    }).start();
    
    setTimeout(() => {
        expect(passed).to.equal(true);
        tween.stop();
        done();
    }, 200);
});


it('Triggers update event', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 1, }, 100);
    let passed = false;

    tween.setUpdateTime(50).onUpdate(values => {
        passed = true;
    }).start();
    
    setTimeout(() => {
        expect(passed).to.equal(true);
        tween.stop();
        done();
    }, 200);
});


it('Triggers message event', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 1, }, 100);
    let passed = false;

    tween.setUpdateTime(50).onMessage(message => {
        if (message != '') {
            passed = true;
        }
    }).start();
    
    setTimeout(() => {
        expect(passed).to.equal(true);
        tween.stop();
        done();
    }, 200);
});


it('Use requestFrameAnimation', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 1, }, 100);
    let passed = false;

    tween.setUpdateTime(50).onMessage(message => {
        if (message.includes('using requestAnimationFrame')) {
            passed = true;
        }
    }).start();
    
    setTimeout(() => {
        expect(passed).to.equal(true);
        tween.stop();
        done();
    }, 200);
});


it('Tween number', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 1, }, 500);
    let passed = false;

    tween.setUpdateTime(50).onStart(values => {
        expect(values.test).to.equal(0);
    }).onUpdate(values => {
        expect(values.test).be.within(0, 1);
    }).onStop(values => {
        expect(values.test).to.equal(1);
    }).start();
    
    setTimeout(() => {
        tween.stop();
        done();
    }, 600);
});


it('Tween color', function(done) {
    const tween = new SimpleTween({ test: '#000000', }, { test: '#FFFFFF', }, 500);
    let passed = false;

    tween.setUpdateTime(50).onStart(values => {
        expect(values.test).to.equal('#000000');
    }).onUpdate(values => {
    }).onStop(values => {
        expect(values.test).to.equal('#ffffff');
    }).start();
    
    setTimeout(() => {
        tween.stop();
        done();
    }, 600);
});


it('Pause and resume', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 500);
    let stopped = false;

    setTimeout(() => {
        expect(tween.isPaused).be.eq(false);
        tween.pause();
        expect(tween.isPaused).be.eq(true);
    }, 250);

    setTimeout(() => {
        expect(tween.getValues().test).be.within(40, 60);
        expect(tween.isPaused).be.eq(true);
    }, 300);

    setTimeout(() => {
        expect(tween.isPaused).be.eq(true);
        tween.resume();
        expect(tween.isPaused).be.eq(false);
    }, 350);

    setTimeout(() => {
        expect(stopped).be.eq(true);
        done();
        tween.stop();
    }, 800);

    tween.setUpdateTime(50).onStop((values) => {
        stopped = true;
    }).start();
});


it('Use delay', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 250);
    let stopped = false;

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(true);
    }, 300);

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        expect(stopped).be.eq(true);
        done();
        tween.stop();
    }, 400);

    tween.setUpdateTime(25).setDelay(100).onStop((values) => {
        stopped = true;
    }).start();
});


it('Use delay', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 250);
    let stopped = false;

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(true);
    }, 300);

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        expect(stopped).be.eq(true);
        done();
        tween.stop();
    }, 400);

    tween.setUpdateTime(25).setDelay(100).onStop((values) => {
        stopped = true;
    }).start();
});


it('Use repeat', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 300);
    let stopped = false;

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(true);
    }, 1400);

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        expect(stopped).be.eq(true);
        done();
        tween.stop();
    }, 1600);

    tween.setUpdateTime(25).setRepeat(5).onStop((values) => {
        stopped = true;
    }).start();
});
*/

/*
it('Restart', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 200);
    let count = 0;

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        expect(count).be.eq(1);
        console.log('start');
        tween.start();
    }, 500);

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        expect(count).be.eq(2);
        done();
        tween.stop();
    }, 1000);

    tween.setUpdateTime(25).setRepeat(2).onStop((values) => {
        console.log('on stop');
        count++;
    }).onStart((values) => {
        console.log('on start');
    }).start();
});
*/

