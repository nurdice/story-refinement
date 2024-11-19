// Add at the start of the file
const DEBUG = true;

function debugLog(message, data) {
    if (DEBUG) {
        console.log(message, data || '');
    }
}

// Session state
const SESSIONS_KEY = 'planning_poker_sessions';
let sessionState = null;
let pollInterval = null;

// Initialize session
function initializeSession() {
    try {
        // Get session ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');
        
        if (!sessionId) {
            throw new Error('No session ID provided');
        }

        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        // Load session
        loadSession(sessionId);
        
        // Start polling for updates
        startPolling(sessionId);
    } catch (error) {
        console.error('Error initializing session:', error);
        alert('Error: ' + error.message);
        window.location.href = 'session.html';
    }
}

function loadSession(sessionId) {
    const sessionData = localStorage.getItem(`session_${sessionId}`);
    if (!sessionData) {
        throw new Error('Session not found');
    }

    sessionState = JSON.parse(sessionData);
    updateUI();
}

function updateUI() {
    if (!sessionState) return;

    // Update session info
    document.getElementById('sessionName').textContent = sessionState.name;
    document.getElementById('sessionId').textContent = sessionState.id;

    // Update creator controls
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isCreator = currentUser.email === sessionState.creator;
    
    const creatorControls = document.getElementById('creatorControls');
    if (creatorControls) {
        creatorControls.style.display = isCreator ? 'flex' : 'none';
    }

    // Update lists
    updateParticipantsList();
    updateStoriesList();
}

function addStory() {
    const storyName = document.getElementById('storyName').value.trim();
    if (!storyName) {
        alert('Please enter a story name');
        return;
    }

    const story = {
        id: Date.now().toString(),
        name: storyName,
        isActive: false,
        estimate: null
    };

    sessionState.stories.push(story);
    saveSession();
    document.getElementById('storyName').value = '';
    updateUI();
}

function saveSession() {
    localStorage.setItem(`session_${sessionState.id}`, JSON.stringify(sessionState));
}

function startPolling(sessionId) {
    pollInterval = setInterval(() => {
        const sessionData = localStorage.getItem(`session_${sessionId}`);
        if (sessionData) {
            const updatedSession = JSON.parse(sessionData);
            if (JSON.stringify(updatedSession) !== JSON.stringify(sessionState)) {
                sessionState = updatedSession;
                updateUI();
            }
        }
    }, 1000);
}

function updateParticipantsList() {
    const list = document.getElementById('participantsList');
    const count = document.getElementById('participantsCount');
    
    count.textContent = sessionState.participants.length;
    
    list.innerHTML = sessionState.participants.map(participant => `
        <div class="participant ${participant.isCreator ? 'creator' : ''}"
             data-email="${participant.email}">
            <div class="participant-name">
                ${participant.name} 
                ${participant.isCreator ? ' (Creator)' : ''}
                ${participant.isGuest ? ' (Guest)' : ''}
            </div>
        </div>
    `).join('');
}

function updateStoriesList() {
    const list = document.getElementById('storiesList');
    
    if (!sessionState.stories.length) {
        list.innerHTML = '<div class="no-stories">No stories added yet.</div>';
        return;
    }

    list.innerHTML = sessionState.stories.map(story => `
        <div class="story ${story.isActive ? 'active' : ''} ${story.estimate ? 'estimated' : ''}"
             onclick="selectStory('${story.id}')">
            <div class="story-name">${story.name}</div>
            ${story.estimate ? `<div class="story-estimate">Estimate: ${story.estimate}</div>` : ''}
        </div>
    `).join('');
}

// Cleanup
window.onbeforeunload = function() {
    if (pollInterval) {
        clearInterval(pollInterval);
    }
};

// Initialize when page loads
window.onload = initializeSession;
  