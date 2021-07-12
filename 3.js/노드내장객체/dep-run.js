// 순환되는 대상을 빈 객체로 전달해줌
const dep1 = require("./dep1");
const dep2 = require("./dep2");
dep1();
dep2();
