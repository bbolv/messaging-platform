import Users from "../models/Users.js";

const createUser = async (req, res) => {
    try {
        const user = new Users(req.body);
        const userSaved = await user.save();
        res.json(userSaved);
    } catch (error) {
        const typeError = error.message.split(":")[2].trim();
        if (typeError === "email_1 dup key") {
            return res.status(404).json({ message: "DuplicateEmail" });
        } else if (typeError === "username_1 dup key") {
            return res.status(404).json({ message: "DuplicateUsername" });
        } else {
            return res.json(error);
        }
    }
};

const userProfile = async (req, res) => {
    try {
        const user = await Users.findOne(req.query);

        let requestsUsername = [];

        const requestsArray = user.requests;

        for (let i = 0; i < requestsArray.length; i++) {
            const user = await Users.findById(requestsArray[i].from);
            const contact = await Users.findById(requestsArray[i].to);

            let requestObj = {
                from: user.username,
                to: contact.username
            };

            requestsUsername.push(requestObj);
        }

        user.requests = requestsUsername;

        let contactsUsernameUser = [];

        const contactsArrayUser = user.contacts;

        for (let i = 0; i < contactsArrayUser.length; i++) {
            const user = await Users.findById(contactsArrayUser[i]);
            contactsUsernameUser.push(user.username);
        }

        user.contacts = contactsUsernameUser;

        res.json(user);
    } catch (error) {
        return res.json(error);
    }
};

const contactData = async (req, res) => {
    const usernamesArray = req.query.usernameArray.split(",");
    const dataArray = [];
    try {
        for (let i = 0; i < usernamesArray.length; i++) {
            const data = await Users.findOne({ username: usernamesArray[i] });
            dataArray.push(data);
        }
        res.json(dataArray);
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }
};

const searchContact = async (req, res) => {
    const contact = await Users.findOne(req.query);

    if (!contact) {
        const error = new Error("User not found");
        return res.status(404).json({ msg: error.message });
    }

    res.json(contact);
};

const requestsContact = async (req, res) => {
    const contact = await Users.findOne(req.query);

    if (!contact) {
        const error = new Error("User not found");
        return res.status(404).json({ msg: error.message });
    }

    res.json(contact);
};

