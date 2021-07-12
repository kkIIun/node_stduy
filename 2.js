// 2.1.5 구조분해 할당
var candyMachine = {
  status: {
    name: "node",
    count: 5,
  },
  getCandy: function () {
    this.status.count--;
    return this.status.count;
  },
};

const newCandyMachine = {
  status: {
    name: "node",
    count: 5,
  },
  NewgetCandy() {
    this.status.count--;
    return this.status.count;
  },
};

const {
  NewgetCandy,
  status: { count },
} = newCandyMachine;

const array = ["nodejs", {}, 10, true];
const [node, obj, , bool] = array;

// 2.1.6 클래스

class Human {
  constructor(type) {
    this.type = type;
  }

  static isHuman(human) {
    return human instanceof Human;
  }

  breathe() {
    console.log("h-a-a-a-m");
  }
}

class Zero extends Human {
  constructor(type, firstname, lastname) {
    super(type);
    this.firstname = firstname;
    this.lastname = lastname;
  }

  sayName() {
    super.breathe();
    console.log(`${this.firstname} ${this.lastname}`);
  }
}

const newZero = new Zero("human", "Zero", "Cho");
console.log(Human.isHuman(newZero), newZero);

// 2.1.7 프로미스

const condition = false;
const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve("성공1");
  } else {
    reject("실패");
  }
});

promise
  .then((mesaage) => {
    console.log(mesaage);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    console.log("무조건");
  });

const promise1 = Promise.resolve("성공1");
const promise2 = Promise.resolve("성공2");
Promise.all([promise1, promise2])
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

// 2.1.8 async/await

function findAndSaveUser(Users) {
  Users.findone({})
    .then((user) => {
      user.name = "zero";
      return user.save();
    })
    .then((user) => {
      return Users.findone({ gender: "m" });
    })
    .then((user) => {
      //생략
    })
    .catch((error) => {
      console.log(error);
    });
}

async function findAndSaveUser(Users) {
  try {
    let user = await Users.findone({});
    user.name = "zero";
    user = await user.save();
    user = await Users.findone({ gender: "m" });
  } catch (error) {
    console.log(error);
  }
}
