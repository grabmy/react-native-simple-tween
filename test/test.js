const expect = require("chai").expect;
const SimpleTween = require("../index.js");

// Simulating requestAnimationFrame
window.requestAnimationFrame = (fn) => {
  return setInterval(fn, 15);
};
window.cancelAnimationFrame = (id) => {
  clearInterval(id);
};

/*
it("Test", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 500);
  const events = [];
  const timeoutIds = [];

  tween
    .setUpdateTime(50)
    .setSmooth(1)
    .onStart((values) => {
      events.push("start");
    })
    .onCycle((values) => {
      events.push("cycle");
    })
    .onUpdate((values) => {
      console.log(Math.round(values.test));
    })
    .onMessage((message) => {
      console.log("Message: " + message);
    })
    .onRepeat((values) => {
      events.push("repeat");
    })
    .onEnd((values) => {
      events.push("end");
    });

  afterEach(function () {
    tween.stop();
    timeoutIds.forEach((id) => {
      clearTimeout(id);
    });
  });

  setTimeout(() => {
    timeoutIds.push(
      setTimeout(() => {
        console.log("test 1", tween.getValues(), events);
        tween.to({ test: 0 });
      }, 250)
    );

    timeoutIds.push(
      setTimeout(() => {
        console.log("test end", tween.getValues(), events);
        done();
      }, 1000)
    );

    tween.start();
  }, 1000);
});
*/


it("Waits on start delay", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 200);
  const events = [];
  const timeoutIds = [];

  tween
    .setUpdateTime(25)
    .setStartDelay(400)
    .setEndDelay(0)
    .setCycleDelay(0)
    .setRepeatDelay(0)
    .setRepeat(1)
    .setCycle(false)
    .onStart((values) => {
      events.push("start");
    })
    .onCycle((values) => {
      events.push("cycle");
    })
    .onUpdate((values) => {
      //console.log(Math.round(values.test));
    })
    .onMessage((message) => {
      //console.log('Message: ' + message);
    })
    .onRepeat((values) => {
      events.push("repeat");
    })
    .onEnd((values) => {
      events.push("end");
    });

  afterEach(function () {
    tween.stop();
    timeoutIds.forEach((id) => {
      clearTimeout(id);
    });
  });

  setTimeout(() => {
    timeoutIds.push(
      setTimeout(() => {
        //console.log('start 1', tween.getValues(), events);
        expect(tween.getValues().test).to.eq(0);
        expect(events).to.eql(["start"]);
      }, 300)
    );

    timeoutIds.push(
      setTimeout(() => {
        //console.log('start 2', tween.getValues(), events);
        expect(tween.getValues().test).to.gt(0);
        expect(events).to.eql(["start"]);
      }, 500)
    );

    timeoutIds.push(
      setTimeout(() => {
        //console.log("start 3", tween.getValues(), events);
        expect(tween.getValues().test).to.eq(100);
        expect(events).to.eql(["start", "end"]);
        done();
      }, 800)
    );

    tween.start();
  }, 1000);
});


it("Waits on end delay", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 200);
  const events = [];
  const timeoutIds = [];

  tween
    .setUpdateTime(25)
    .setStartDelay(0)
    .setEndDelay(400)
    .setCycleDelay(0)
    .setRepeatDelay(0)
    .setRepeat(1)
    .setCycle(false)
    .onStart((values) => {
      events.push("start");
    })
    .onCycle((values) => {
      events.push("cycle");
    })
    .onUpdate((values) => {
      // console.log(Math.round(values.test));
    })
    .onMessage((message) => {
      //console.log('Message: ' + message);
    })
    .onRepeat((values) => {
      events.push("repeat");
    })
    .onEnd((values) => {
      events.push("end");
    });

  afterEach(function () {
    tween.stop();
    timeoutIds.forEach((id) => {
      clearTimeout(id);
    });
  });

  setTimeout(() => {
    timeoutIds.push(
      setTimeout(() => {
        //console.log('end 1', tween.getValues(), events);
        expect(tween.getValues().test).to.gt(0);
        expect(tween.getValues().test).to.lt(100);
        expect(events).to.eql(["start"]);
      }, 100)
    );

    timeoutIds.push(
      setTimeout(() => {
        //console.log('end 2', tween.getValues(), events);
        expect(tween.getValues().test).to.eq(100);
        expect(events).to.eql(["start"]);
      }, 300)
    );

    timeoutIds.push(
      setTimeout(() => {
        //console.log('end 3', tween.getValues(), events);
        expect(tween.getValues().test).to.eq(100);
        expect(events).to.eql(["start", "end"]);
        done();
      }, 700)
    );

    tween.start();
  }, 1000);
});


