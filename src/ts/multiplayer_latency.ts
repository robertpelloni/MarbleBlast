import { ResourceManager } from "./resources";

/**
 * Handles WebRTC polling constraints, connection jitter,
 * interpolation, and replay packet smoothing for live Ghost Racing.
 */
export class LatencyAnalyzer {
	private pingHistory: number[] = [];

	/** Max latency in milliseconds to allow before we drop ghost frames or snap to position */
	private jitterThreshold: number = 150;
	private isPinging: boolean = false;

	constructor() {}

	/**
	 * Takes a ghost's predicted tick position and linearly interpolates
	 * it back to the true network position over time based on current latency.
	 */
	calculateSmoothingFactor() {
		let avg = this.getAverageLatency();
		if (avg > this.jitterThreshold) {
			// Connection is poor, snap aggressively
			return 1.0;
		}
		// Scale interpolation smoothly based on how bad the ping is
		return Math.max(0.1, avg / this.jitterThreshold);
	}

	/** Measures actual round-trip time to the server via /api/ping */
	async measurePing() {
		if (this.isPinging) return;
		this.isPinging = true;

		let start = performance.now();
		try {
			// Fast fetch with minimal overhead, don't use retryFetch to avoid masking latency
			let response = await fetch('./api/ping', { cache: 'no-store' });
			if (response.ok) {
				let end = performance.now();
				this.recordPing(end - start);
			}
		} catch (e) {
			// If ping fails, record a high latency to simulate a spike
			this.recordPing(this.jitterThreshold * 2);
		} finally {
			this.isPinging = false;
		}
	}

	recordPing(ms: number) {
		this.pingHistory.push(ms);
		if (this.pingHistory.length > 50) this.pingHistory.shift();
	}

	getAverageLatency() {
		if (this.pingHistory.length === 0) return 0;
		return this.pingHistory.reduce((a, b) => a + b) / this.pingHistory.length;
	}
}
