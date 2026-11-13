import { Router } from "express";
import {
    createMessage,
    createChatRoom,
    getAllMessages,
    getRoom,
    createGroupRoom,
    getGroup,
    addMemberGroup,
    removeMemberGroup
} from "../controllers/chatsController.js";

const router = Router();

router.post("/createmessage", createMessage);
router.post("/createchatroom", createChatRoom);
router.post("/creategrouproom", createGroupRoom);
router.get("/getmessages", getAllMessages);
router.get("/getroom", getRoom);
router.get("/getgroup", getGroup);
router.post("/addmember", addMemberGroup);
router.post("/removemember", removeMemberGroup);

export default router;