it("Waits on cycle delay", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 200);
  const events = [];
  const timeoutIds = [];

  tween
    .setUpdateTime(25)
    .setStartDelay(0)
    .setEndDelay(0)
    .setCycleDelay(400)
    .setRepeatDelay(0)
    .setRepeat(1)
    .setCycle(true)
    .onStart((values) => {
      events.push("start");
    })
    .onCycle((values) => {
      events.push("cycle");
    })
    .onUpdate((values) => {
      //console.log(Math.round(values.test));
    })
    .onMessage((message) => {
      //console.log('Message: ' + message);
    })
    .onRepeat((values) => {
      events.push("repeat");
    })
    .onEnd((values) => {
      events.push("end");
    });

  afterEach(function () {
    tween.stop();
    timeoutIds.forEach((id) => {
      clearTimeout(id);
    });
  });

  setTimeout(() => {
    timeoutIds.push(
      setTimeout(() => {
        //console.log('cycle 1', tween.getValues(), events);
        expect(tween.getValues().test).to.gt(0);
        expect(tween.getValues().test).to.lt(100);
        expect(events).to.eql(["start"]);
      }, 100)
    );

    timeoutIds.push(
      setTimeout(() => {
        //console.log('cycle 2', tween.getValues(), events);
        expect(tween.getValues().test).to.eq(100);
        expect(events).to.eql(["start"]);
      }, 300)
    );

    timeoutIds.push(
      setTimeout(() => {
        //console.log('cycle 3', tween.getValues(), events);
        expect(tween.getValues().test).to.gt(0);
        expect(tween.getValues().test).to.lt(100);
        expect(events).to.eql(["start", "cycle"]);
      }, 700)
    );

    timeoutIds.push(
      setTimeout(() => {
        //console.log('cycle 4', tween.getValues(), events);
        expect(tween.getValues().test).to.eq(0);
        expect(events).to.eql(["start", "cycle", "end"]);
        done();
      }, 1000)
    );

    tween.start();
  }, 1000);
});


it("Waits on repeat delay", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 200);
  const events = [];

  tween
    .setUpdateTime(25)
    .setStartDelay(0)
    .setEndDelay(0)
    .setCycleDelay(0)
    .setRepeatDelay(400)
    .setRepeat(2)
    .setCycle(false)
    .onStart((values) => {
      events.push("start");
    })
    .onCycle((values) => {
      events.push("cycle");
    })
    .onUpdate((values) => {
      // console.log(Math.round(values.test));
    })
    .onRepeat((values) => {
      events.push("repeat");
    })
    .onEnd((values) => {
      events.push("end");
    });

  setTimeout(() => {
    setTimeout(() => {
      //console.log('1', tween.getValues(), events);
      expect(tween.getValues().test).to.gt(0);
      expect(tween.getValues().test).to.lt(100);
      expect(events).to.eql(["start"]);
    }, 100);

    setTimeout(() => {
      //console.log('2', tween.getValues(), events);
      expect(tween.getValues().test).to.eq(100);
      expect(events).to.eql(["start"]);
    }, 300);

    setTimeout(() => {
      //console.log('3', tween.getValues(), events);
      expect(tween.getValues().test).to.gt(0);
      expect(tween.getValues().test).to.lt(100);
      expect(events).to.eql(["start", "repeat"]);
    }, 700);

    setTimeout(() => {
      //console.log('4', tween.getValues(), events);
      expect(tween.getValues().test).to.eq(100);
      expect(events).to.eql(["start", "repeat", "end"]);
      done();
    }, 1000);

    tween.start();
  }, 1000);
});

it("Triggers start event", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 1 }, 100);
  let passed = false;

  tween.setUpdateTime(50).onStart((values) => {
    passed = true;
  });

  setTimeout(() => {
    setTimeout(() => {
      expect(passed).to.equal(true);
      tween.stop();
      done();
    }, 200);

    tween.start();
  }, 1000);
});

it("Triggers end event", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 1 }, 100);
  let passed = false;

  tween.setUpdateTime(50).onEnd((values) => {
    passed = true;
  });

  setTimeout(() => {
    setTimeout(() => {
      expect(passed).to.equal(true);
      tween.stop();
      done();
    }, 200);

    tween.start();
  }, 1000);
});

it("Triggers update event", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 1 }, 100);
  let passed = false;

  tween.setUpdateTime(50).onUpdate((values) => {
    passed = true;
  });

  setTimeout(() => {
    setTimeout(() => {
      expect(passed).to.equal(true);
      tween.stop();
      done();
    }, 200);

    tween.start();
  }, 1000);
});

