const Sequelize = require("sequelize");
const Hashtag = require("./hashtag");
const config = require("../config/config")["test"];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

describe("Hashtag 모델", () => {
  test("static init 메서드 호출", () => {
    expect(Hashtag.init(sequelize)).toBe(Hashtag);
  });

  test("static associate 메서드 호출", () => {
    const db = {
      Hashtag: {
        belongsToMany: jest.fn(),
      },
      Post: {},
    };
    Hashtag.associate(db);
    expect(db.Hashtag.belongsToMany).toBeCalledWith(db.Post, {
      through: "PostHashtag",
    });
  });
});
