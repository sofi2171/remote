// Signaling Client for WebSocket Management
window.signalingClient = {
    servers: [],
    
    init: function() {
        this.setupServers();
    },
    
    setupServers: function() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.servers = ['ws://localhost:8080'];
        } else {
            this.servers = [
                'wss://your-websocket-server.onrender.com',
                'wss://your-websocket-server.up.railway.app'
            ];
        }
    },
    
    getServers: function() {
        return this.servers;
    },
    
    testConnection: async function(serverUrl) {
        return new Promise((resolve) => {
            try {
                const ws = new WebSocket(serverUrl);
                
                const timeout = setTimeout(() => {
                    ws.close();
                    resolve(false);
                }, 5000);
                
                ws.onopen = () => {
                    clearTimeout(timeout);
                    ws.close();
                    resolve(true);
                };
                
                ws.onerror = () => {
                    clearTimeout(timeout);
                    resolve(false);
                };
                
            } catch (error) {
                resolve(false);
            }
        });
    },
    
    findWorkingServer: async function() {
        for (const server of this.servers) {
            const isWorking = await this.testConnection(server);
            if (isWorking) {
                return server;
            }
        }
        return null;
    }
};