/**
 * LifeLine Medicals - Main Application Script
 * Contains Data, Auth, and UI Logic
 */

/* --- MOCK DATA --- */
const db = {
    users: [
        {
            id: 1,
            name: "Admin User",
            email: "admin@lifeline.com",
            password: "admin",
            role: "admin",
            avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0d9488&color=fff"
        },
        {
            id: 2,
            name: "John Doe",
            email: "user@lifeline.com",
            password: "user",
            role: "patient",
            avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random"
        }
    ],
    doctors: [
        {
            id: 1,
            name: "Dr. Sarah Wilson",
            specialty: "Cardiologist",
            experience: "15 Years",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
            bio: "Expert in heart rhythm disorders and preventive cardiology.",
            availability: ["Mon", "Wed", "Fri"]
        },
        {
            id: 2,
            name: "Dr. James Carter",
            specialty: "Neurologist",
            experience: "12 Years",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400",
            bio: "Specializing in stroke recovery and neurodegenerative diseases.",
            availability: ["Tue", "Thu"]
        },
        {
            id: 3,
            name: "Dr. Emily Chen",
            specialty: "Pediatrician",
            experience: "8 Years",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400",
            bio: "Compassionate care for infants, children, and adolescents.",
            availability: ["Mon", "Tue", "Wed", "Thu", "Fri"]
        },
        {
            id: 4,
            name: "Dr. Michael Ross",
            specialty: "Orthopedic Surgeon",
            experience: "20 Years",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400",
            bio: "Renowned for minimally invasive joint replacement surgeries.",
            availability: ["Wed", "Sat"]
        }
    ],
    medicines: [
        {
            id: 1,
            name: "Paracetamol 500mg",
            category: "Pain Relief",
            price: 5.00,
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300"
        },
        {
            id: 2,
            name: "Amoxicillin 250mg",
            category: "Antibiotic",
            price: 12.50,
            image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300&h=300"
        },
        {
            id: 3,
            name: "Vitamin C 1000mg",
            category: "Supplements",
            price: 8.00,
            image: "https://images.unsplash.com/photo-1550572017-ed108bc2773a?auto=format&fit=crop&q=80&w=300&h=300"
        },
        {
            id: 4,
            name: "Ibuprofen 400mg",
            category: "Pain Relief",
            price: 6.00,
            image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=300&h=300"
        }
    ],
    services: [
        {
            icon: "fa-heart-pulse",
            title: "Cardiology",
            description: "Comprehensive heart care with state-of-the-art diagnostic and treatment facilities."
        },
        {
            icon: "fa-user-doctor",
            title: "General Checkup",
            description: "Routine health screenings to keep you in the best shape possible."
        },
        {
            icon: "fa-baby",
            title: "Pediatrics",
            description: "Specialized care for your little ones in a warm and friendly environment."
        },
        {
            icon: "fa-truck-medical",
            title: "Emergency Care",
            description: "24/7 emergency services equipped to handle critical medical situations."
        }
    ]
};

/* --- AUTH MODULE --- */
const AUTH_KEY = 'lifeline_auth_user';
const APPT_KEY = 'lifeline_appointments';

const auth = {
    user: JSON.parse(localStorage.getItem(AUTH_KEY)) || null,

    login(email, password) {
        const found = db.users.find(u => u.email === email && u.password === password);
        if (found) {
            this.user = found;
            localStorage.setItem(AUTH_KEY, JSON.stringify(found));
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    register(name, email, password) {
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: 'patient',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        };
        // Mock persisting for session
        this.user = newUser;
        localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
        return { success: true };
    },

    logout() {
        this.user = null;
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'index.html';
    }
};

/* --- APP LOGIC --- */

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    routeHandler();
});

