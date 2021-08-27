const express = require("express");

const router = express.Router();
const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.render("main", { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router
  .route("/room")
  .get((req, res) => {
    res.render("room", { title: "GIF 채팅방 생성" });
  })
  .post(async (req, res, next) => {
    try {
      const newRoom = await Room.create({
        title: req.body.title,
        max: req.body.max,
        owner: req.session.color,
        password: req.body.password,
      });
      const io = req.app.get("io");
      io.of("/room").emit("newRoom", newRoom);
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

router
  .route("/room/:id")
  .get(async (req, res, next) => {
    try {
      const room = await Room.findOne({ _id: req.params.id });
      const io = req.app.get("io");
      if (!room) {
        return res.redirect("/?error=존재하지 않는 방입니다.");
      }
      if (room.password && room.password !== req.query.password) {
        return res.redirect("/?error=비밀번호가 틀렸습니다.");
      }
      const { rooms } = io.of("/chat").adapter;
      if (
        rooms &&
        rooms[req.param.id] &&
        room.max <= rooms[req.param.id].length
      ) {
        return res.redirect("/?error=허용 인원을 초과했습니다.");
      }
      return res.render("chat", {
        room,
        title: room.title,
        chats: [],
        user: req.session.color,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Room.remove({ _id: req.param.id });
      await Chat.remove({ room: req.param.id });
      res.send("ok");
      setTimeout(() => {
        req.app.get("io").of("/room").emit("removeRoom", req.params.id);
      }, 2000);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

module.exports = router;
