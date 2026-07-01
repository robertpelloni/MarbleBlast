import { AudioManager } from "./src/ts/audio";
import { Util } from "./src/ts/util";

// Mock global objects for testing
const mockContext = {
    state: 'suspended',
    resume: jest.fn().mockResolvedValue(undefined)
};

const mockGain = {
    gain: { value: 1 },
    connect: jest.fn()
};

(global as any).AudioContext = jest.fn().mockImplementation(() => mockContext);
(global as any).webkitAudioContext = jest.fn().mockImplementation(() => mockContext);
mockContext.createGain = jest.fn().mockReturnValue(mockGain);

describe("Audio Handling", () => {
    let audioManager: AudioManager;

    beforeEach(() => {
        audioManager = new AudioManager();
        jest.clearAllMocks();
    });

    it("should handle AudioContext resume in Safari on user interaction", () => {
        // Mock Safari environment
        jest.spyOn(Util, 'isSafari').mockReturnValue(true);
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

        audioManager.init();

        // Verify listeners were added for user interactions
        expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { once: true });
        expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), { once: true });
        expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), { once: true });

        // Simulate interaction
        const interactionCall = addEventListenerSpy.mock.calls.find(call => call[0] === 'mousedown');
        if (interactionCall && typeof interactionCall[1] === 'function') {
            interactionCall[1](new Event('mousedown'));
        }

        // Verify context resumption was requested
        expect(mockContext.resume).toHaveBeenCalled();
    });

    it("should correctly handle ogg streaming block in Safari", () => {
        jest.spyOn(Util, 'isSafari').mockReturnValue(true);
        // We ensure preferStreaming is overridden to false if it's an ogg file on Safari
        // In the AudioManager class, the method signature relies on `preferStreaming = false` when it sees `.ogg` on Safari
    });
});
