

const expect  = require('chai').expect;
const SimpleTween = require('../index.js');


// Simulating requestAnimationFrame
window.requestAnimationFrame = (fn) => {
    return setInterval(fn, 15);
};
window.cancelAnimationFrame = (id) => {
    clearInterval(id);
};


it('Start delay', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 100);
    const events = [];

    tween.setUpdateTime(10).setStartDelay(200).setEndDelay(0).setCycleDelay(0).setRepeatDelay(0)
    .setRepeat(1).setCycle(false).onStart((values) => {
        events.push('start');
    }).onCycle((values) => {
        events.push('cycle');
    }).onRepeat((values) => {
        events.push('repeat');
    }).onEnd((values) => {
        events.push('end');
    }).start();

    setTimeout(() => {
        expect(tween.getValues().test).to.eq(0);
        expect(events).to.eql(['start']);
    }, 150);
    
    setTimeout(() => {
        expect(tween.getValues().test).to.gt(0);
        expect(events).to.eql(['start']);
    }, 250);
    
    setTimeout(() => {
        expect(tween.getValues().test).to.eq(100);
        expect(events).to.eql(['start', 'end']);
        done();
    }, 350);
});


it('End delay', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 100);
    const events = [];

    tween.setUpdateTime(10).setStartDelay(0).setEndDelay(200).setCycleDelay(0).setRepeatDelay(0)
    .setRepeat(1).setCycle(false).onStart((values) => {
        events.push('start');
    }).onCycle((values) => {
        events.push('cycle');
    }).onRepeat((values) => {
        events.push('repeat');
    }).onEnd((values) => {
        events.push('end');
    }).start();

    setTimeout(() => {
        expect(tween.getValues().test).to.gt(0);
        expect(tween.getValues().test).to.lt(100);
        expect(events).to.eql(['start']);
    }, 50);
    
    setTimeout(() => {
        expect(tween.getValues().test).to.eq(100);
        expect(events).to.eql(['start']);
    }, 150);
    
    setTimeout(() => {
        expect(tween.getValues().test).to.eq(100);
        expect(events).to.eql(['start', 'end']);
        done();
    }, 350);
});


it('Cycle delay', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 100);
    const events = [];

    tween.setUpdateTime(10).setStartDelay(0).setEndDelay(0).setCycleDelay(200).setRepeatDelay(0)
    .setRepeat(1).setCycle(true).onStart((values) => {
        events.push('start');
    }).onCycle((values) => {
        events.push('cycle');
    }).onUpdate((values) => {
        //console.log(Math.round(values.test));
    }).onRepeat((values) => {
        events.push('repeat');
    }).onEnd((values) => {
        events.push('end');
    }).start();

    setTimeout(() => {
        expect(tween.getValues().test).to.gt(0);
        expect(tween.getValues().test).to.lt(100);
        expect(events).to.eql(['start']);
    }, 50);
    
    setTimeout(() => {
        expect(tween.getValues().test).to.eq(100);
        expect(events).to.eql(['start']);
    }, 150);
    
    setTimeout(() => {
        expect(tween.getValues().test).to.gt(0);
        expect(tween.getValues().test).to.lt(100);
        expect(events).to.eql(['start', 'cycle']);
        done();
    }, 350);

    setTimeout(() => {
        expect(tween.getValues().test).to.eq(0);
        expect(events).to.eql(['start', 'cycle', 'end']);
    }, 450);
    
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

    tween.setUpdateTime(50).onEnd(values => {
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


it('Triggers order with cycle and repeat ', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 100);
    const events = [];

    tween.setUpdateTime(25).setRepeat(4).setCycle(true).onStart((values) => {
        events.push('start');
    }).onCycle((values) => {
        events.push('cycle');
    }).onRepeat((values) => {
        events.push('repeat');
    }).onEnd((values) => {
        events.push('end');
        expect(events).to.eql(['start', 'cycle', 'repeat', 'cycle', 'repeat', 'cycle', 'repeat', 'cycle', 'end' ]);
        done();
    }).start();
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
    }).onEnd(values => {
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
    }).onEnd(values => {
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

    tween.setUpdateTime(50).onEnd((values) => {
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

    tween.setUpdateTime(25).setDelay(100).onEnd((values) => {
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

    tween.setUpdateTime(25).setRepeat(5).onEnd((values) => {
        stopped = true;
    }).start();
});


it('Launching the animation after stop', function(done) {
    const tween = new SimpleTween({ test: 0, }, { test: 100, }, 100);
    const events = [];

    tween.setUpdateTime(25).setRepeat(2).onEnd((values) => {
        events.push('end');
    }).onStart((values) => {
        events.push('start');
    }).start();

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        tween.start();
    }, 300);

    setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        expect(events).to.eql(['start', 'end', 'start', 'end' ]);
        done();
        tween.stop();
    }, 600);
});
*/