function initUI() {
    // Inject Header
    const header = document.querySelector('header');
    if (header) {
        header.classList.add('header'); // Ensure class exists
        header.innerHTML = `
            <a href="index.html" class="logo-container" style="text-decoration:none">
                <i class="fa-solid fa-heart-pulse" style="color:var(--primary)"></i>
                <span style="color: var(--primary); font-weight:800;">LIFELINE</span>
            </a>
            <nav class="nav-links">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="doctors.html">Doctors</a></li>
                    <li><a href="pharmacy.html">Pharmacy</a></li>
                    ${auth.user && auth.user.role === 'admin' ? `<li><a href="admin.html" style="color:var(--accent)">Admin</a></li>` : ''}
                </ul>
            </nav>
            <div class="user-actions">
                ${auth.user ? `
                    <div style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="window.location.href='profile.html'">
                        <img src="${auth.user.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid var(--primary-light)">
                        <span style="font-weight:600; color:var(--secondary)">${auth.user.name.split(' ')[0]}</span>
                    </div>
                ` : `
                    <a href="signup.html" class="auth-btn">Sign In</a>
                `}
            </div>
        `;

        // Active Link
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        header.querySelectorAll('nav a').forEach(a => {
            if (a.getAttribute('href') === currentPath) a.style.color = 'var(--primary)';
        });
    }

    // Inject Footer
    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = `
            <div class="footer-top">
                <div class="footer-col">
                    <div class="logo-container" style="margin-bottom:1rem; color:white;">
                        <i class="fa-solid fa-heart-pulse"></i>
                        <span>LIFELINE</span>
                    </div>
                    <p style="color:#94a3b8; font-size:0.9rem;">
                        Committed to providing world-class healthcare with compassion and excellence. Your health is our mission.
                    </p>
                </div>
                <div class="footer-col">
                    <h3>Services</h3>
                    <ul style="font-size:0.9rem;">
                        <li><a href="#">Cardiology</a></li>
                        <li><a href="#">Neurology</a></li>
                        <li><a href="#">Pediatrics</a></li>
                        <li><a href="#">Emergency</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Contact</h3>
                    <ul style="font-size:0.9rem;">
                        <li><i class="fa-solid fa-location-dot"></i> 123 Health Ave, Colombo</li>
                        <li><i class="fa-solid fa-phone"></i> +94 77 123 4567</li>
                        <li><i class="fa-solid fa-envelope"></i> care@lifeline.com</li>
                    </ul>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; ${new Date().getFullYear()} LifeLine Medicals. All rights reserved.</p>
            </div>
        `;
    }
}

function routeHandler() {
    const path = window.location.pathname.split('/').pop();

    if (path === 'doctors.html' || path === 'consultingr.html') {
        renderDoctorsGrid();
    }

    if (path === 'pharmacy.html') {
        renderPharmacyGrid();
    }

    if (path === 'profile.html') {
        if (!auth.user) window.location.href = 'signup.html';
        renderProfile();
    }

    if (path === 'admin.html') {
        if (!auth.user || auth.user.role !== 'admin') window.location.href = 'index.html';
        renderAdminDashboard();
    }

    if (path === 'index.html' || path === '') {
        renderHomeServices();
    }
}

/* --- RENDER FUNCTIONS --- */

function renderHomeServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;

    container.innerHTML = db.services.map(s => `
        <div class="card">
            <div class="card-icon">
                <i class="fa-solid ${s.icon}"></i>
            </div>
            <h3>${s.title}</h3>
            <p style="color:var(--text-light)">${s.description}</p>
        </div>
    `).join('');
}

function renderDoctorsGrid() {
    // For doctors page
    const container = document.getElementById('doctors-grid');
    if (container) {
        container.innerHTML = db.doctors.map(d => `
            <div class="doctor-card">
                <img src="${d.image}" alt="${d.name}" class="doctor-img">
                <div class="doctor-info">
                    <h3>${d.name}</h3>
                    <span class="doctor-specialty">${d.specialty}</span>
                    <p style="color:var(--text-light); font-size:0.9rem; margin-bottom:1rem;">${d.bio}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                         <span style="font-size:0.8rem; color:var(--text-light);"><i class="fa-solid fa-briefcase"></i> ${d.experience}</span>
                         <button onclick="bookAppointment(${d.id})" class="auth-btn" style="padding:0.4rem 1rem; font-size:0.8rem;">Book Now</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // For appointment selection dropdown
    const select = document.getElementById('doctor-select');
    if (select) {
        select.innerHTML = '<option value="">Select a Doctor</option>' +
            db.doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialty})</option>`).join('');
    }
}

