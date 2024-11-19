// Simple session management
function createSession() {
    try {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Please login first');
            return;
        }

        // Generate session ID
        const sessionId = Math.random().toString(36).substring(2, 9);

        // Create session object
        const session = {
            id: sessionId,
            name: "Planning Session",
            creator: currentUser.email,
            participants: [
                {
                    name: currentUser.name,
                    email: currentUser.email,
                    isCreator: true,
                    isGuest: currentUser.isGuest
                }
            ],
            stories: []
        };

        // Store session in localStorage
        localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));
        
        // Store current session ID
        localStorage.setItem('currentSessionId', sessionId);

        // Debug log
        console.log('Session created:', session);

        // Redirect to session room
        window.location.href = `session-room.html?sessionId=${sessionId}`;
    } catch (error) {
        console.error('Error creating session:', error);
        alert('Error: ' + error.message);
    }
}

function joinSession() {
    try {
        const sessionId = document.getElementById('sessionId').value.trim();
        if (!sessionId) {
            alert('Please enter a session ID');
            return;
        }

        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Please login first');
            return;
        }

        // Get session
        const sessionData = localStorage.getItem(`session_${sessionId}`);
        if (!sessionData) {
            alert('Session not found');
            return;
        }

        // Parse session
        const session = JSON.parse(sessionData);

        // Add user to participants if not already present
        if (!session.participants.some(p => p.email === currentUser.email)) {
            session.participants.push({
                name: currentUser.name,
                email: currentUser.email,
                isCreator: false,
                isGuest: currentUser.isGuest
            });
        }

        // Save updated session
        localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));
        
        // Store current session ID
        localStorage.setItem('currentSessionId', sessionId);

        // Redirect to session room
        window.location.href = `session-room.html?sessionId=${sessionId}`;
    } catch (error) {
        console.error('Error joining session:', error);
        alert('Error: ' + error.message);
    }
}

function displaySessions() {
    const sessionsList = document.getElementById('sessionsList');
    const userSessions = sessions.filter(session => session.createdBy === currentUser.email);

    if (userSessions.length === 0) {
        sessionsList.innerHTML = '<p>No sessions created yet</p>';
        return;
    }

    sessionsList.innerHTML = userSessions.map(session => `
        <div class="session-item">
            <div class="session-info">
                <strong>${session.name}</strong>
                <div class="session-id">ID: ${session.id}</div>
                <div>Created: ${new Date(session.createdAt).toLocaleDateString()}</div>
            </div>
            <button onclick="rejoinSession('${session.id}')">Rejoin</button>
        </div>
    `).join('');
}

function rejoinSession(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
        alert(`Rejoining session: ${session.name}`);
        window.location.href = `./session-room.html?sessionId=${sessionId}`;
    }
}

function generateSessionId() {
    return Math.random().toString(36).substr(2, 9);
}

function getAllSessions() {
    try {
        return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    } catch (error) {
        console.error('Error getting sessions:', error);
        return [];
    }
}

function findSession(sessionId) {
    const sessions = getAllSessions();
    return sessions.find(s => s.id === sessionId);
}

function updateSession(updatedSession) {
    let sessions = getAllSessions();
    const index = sessions.findIndex(s => s.id === updatedSession.id);
    
    if (index !== -1) {
        sessions[index] = updatedSession;
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize page
checkAuth(); 