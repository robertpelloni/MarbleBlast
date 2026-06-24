/**
 * Placeholder for multiplayer latency tracking subsystem.
 * This class will eventually handle WebRTC polling constraints,
 * connection jitter, interpolation, and replay packet smoothing
 * for live Ghost Racing.
 */
export class LatencyAnalyzer {
	private pingHistory: number[] = [];

	constructor() {}

	recordPing(ms: number) {
		this.pingHistory.push(ms);
		if (this.pingHistory.length > 50) this.pingHistory.shift();
	}

	getAverageLatency() {
		if (this.pingHistory.length === 0) return 0;
		return this.pingHistory.reduce((a, b) => a + b) / this.pingHistory.length;
	}
}