function renderPharmacyGrid() {
    const container = document.getElementById('medicine-grid');
    if (!container) return;

    container.innerHTML = db.medicines.map(m => `
        <div class="card" style="text-align:left; padding:1.5rem;">
            <img src="${m.image}" style="width:100%; height:180px; object-fit:cover; border-radius:var(--radius-md); margin-bottom:1rem;" alt="${m.name}">
            <span style="background:var(--primary-light); color:var(--primary-dark); padding:0.2rem 0.6rem; border-radius:10px; font-size:0.75rem; font-weight:600;">${m.category}</span>
            <h3 style="margin:0.5rem 0; font-size:1.1rem;">${m.name}</h3>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
                <span style="font-size:1.2rem; font-weight:700; color:var(--secondary)">$${m.price.toFixed(2)}</span>
                <button onclick="addToCart(${m.id})" class="auth-btn" style="padding:0.4rem 1rem;"><i class="fa-solid fa-cart-plus"></i> Add</button>
            </div>
        </div>
    `).join('');
}

function renderProfile() {
    const container = document.getElementById('profile-content');
    if (!container) return;

    // Get appointments
    const appointments = JSON.parse(localStorage.getItem(APPT_KEY)) || [];
    const myAppointments = appointments.filter(a => a.userId === auth.user.id);

    container.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:2rem;">
            <div class="card">
                <img src="${auth.user.avatar}" style="width:120px; height:120px; border-radius:50%; margin-bottom:1rem;">
                <h2>${auth.user.name}</h2>
                <p style="color:var(--text-light)">${auth.user.email}</p>
                <div style="margin-top:1rem; padding:0.5rem; background:var(--primary-light); color:var(--primary-dark); border-radius:5px; display:inline-block;">
                    ${auth.user.role.toUpperCase()}
                </div>
                <button onclick="auth.logout()" style="display:block; width:100%; margin-top:2rem; padding:0.8rem; background:var(--danger); color:white; border:none; border-radius:var(--radius-md); cursor:pointer;">Sign Out</button>
            </div>
            
            <div>
                <h2 style="margin-bottom:1.5rem; color:var(--secondary)">My Appointments</h2>
                ${myAppointments.length > 0 ? `
                    <div style="display:grid; gap:1rem;">
                        ${myAppointments.map(a => `
                            <div style="background:white; padding:1.5rem; border-radius:var(--radius-md); border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <h4 style="color:var(--secondary); margin-bottom:0.25rem;">${a.doctorName}</h4>
                                    <p style="color:var(--text-light); font-size:0.9rem;">${a.date} at ${a.time}</p>
                                </div>
                                <span style="padding:0.3rem 0.8rem; border-radius:20px; font-size:0.8rem; font-weight:600; background:${a.status === 'Confirmed' ? '#dcfce7' : '#fee2e2'}; color:${a.status === 'Confirmed' ? '#166534' : '#991b1b'}">
                                    ${a.status}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div style="text-align:center; padding:3rem; background:white; border-radius:var(--radius-lg);">
                        <i class="fa-solid fa-calendar-xmark" style="font-size:3rem; color:#cbd5e1; margin-bottom:1rem;"></i>
                        <p>No appointments scheduled.</p>
                        <a href="consultingr.html" style="color:var(--primary); font-weight:600; margin-top:1rem; display:inline-block;">Book an Appointment &rarr;</a>
                    </div>
                `}
            </div>
        </div>
    `;
}

function renderAdminDashboard() {
    const container = document.getElementById('admin-content');
    if (!container) return;

    const appointments = JSON.parse(localStorage.getItem(APPT_KEY)) || [];

    container.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem; margin-bottom:3rem;">
            <div class="card" style="padding:1.5rem;">
                <h3 style="font-size:2.5rem; color:var(--primary); margin-bottom:0.5rem;">${db.doctors.length}</h3>
                <p>Total Doctors</p>
            </div>
            <div class="card" style="padding:1.5rem;">
                <h3 style="font-size:2.5rem; color:var(--accent); margin-bottom:0.5rem;">${db.users.length}</h3>
                <p>Registered Users</p>
            </div>
            <div class="card" style="padding:1.5rem;">
                <h3 style="font-size:2.5rem; color:var(--secondary); margin-bottom:0.5rem;">${appointments.length}</h3>
                <p>Total Appointments</p>
            </div>
        </div>

        <h2 style="margin-bottom:1.5rem;">Recent Appointments</h2>
        <div style="background:white; border-radius:var(--radius-lg); overflow:hidden; border:1px solid #e2e8f0;">
            <table style="width:100%; border-collapse:collapse;">
                <thead style="background:var(--bg-light); text-align:left;">
                    <tr>
                        <th style="padding:1rem;">Patient</th>
                        <th style="padding:1rem;">Doctor</th>
                        <th style="padding:1rem;">Date/Time</th>
                        <th style="padding:1rem;">Status</th>
                        <th style="padding:1rem;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.map(a => `
                        <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:1rem;">${a.patientName}</td>
                            <td style="padding:1rem;">${a.doctorName}</td>
                            <td style="padding:1rem;">${a.date} <br><small style="color:var(--text-light)">${a.time}</small></td>
                            <td style="padding:1rem;">
                                <span style="font-size:0.85rem; padding:0.2rem 0.6rem; border-radius:4px; background:${a.status === 'Confirmed' ? '#dcfce7' : '#fee2e2'}; color:${a.status === 'Confirmed' ? '#166534' : '#991b1b'}">
                                    ${a.status}
                                </span>
                            </td>
                            <td style="padding:1rem;">
                                <button onclick="deleteAppointment(${a.id})" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                    ${appointments.length === 0 ? '<tr><td colspan="5" style="padding:2rem; text-align:center;">No appointments found</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
}

/* --- ACTIONS --- */

window.handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const result = auth.login(email, password);

    if (result.success) {
        window.location.href = auth.user.role === 'admin' ? 'admin.html' : 'profile.html';
    } else {
        alert(result.message);
    }
};

window.handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    auth.register(name, email, password);
    window.location.href = 'profile.html';
};

