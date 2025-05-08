// Admin functionality
let appointmentsChart = null;

// Admin credentials (in a real app, this would be server-side)
const adminCredentials = {
    username: "admin",
    password: "admin123"
};

function handleAdminLogin(username, password) {
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
        });
        
        // Show admin section
        document.getElementById('admin-section').classList.add('active-section');
        
        // Close login modal
        document.getElementById('login-modal').classList.remove('active');
        
        // Update UI
        document.querySelector('nav').style.display = 'none';
        document.querySelector('.auth-buttons').innerHTML = '<button id="logout-btn">Logout</button>';
        
        // Set up logout button
        document.getElementById('logout-btn').addEventListener('click', logoutAdmin);
        
        // Initialize dashboard
        initDashboard();
    } else {
        alert('Invalid admin credentials');
    }
}

function logoutAdmin() {
    // Show all sections again
    document.querySelector('nav').style.display = 'flex';
    document.querySelector('.auth-buttons').innerHTML = `
        <button id="login-btn">Login</button>
        <button id="register-btn">Register</button>
    `;
    
    // Show home section
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById('home-section').classList.add('active-section');
    
    // Reset nav active state
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    document.getElementById('home-link').classList.add('active');
    
    // Reinitialize event listeners
    setupEventListeners();
}

function initDashboard() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dashboard-date').value = today;
    document.getElementById('selected-date-text').textContent = formatDate(today);
    
    // Load data for today
    loadDashboardData(today);
    
    // Set up date change listener
    document.getElementById('dashboard-date').addEventListener('change', function() {
        const selectedDate = this.value;
        document.getElementById('selected-date-text').textContent = formatDate(selectedDate);
        loadDashboardData(selectedDate);
    });
}

function loadDashboardData(date) {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll use sample data
    
    // Sample data for the selected date
    const sampleData = {
        total: 24,
        booked: 18,
        completed: 4,
        cancelled: 2,
        appointments: [
            { id: 'MC-2023-101', patient: 'John Doe', doctor: 'Dr. Sarah Johnson', department: 'Cardiology', time: '09:00 AM', status: 'booked' },
            { id: 'MC-2023-102', patient: 'Jane Smith', doctor: 'Dr. Michael Chen', department: 'Neurology', time: '10:30 AM', status: 'booked' },
            { id: 'MC-2023-103', patient: 'Robert Brown', doctor: 'Dr. Emily Rodriguez', department: 'General', time: '11:15 AM', status: 'completed' },
            { id: 'MC-2023-104', patient: 'Alice Johnson', doctor: 'Dr. Sarah Johnson', department: 'Cardiology', time: '02:00 PM', status: 'cancelled' }
        ],
        dailyStats: {
            labels: ['8AM', '10AM', '12PM', '2PM', '4PM'],
            booked: [5, 8, 3, 6, 2],
            completed: [1, 2, 0, 1, 0],
            cancelled: [0, 1, 0, 1, 0]
        }
    };
    
    // Update stats
    document.getElementById('total-appointments').textContent = sampleData.total;
    document.getElementById('booked-appointments').textContent = sampleData.booked;
    document.getElementById('completed-appointments').textContent = sampleData.completed;
    document.getElementById('cancelled-appointments').textContent = sampleData.cancelled;
    
    // Update appointments table
    const tableBody = document.getElementById('admin-appointments-list');
    tableBody.innerHTML = '';
    
    sampleData.appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.patient}</td>
            <td>${appointment.doctor}</td>
            <td>${appointment.department}</td>
            <td>${appointment.time}</td>
            <td><span class="appointment-status status-${appointment.status}">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span></td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update chart
    updateChart(sampleData.dailyStats);
}

function updateChart(data) {
    const ctx = document.getElementById('appointments-chart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (appointmentsChart) {
        appointmentsChart.destroy();
    }
    
    appointmentsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Booked',
                    data: data.booked,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1
                },
                {
                    label: 'Completed',
                    data: data.completed,
                    backgroundColor: '#27ae60',
                    borderColor: '#219653',
                    borderWidth: 1
                },
                {
                    label: 'Cancelled',
                    data: data.cancelled,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Appointments'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time of Day'
                    }
                }
            }
        }
    });
}

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}