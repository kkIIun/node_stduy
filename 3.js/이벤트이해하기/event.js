const EventEmitter = require("events");

const MyEvent = new EventEmitter();
MyEvent.addListener("event1", () => {
  console.log("event1");
});
MyEvent.on("event2", () => {
  console.log("event2");
});
MyEvent.on("event2", () => {
  console.log("event2 추가");
});
MyEvent.once("event3", () => {
  console.log("event3 한 번만 사용가능");
});
MyEvent.emit("event1");
MyEvent.emit("event2");
MyEvent.emit("event3");
MyEvent.emit("event3");

MyEvent.on("event4", () => {
  console.log("event4");
});
MyEvent.removeAllListeners("event4");
MyEvent.emit("event4");

const listener = () => {
  console.log("event5");
};
MyEvent.on("event5", listener);
MyEvent.removeListener("event5", listener);
MyEvent.emit("event5");

console.log(MyEvent.listenerCount("event2"));