window.bookAppointment = (docId) => {
    if (!auth.user) {
        alert('Please sign in to book an appointment');
        window.location.href = 'signup.html';
        return;
    }
    // Simple redirect or modal. For now, redirect to consulting page with pre-fill query
    window.location.href = `consultingr.html?doctor=${docId}`;
};

window.submitAppointment = (e) => {
    e.preventDefault();
    if (!auth.user) {
        window.location.href = 'signup.html';
        return;
    }

    const docId = parseInt(e.target.doctor.value);
    const date = e.target.date.value;
    const time = e.target.time.value;

    const doctor = db.doctors.find(d => d.id === docId);

    const newAppt = {
        id: Date.now(),
        userId: auth.user.id,
        patientName: auth.user.name,
        doctorName: doctor ? doctor.name : 'Unknown Doctor',
        date,
        time,
        status: 'Confirmed'
    };

    const appointments = JSON.parse(localStorage.getItem(APPT_KEY)) || [];
    appointments.push(newAppt);
    localStorage.setItem(APPT_KEY, JSON.stringify(appointments));

    alert('Appointment Booked Successfully!');
    window.location.href = 'profile.html';
};

window.addToCart = (id) => {
    alert('Item added to cart! (Checkout feature coming soon)');
};

window.deleteAppointment = (id) => {
    if (!confirm('Are you sure?')) return;
    let appointments = JSON.parse(localStorage.getItem(APPT_KEY)) || [];
    appointments = appointments.filter(a => a.id !== id);
    localStorage.setItem(APPT_KEY, JSON.stringify(appointments));
    renderAdminDashboard();
};

window.auth = auth; // Expose auth for UI calls
