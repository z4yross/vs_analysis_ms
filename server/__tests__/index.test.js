import app from "../app"
import supertest from "supertest";

const request = supertest(app)

describe("/ endpoint", () => {
    it("should return a 200 status with hi text", async () => {
        const response = await request.get("/")
        expect(response.status).toBe(200)
        expect(response.text).toBe("hi");
    })
})