it("Triggers message event", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 1 }, 100);
  let passed = false;

  tween.setUpdateTime(50).onMessage((message) => {
    if (message != "") {
      passed = true;
    }
  });

  setTimeout(() => {
    setTimeout(() => {
      expect(passed).to.equal(true);
      tween.stop();
      done();
    }, 200);

    tween.start();
  }, 1000);
});

it("Triggers order with cycle and repeat ", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 100);
  const events = [];

  tween
    .setUpdateTime(25)
    .setRepeat(4)
    .setCycle(true)
    .onStart((values) => {
      events.push("start");
    })
    .onCycle((values) => {
      events.push("cycle");
    })
    .onRepeat((values) => {
      events.push("repeat");
    })
    .onEnd((values) => {
      events.push("end");
      expect(events).to.eql([
        "start",
        "cycle",
        "repeat",
        "cycle",
        "repeat",
        "cycle",
        "repeat",
        "cycle",
        "end",
      ]);
      tween.stop();
      done();
    });

  setTimeout(() => {
    tween.start();
  }, 1000);
});

it("Uses requestFrameAnimation", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 1 }, 100);
  let passed = false;

  tween.setUpdateTime(50).onMessage((message) => {
    if (message.includes("using requestAnimationFrame")) {
      passed = true;
    }
  });

  setTimeout(() => {
    setTimeout(() => {
      expect(passed).to.equal(true);
      tween.stop();
      done();
    }, 200);

    tween.start();
  }, 1000);
});

it("Tweens number", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 1 }, 500);

  tween
    .setUpdateTime(50)
    .onStart((values) => {
      expect(values.test).to.equal(0);
    })
    .onUpdate((values) => {
      expect(values.test).be.within(0, 1);
    })
    .onEnd((values) => {
      expect(values.test).to.equal(1);
    });

  setTimeout(() => {
    setTimeout(() => {
      tween.stop();
      done();
    }, 600);

    tween.start();
  }, 1000);
});

it("Tweens color", function (done) {
  const tween = new SimpleTween({ test: "#000000" }, { test: "#FFFFFF" }, 500);

  tween
    .setUpdateTime(50)
    .onStart((values) => {
      expect(values.test).to.equal("#000000");
    })
    .onUpdate((values) => {})
    .onEnd((values) => {
      expect(values.test).to.equal("#ffffff");
    });

  setTimeout(() => {
    setTimeout(() => {
      tween.stop();
      done();
    }, 600);

    tween.start();
  }, 1000);
});

it("Pause and resume", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 500);
  let stopped = false;

  tween.setUpdateTime(50).onEnd((values) => {
    stopped = true;
  });

  setTimeout(() => {
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

    tween.start();
  }, 1000);
});

it("Uses repeat", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 300);
  let stopped = false;
  const timeoutIds = [];

  tween
    .setUpdateTime(25)
    .setRepeat(5)
    .onEnd((values) => {
      stopped = true;
    })
    .onUpdate((values) => {
      //console.log(Math.round(values.test));
    })
    .onMessage((message) => {
      //console.log('Message: ' + message);
    });

  afterEach(function () {
    tween.stop();
    timeoutIds.forEach((id) => {
      clearTimeout(id);
    });
  });

  setTimeout(() => {
    timeoutIds.push(
      setTimeout(() => {
        expect(tween.isPlaying).be.eq(true);
      }, 1400)
    );

    timeoutIds.push(
      setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        expect(stopped).be.eq(true);
        done();
      }, 1600)
    );

    tween.start();
  }, 1000);
});

it("Starts again the animation after stop", function (done) {
  const tween = new SimpleTween({ test: 0 }, { test: 100 }, 100);
  const events = [];
  const timeoutIds = [];

  tween
    .setUpdateTime(25)
    .setRepeat(2)
    .onEnd((values) => {
      events.push("end");
    })
    .onStart((values) => {
      events.push("start");
    });

  afterEach(function () {
    tween.stop();
    timeoutIds.forEach((id) => {
      clearTimeout(id);
    });
  });

  setTimeout(() => {
    timeoutIds.push(
      setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        tween.start();
      }, 300)
    );

    timeoutIds.push(
      setTimeout(() => {
        expect(tween.isPlaying).be.eq(false);
        expect(events).to.eql(["start", "end", "start", "end"]);
        done();
        tween.stop();
      }, 600)
    );

    tween.start();
  }, 1000);
});


// Test on multiple tween at the same time
