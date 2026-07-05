import request from "supertest";
import app from "../app.js";

describe("GET /health", () => {
    it("returns degraded when the database is disconnected", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(503);
        expect(response.body).toMatchObject({
            service: "users_service",
            status: "degraded",
            database: "disconnected"
        });
        expect(response.body.uptime).toEqual(expect.any(Number));
        expect(response.body.timestamp).toEqual(expect.any(String));
    });
});
