import mongoose from "mongoose";

const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
};

const getDbStatus = () => {
    const state = mongoose.connection.readyState;

    return {
        state,
        label: dbStates[state] || "unknown",
        isConnected: state === 1
    };
};

export default getDbStatus;
