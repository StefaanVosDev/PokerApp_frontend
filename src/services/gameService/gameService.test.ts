import {expect, test} from "vitest";
import {getStatusColor} from "./gameService.ts";

test("getStatusColor", () => {
    expect(getStatusColor("IN_PROGRESS")).toBe("green")
    expect(getStatusColor("FINISHED")).toBe("gray")
    expect(getStatusColor("WAITING")).toBe("yellow")
    expect(getStatusColor("DONKEY_CONGA")).toBe("white")
})