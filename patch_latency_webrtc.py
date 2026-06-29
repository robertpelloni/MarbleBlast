import re

file_path = "src/ts/multiplayer_latency.ts"

with open(file_path, "r") as f:
    content = f.read()

target = """	recordPing(ms: number) {"""
replacement = """	/**
	 * Tracks WebRTC peer-to-peer data channel latency, which can differ from
	 * server API latency. When a ghost racing match begins, we ping the peer
	 * via the DataChannel to build a highly accurate interpolation baseline.
	 */
	simulatePeerPing(peerId: string) {
		// Stub: when RTCDataChannel sends 'PING', measure RTT and feed back here
		// For now we simulate an idealized 40ms P2P connection to verify the smoothing math
		this.recordPing(40 + (Math.random() * 20 - 10));
	}

	recordPing(ms: number) {"""

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Patched src/ts/multiplayer_latency.ts for WebRTC P2P integration stub")
