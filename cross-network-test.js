// Cross-Network Connection Test
function testCrossNetwork() {
    console.log('🌍 Testing cross-network connectivity...');
    
    // Test with multiple TURN servers
    const servers = [
        {
            urls: 'turn:global.turn.twilio.com:3478?transport=udp',
            username: '99ffca8b36d76728b4837e7b3611d011e7ebd80d4640a0f7d6f19fad2ae8bbd6',
            credential: 'LKFqpqXMY8yrkqwbmKsD5LM1ts4Vd02Ie0BqAYh85M4='
        }
    ];
    
    const pc = new RTCPeerConnection({ iceServers: servers });
    
    pc.onicecandidate = (e) => {
        if (e.candidate) {
            const candidate = e.candidate.candidate;
            if (candidate.includes('relay')) {
                console.log('✅ TURN relay found - Cross-network ready!');
            }
        }
    };
    
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
}

// Add to main app
window.testCrossNetwork = testCrossNetwork;