// TURN Server Manager for Global Connectivity
window.getTurnServers = function() {
    return [
        // Local TURN server (if running)
        {
            urls: 'turn:127.0.0.1:3478',
            username: 'sufian',
            credential: 'sufian123'
        },

        // Twilio TURN servers (High Priority - Working)
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

    console.log('🔍 Testing TURN servers... Total servers:', servers.length);

    for (const server of servers) {
        try {
            console.log('🧪 Testing TURN server:', server.urls);

            const pc = new RTCPeerConnection({ iceServers: [server] });

            // Add event listeners for detailed logging
            pc.onicegatheringstatechange = () => {
                console.log(`📡 ${server.urls} - ICE gathering state:`, pc.iceGatheringState);
            };

            pc.oniceconnectionstatechange = () => {
                console.log(`🔗 ${server.urls} - ICE connection state:`, pc.iceConnectionState);
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const candidate = event.candidate.candidate;
                    if (candidate.includes('relay')) {
                        console.log(`✅ ${server.urls} - TURN relay candidate found:`, candidate);
                    } else if (candidate.includes('srflx')) {
                        console.log(`📡 ${server.urls} - STUN candidate found:`, candidate);
                    } else {
                        console.log(`🏠 ${server.urls} - Local candidate:`, candidate);
                    }
                }
            };

            // Create a test connection
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            console.log(`📤 ${server.urls} - Offer created and set`);

            // Wait for ICE gathering
            await new Promise((resolve) => {
                pc.onicegatheringstatechange = () => {
                    if (pc.iceGatheringState === 'complete') {
                        console.log(`✅ ${server.urls} - ICE gathering completed`);
                        resolve();
                    }
                };
                setTimeout(() => {
                    console.log(`⏰ ${server.urls} - Timeout after 3 seconds`);
                    resolve();
                }, 3000);
            });

            // Check if we got relay candidates
            const stats = await pc.getStats();
            let hasRelayCandidate = false;
            stats.forEach((report) => {
                if (report.type === 'candidate-pair' && report.remoteCandidateId) {
                    const remoteCandidate = stats.get(report.remoteCandidateId);
                    if (remoteCandidate && remoteCandidate.candidateType === 'relay') {
                        hasRelayCandidate = true;
                    }
                }
            });

            if (hasRelayCandidate) {
                console.log(`🎯 ${server.urls} - TURN relay working!`);
                workingServers.push(server);
            } else {
                console.log(`❌ ${server.urls} - No TURN relay candidates found`);
            }

            pc.close();
        } catch (error) {
            console.error(`💥 ${server.urls} - TURN server test failed:`, error.message);
        }
    }

    console.log('✅ TURN server testing completed. Working servers:', workingServers.length);
    return workingServers;
};