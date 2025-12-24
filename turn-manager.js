// TURN Server Manager for Global Connectivity
window.getTurnServers = function() {
    return [
        // Twilio TURN servers (High Priority)
        {
            urls: 'turn:global.turn.twilio.com:3478?transport=udp',
            username: '99ffca8b36d76728b4837e7b3611d011e7ebd80d4640a0f7d6f19fad2ae8bbd6',
            credential: 'LKFqpqXMY8yrkqwbmKsD5LM1ts4Vd02Ie0BqAYh85M4='
        },
        {
            urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
            username: '99ffca8b36d76728b4837e7b3611d011e7ebd80d4640a0f7d6f19fad2ae8bbd6',
            credential: 'LKFqpqXMY8yrkqwbmKsD5LM1ts4Vd02Ie0BqAYh85M4='
        },
        {
            urls: 'turn:global.turn.twilio.com:443?transport=tcp',
            username: '99ffca8b36d76728b4837e7b3611d011e7ebd80d4640a0f7d6f19fad2ae8bbd6',
            credential: 'LKFqpqXMY8yrkqwbmKsD5LM1ts4Vd02Ie0BqAYh85M4='
        },
        
        // Free TURN servers
        {
            urls: 'turn:turn.bistri.com:80',
            username: 'homeo',
            credential: 'homeo'
        },
        {
            urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
            username: 'webrtc',
            credential: 'webrtc'
        },
        
        // Google STUN servers (backup)
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
    ];
};

// Test TURN server connectivity
window.testTurnServers = async function() {
    const servers = window.getTurnServers();
    const workingServers = [];
    
    for (const server of servers) {
        try {
            const pc = new RTCPeerConnection({ iceServers: [server] });
            
            // Create a test connection
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            // Wait for ICE gathering
            await new Promise((resolve) => {
                pc.onicegatheringstatechange = () => {
                    if (pc.iceGatheringState === 'complete') {
                        resolve();
                    }
                };
                setTimeout(resolve, 3000); // Timeout after 3 seconds
            });
            
            workingServers.push(server);
            pc.close();
        } catch (error) {
            console.log('TURN server test failed:', server.urls);
        }
    }
    
    return workingServers;
};