const addContact = async (req, res) => {
    const userSend = req.body.user;
    const userReceive = req.body.contact;

    try {
        const user = await Users.findOne({ email: userSend.email }); //The one who sends the contact request
        const contact = await Users.findOne({ email: userReceive.email });

        if (!user || !contact) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        if (user._id.equals(contact._id)) {
            const error = new Error("Action not allowed");
            return res.status(400).json({ msg: error.message });
        }

        const contactId = contact._id;

        let doubleRequest = false;
        let alreadySent = false;

        if (user.contacts.includes(contactId)) {
            const error = new Error("User already in your contact list");
            return res.status(400).json({ msg: error.message });
        }

        if (contact.requests.length !== 0) {
            contact.requests.forEach((request) => {
                if (request.to.toString() === contactId.toString()) {
                    doubleRequest = true;
                    return;
                }
            });
        }

        if (doubleRequest) {
            const error = new Error(
                "You have already sent a request to this contact"
            );
            return res.status(400).json({ msg: error.message });
        }

        if (user.requests.length !== 0) {
            user.requests.forEach((request) => {
                if (request.from.toString() === contactId.toString()) {
                    alreadySent = true;
                    return;
                }
            });
        }

        if (alreadySent) {
            const error = new Error(
                "You already have a request from this friend"
            );
            return res.status(400).json({ msg: error.message });
        }

        const requestObj = {
            from: user._id,
            to: contact._id
        };

        const contactUpdated = await Users.findOneAndUpdate(
            { email: contact.email },
            { $push: { requests: requestObj } },
            { new: true }
        );

        let requestsUsername = [];

        const requestsArray = contactUpdated.requests;

        for (let i = 0; i < requestsArray.length; i++) {
            const user = await Users.findById(requestsArray[i].from);
            const contact = await Users.findById(requestsArray[i].to);

            let requestObj = {
                from: user.username,
                to: contact.username
            };

            requestsUsername.push(requestObj);
        }

        contactUpdated.requests = requestsUsername;

        return res.status(200).json(contactUpdated);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const passIDtoUsername = async (req, res) => {
    const idsArray = req.query.ids.split(",");
    const usernameArray = [];

    try {
        for (let i = 0; i < idsArray.length; i++) {
            const user = await Users.findById(idsArray[i]);
            usernameArray.push(user.username);
        }

        res.json({ usernames: usernameArray });
    } catch (error) {
        return res.json(error);
    }
};

const acceptContact = async (req, res) => {
    const userSend = req.body.user;
    const userReceive = req.body.contact;

    try {
        const user = await Users.findOne({ username: userSend.username });
        const contact = await Users.findOne({ username: userReceive.username }); //The one who receives the contact request

        if (!user || !contact) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        if (user.contacts.includes(contact._id)) {
            const error = new Error("Already friends");
            return res.status(404).json({ msg: error.message });
        }

        const userWithRequest = await Users.find({
            requests: {
                $elemMatch: {
                    from: user._id
                }
            }
        });

        if (
            userWithRequest.length === 0 ||
            !userWithRequest[0]._id.equals(contact._id)
        ) {
            const error = new Error("Action not allowed");
            return res.status(400).json({ msg: error.message });
        }

        const requestObj = {
            from: user._id,
            to: contact._id
        };

        const userID = user._id;
        const contactID = contact._id;

        const userUpdated = await Users.findOneAndUpdate(
            { username: user.username },
            { $push: { contacts: contactID } },
            { new: true }
        );

        const contactUpdated = await Users.findOneAndUpdate(
            { username: contact.username },
            { $push: { contacts: userID }, $pull: { requests: requestObj } },
            { new: true }
        );

        let contactsUsernameUser = [];
        let contactsUsernameContact = [];

        const contactsArrayUser = userUpdated.contacts;
        const contactsArrayContact = contactUpdated.contacts;

        for (let i = 0; i < contactsArrayUser.length; i++) {
            const user = await Users.findById(contactsArrayUser[i]);
            contactsUsernameUser.push(user.username);
        }

        userUpdated.contacts = contactsUsernameUser;

        for (let i = 0; i < contactsArrayContact.length; i++) {
            const user = await Users.findById(contactsArrayContact[i]);
            contactsUsernameContact.push(user.username);
        }

        contactUpdated.contacts = contactsUsernameContact;

        return res.status(200).json({ userUpdated, contactUpdated });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const deleteRequest = async (req, res) => {
    const userSend = req.body.user;
    const userReceive = req.body.contact;

    try {
        const user = await Users.findOne({ username: userSend.username }); //The one who receives the contact request
        const contact = await Users.findOne({ username: userReceive.username });

        if (!user || !contact) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        const requestObj = {
            from: user._id,
            to: contact._id
        };

        const contactUpdated = await Users.findOneAndUpdate(
            { username: contact.username },
            { $pull: { requests: requestObj } },
            { new: true }
        );

        let contactsUsernameUser = [];

        const contactsArrayUser = contactUpdated.contacts;

        for (let i = 0; i < contactsArrayUser.length; i++) {
            const user = await Users.findById(contactsArrayUser[i]);
            contactsUsernameUser.push(user.username);
        }

        contactUpdated.contacts = contactsUsernameUser;

        return res.status(200).json(contactUpdated);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const addChatContact = async (req, res) => {
    const userSend = req.body.user;
    const userReceive = req.body.contact;

    try {
        const user = await Users.findOne({ username: userSend.username });
        const contact = await Users.findOne({ username: userReceive.username });

        if (!user || !contact) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        const userUsername = user.username;
        const contactUsername = contact.username;

        const userUpdated = await Users.findOneAndUpdate(
            { username: user.username },
            { $push: { chatContacts: contactUsername } },
            { new: true }
        );

        const contactUpdated = await Users.findOneAndUpdate(
            { username: contact.username },
            { $push: { chatContacts: userUsername } },
            { new: true }
        );

        return res.status(200).json({ userUpdated, contactUpdated });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const addGroup = async (req, res) => {
    const createdBy = req.body.createdBy;
    const groupId = req.body._id;
    const groupName = req.body.groupName;

    try {
        const user = await Users.findOne({ username: createdBy });

        if (!user) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        const userGroupObject = {
            chatId: groupId,
            chatName: groupName
        };

        if (!user.chatContacts.includes(groupId)) {
            await Users.findOneAndUpdate(
                { username: user.username },
                { $push: { chatContacts: groupId } },
                { new: true }
            );
        }

        const userUpdated = await Users.findOneAndUpdate(
            { username: user.username },
            { $push: { groups: userGroupObject } },
            { new: true }
        );

        return res.status(200).json({ userUpdated });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const addMemberGroup = async (req, res) => {
    const memberToAdd = req.body.object.member;
    const groupId = req.body.object.id;

    try {
        const user = await Users.findOne({ username: memberToAdd });

        if (!user) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        const userGroupObject = {
            chatId: req.body.object.id,
            chatName: req.body.object.chatName
        };

        if (!user.chatContacts.includes(groupId)) {
            await Users.findOneAndUpdate(
                { username: user.username },
                { $push: { chatContacts: groupId } },
                { new: true }
            );
        }

        const userUpdated = await Users.findOneAndUpdate(
            { username: user.username },
            { $push: { groups: userGroupObject } },
            { new: true }
        );
        return res.status(200).json(userUpdated);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const removeMemberGroup = async (req, res) => {
    const memberToRemove = req.body.object.member;
    const groupId = req.body.object.id;
    const chatName = req.body.object.chatName;

    try {
        const user = await Users.findOne({ username: memberToRemove });
        if (!user) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        if (user.chatContacts.includes(groupId)) {
            await Users.findOneAndUpdate(
                { username: user.username },
                { $pull: { chatContacts: groupId } },
                { new: true }
            );
        }

        const userGroupObject = {
            chatId: groupId,
            chatName: chatName
        };

        const userUpdated = await Users.findOneAndUpdate(
            { username: user.username },
            { $pull: { groups: userGroupObject } },
            { new: true }
        );
        return res.status(200).json(userUpdated);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const deleteContact = async (req, res) => {
    const userSend = req.body.user;
    const userReceive = req.body.contact;

    try {
        const user = await Users.findOne({ username: userSend.username }); //The one who receives the contact request
        const contact = await Users.findOne({ username: userReceive.username });

        if (!user || !contact) {
            const error = new Error("User not found");
            return res.status(404).json({ msg: error.message });
        }

        const userID = user._id;
        const contactID = contact._id;

        const userUpdated = await Users.findOneAndUpdate(
            { username: user.username },
            { $pull: { contacts: contactID } },
            { new: true }
        );

        const contactUpdated = await Users.findOneAndUpdate(
            { username: contact.username },
            { $pull: { contacts: userID } },
            { new: true }
        );

        let contactsUsernameUser = [];
        let contactsUsernameContact = [];

        const contactsArrayUser = userUpdated.contacts;
        const contactsArrayContact = contactUpdated.contacts;

        for (let i = 0; i < contactsArrayUser.length; i++) {
            const user = await Users.findById(contactsArrayUser[i]);
            contactsUsernameUser.push(user.username);
        }

        userUpdated.contacts = contactsUsernameUser;

        for (let i = 0; i < contactsArrayContact.length; i++) {
            const user = await Users.findById(contactsArrayContact[i]);
            contactsUsernameContact.push(user.username);
        }

        contactUpdated.contacts = contactsUsernameContact;

        return res.status(200).json({ userUpdated, contactUpdated });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const chatRoom = async (req, res) => {
    const { _id, createdBy, member } = req.body.chatObject;
    try {
        const user = await Users.findOne({ username: createdBy }); //The one who creates the room
        const contact = await Users.findOne({ username: member });

        if (!user.chatContacts.includes(_id)) {
            await Users.findOneAndUpdate(
                { username: user.username },
                { $push: { chatContacts: _id } },
                { new: true }
            );
        }

        if (!contact.chatContacts.includes(_id)) {
            await Users.findOneAndUpdate(
                { username: contact.username },
                { $push: { chatContacts: _id } },
                { new: true }
            );
        }
        return res.status(200).json({ user, contact });
    } catch (error) {
        return res.status(502).json({ error: "error" });
    }
};

const checkChatUser = async (req, res) => {
    try {
        let usersObject = await Users.find({
            chatContacts: req.query.chatIdentifier
        });
        let users = usersObject.map((user) => {
            return user.username;
        });

        return res.status(200).json(users);
    } catch (error) {
        return res.status(502).json({ error: "error" });
    }
};

export {
    searchContact,
    userProfile,
    addContact,
    passIDtoUsername,
    deleteRequest,
    requestsContact,
    acceptContact,
    createUser,
    addChatContact,
    addGroup,
    addMemberGroup,
    removeMemberGroup,
    contactData,
    deleteContact,
    chatRoom,
    checkChatUser
};
