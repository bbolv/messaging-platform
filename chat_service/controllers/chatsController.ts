import type { Request, Response } from "express";
import type { ChatMessage } from "../models/Messages.js";
import type { ChatRoom } from "../models/Rooms.js";
import type { ChatGroup } from "../models/Groups.js";

type CreateMessageBody = Omit<
    ChatMessage,
    "createdAt" | "updatedAt" | "message"
> & {
    message: { text: string; isScribble?: boolean };
};
type CreateGroupBody = Pick<ChatGroup, "createdBy" | "groupName">;
interface GroupMemberBody {
    object: { id: string; member: string; username?: string };
}

const getErrorMessage = (error: unknown): string | undefined => {
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null && "message" in error) {
        return typeof error.message === "string" ? error.message : undefined;
    }
    return undefined;
};

import Message from "../models/Messages.js";
import Rooms from "../models/Rooms.js";
import Groups from "../models/Groups.js";

const createMessage = async (
    req: Request<Record<string, never>, unknown, CreateMessageBody>,
    res: Response
) => {
    try {
        const message = new Message(req.body);
        const messageSaved = await message.save();
        res.json(messageSaved);
    } catch (err) {
        return res.status(500).send(getErrorMessage(err));
    }
};

const createChatRoom = async (
    req: Request<Record<string, never>, unknown, ChatRoom>,
    res: Response
) => {
    const originalRoom = await Rooms.find({
        createdBy: req.body.createdBy,
        member: req.body.member
    });

    const duplicateRoom = await Rooms.find({
        createdBy: req.body.member,
        member: req.body.createdBy
    });

    try {
        if (originalRoom.length === 0) {
            if (duplicateRoom.length === 0) {
                const room = new Rooms(req.body);
                const roomSaved = await room.save();
                return res.json(roomSaved);
            } else {
                return res.json(duplicateRoom[0]);
            }
        } else {
            res.json(originalRoom[0]);
        }
    } catch (err) {
        return res.status(500).send({ error: getErrorMessage(err) });
    }
};

const createGroupRoom = async (
    req: Request<Record<string, never>, unknown, CreateGroupBody>,
    res: Response
) => {
    const { createdBy, groupName } = req.body;
    const members = [];
    members.push(createdBy);

    const groupObject = {
        createdBy,
        groupName,
        members
    };
    try {
        const group = new Groups(groupObject);
        const groupSaved = await group.save();
        res.json(groupSaved);
    } catch (err) {
        return res.status(500).send({ error: getErrorMessage(err) });
    }
};

const getAllMessages = async (req: Request, res: Response) => {
    const { chatId, from } = req.query;

    try {
        const messages = await Message.find({
            chatId: {
                $all: chatId
            }
        }).sort({ updatedAt: 1 });

        const shownMessages = messages.map((msg) => {
            if (from === msg.sender.toString()) {
                return {
                    text: msg.message.text,
                    sender: "sended",
                    sendedBy: from,
                    isScribble: msg.message.isScribble
                };
            } else {
                return {
                    text: msg.message.text,
                    sender: "received",
                    sendedBy: msg.sender.toString(),
                    isScribble: msg.message.isScribble
                };
            }
        });

        res.json(shownMessages);
    } catch (err) {
        return res.status(500).send(getErrorMessage(err));
    }
};

const getRoom = async (req: Request, res: Response) => {
    const id = req.query.id;

    try {
        const room = await Rooms.findById(id);
        res.json(room);
    } catch (err) {
        return res.status(500).send(getErrorMessage(err));
    }
};

const getGroup = async (req: Request, res: Response) => {
    const id = req.query.id;

    try {
        const group = await Groups.findById(id);
        res.json(group);
    } catch (err) {
        return res.status(500).send(getErrorMessage(err));
    }
};
const addMemberGroup = async (
    req: Request<Record<string, never>, unknown, GroupMemberBody>,
    res: Response
) => {
    const chatObject = req.body.object;

    if (chatObject.member === chatObject.username)
        return res.status(400).send("Action not allowed");

    try {
        const chatUpdated = await Groups.findOneAndUpdate(
            { _id: chatObject.id },
            { $push: { members: chatObject.member } },
            { new: true }
        );

        res.json(chatUpdated);
    } catch (err) {
        return res.status(500).send(getErrorMessage(err));
    }
};
const removeMemberGroup = async (
    req: Request<Record<string, never>, unknown, GroupMemberBody>,
    res: Response
) => {
    const memberToRemove = req.body.object.member;
    const groupId = req.body.object.id;

    try {
        const chat = await Groups.findById(groupId);
        if (!chat) {
            const error = new Error("Group not found");
            return res.status(404).json({ msg: error.message });
        }

        const chatUpdated = await Groups.findOneAndUpdate(
            { _id: groupId },
            { $pull: { members: memberToRemove } },
            { new: true }
        );

        res.json(chatUpdated);
    } catch (err) {
        return res.status(500).send(getErrorMessage(err));
    }
};

export {
    createMessage,
    createChatRoom,
    createGroupRoom,
    getAllMessages,
    getRoom,
    getGroup,
    addMemberGroup,
    removeMemberGroup
};
