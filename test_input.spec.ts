import { previousButtonState, gamepadAxes } from "./src/ts/input";
import { StorageManager } from "./src/ts/storage";
import { Util } from "./src/ts/util";

// Mocking dependencies
jest.mock('./src/ts/storage', () => ({
    StorageManager: {
        data: {
            settings: {
                gamepadAxisMapping: ['marbleX', 'marbleY', 'cameraX', 'cameraY']
            }
        }
    }
}));

describe("Input Handling", () => {
    let mockGamepads: any[];

    beforeEach(() => {
        mockGamepads = [{
            index: 0,
            id: 'Mock Apple Gamepad',
            buttons: [],
            axes: [0, 0, 0, 0, 0, 0] // Simulate > 4 axes, common on Safari M1/M2 Bluetooth stacks
        }];

        // Assign mock gamepads
        Object.defineProperty(navigator, 'getGamepads', {
            value: jest.fn().mockReturnValue(mockGamepads),
            configurable: true
        });
        Object.defineProperty(navigator, 'webkitGetGamepads', {
            value: jest.fn().mockReturnValue(mockGamepads),
            configurable: true
        });

        jest.clearAllMocks();
    });

    it("should handle safari gamepad API explicit events", () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Trigger a fake gamepadconnected event
        const event = new Event('gamepadconnected') as any;
        event.gamepad = mockGamepads[0];
        window.dispatchEvent(event);

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("Gamepad connected at index"),
            expect.anything(), expect.any(String), expect.any(Number), expect.any(Number)
        );
        consoleSpy.mockRestore();
    });
});
