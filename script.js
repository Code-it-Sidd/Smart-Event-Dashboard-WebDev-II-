let events = JSON.parse(localStorage.getItem('events')) || [];
let editingId = null;
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    renderEvents();
    document.getElementById('eventForm').addEventListener('submit', handleFormSubmit);
});

function toggleForm() {
    const form = document.getElementById('eventForm');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
    if (form.style.display === 'block') {
        document.getElementById('eventTitle').focus();
        editingId = null;
        document.getElementById('eventForm').reset();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const desc = document.getElementById('eventDesc').value;

    if (editingId !== null) {
        events = events.map(event => 
            event.id === editingId 
                ? { ...event, title, date, description: desc }
                : event
        );
    } else {
        const newEvent = {
            id: Date.now(),
            title,
            date,
            description: desc,
            status: 'pending'
        };
        events.unshift(newEvent);
    }

    saveEvents();
    renderEvents();
    toggleForm();
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (event) {
        editingId = id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventDesc').value = event.description || '';
        toggleForm();
    }
}

function toggleStatus(id) {
    const event = events.find(e => e.id === id);
    if (event) {
        event.status = event.status === 'pending' ? 'completed' : 'pending';
        saveEvents();
        renderEvents();
    }
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        renderEvents();
    }
}

function filterEvents(status) {
    currentFilter = status;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderEvents(status);
}

function renderEvents(filter = currentFilter) {
    const container = document.getElementById('eventsContainer');
    
    let filteredEvents = events;
    if (filter !== 'all') {
        filteredEvents = events.filter(event => event.status === filter);
    }

    if (filteredEvents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No ${filter === 'all' ? 'events' : filter} events</h3>
                <p>${filter === 'all' ? 'Create your first event!' : 'No matching events found.'}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredEvents.map(event => `
        <div class="event-card ${event.status}">
            <div class="event-header">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${formatDate(event.date)}</div>
            </div>
            <div class="event-description">${event.description || 'No description'}</div>
            <div class="event-actions-row">
                <span class="status-badge status-${event.status}">${event.status.toUpperCase()}</span>
                <div class="event-actions">
                    <button class="btn btn-small" onclick="editEvent(${event.id})">Edit</button>
                    <button class="btn btn-small" onclick="toggleStatus(${event.id})" style="background: ${event.status === 'pending' ? '#10b981' : '#f59e0b'};">
                        ${event.status === 'pending' ? 'Complete' : 'Reopen'}
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}
