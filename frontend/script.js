const API_URL = "https://user-auth-system-lro0.onrender.com/api";
let token = localStorage.getItem("token");

if (token) showDashboard();

// Tab Switching
function switchTab(tabName, el) {
    document.querySelectorAll('.tab-view').forEach(v => v.style.display = 'none');
    document.getElementById(`view-${tabName}`).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    lucide.createIcons();
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.querySelector('.theme-btn').innerHTML = isDark ? 
        `<i data-lucide="sun"></i> Light Mode` : `<i data-lucide="moon"></i> Dark Mode`;
    lucide.createIcons();
}

// Auth Functions
// async function register() {
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const res = await fetch(`${API_URL}/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: email.split('@')[0], email, password })
//     });
//     const data = await res.json();
//     alert(data.message || "Account Created!");
// }


async function register() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // 🛑 Validation Check
    if (!email || !password) {
        alert("Please Fill Up the credentials!");
        return; // Yahan se function ruk jayega
    }

    if (password.length < 6) {
        alert("Password length must be 6 characters!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: email.split('@')[0], 
                email: email, 
                password: password 
            })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert("Registration Successful! Now Sign In.");
        } else {
            alert(data.message || "Registration fails!");
        }
    } catch (e) {
        alert("Server Connection Failed!");
    }
}
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem("token", data.token);
            token = data.token;
            document.getElementById('user-display').innerText = email.split('@')[0];
            showDashboard();
        } else { alert("Login Failed!"); }
    } catch (e) { alert("Server Down!"); }
}

function showDashboard() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'flex';
    lucide.createIcons();
    fetchTasks();
}

// Task CRUD
async function fetchTasks() {
    const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await res.json();
    document.getElementById('task-count').innerText = tasks.length;
    const list = document.getElementById('task-list');
    list.innerHTML = tasks.map(t => `
        <li>
            <span>${t.title}</span>
            <div class="task-actions">
                <button onclick="editTask('${t._id}', '${t.title}')"><i data-lucide="edit-3" class="edit-icon"></i></button>
                <button onclick="deleteTask('${t._id}')"><i data-lucide="trash-2" class="del-icon"></i></button>
            </div>
        </li>
    `).join('');
    lucide.createIcons();
}

async function createTask() {
    const title = document.getElementById('task-title').value;
    if (!title) return;
    await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title })
    });
    document.getElementById('task-title').value = '';
    fetchTasks();
}

async function editTask(id, oldTitle) {
    const newTitle = prompt("Edit Task:", oldTitle);
    if (!newTitle || newTitle === oldTitle) return;
    await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle })
    });
    fetchTasks();
}

async function deleteTask(id) {
    if (!confirm("Delete this?")) return;
    await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchTasks();
}

// function updateName() {
//     const name = document.getElementById('new-name').value;
//     if (name) {
//         document.getElementById('user-display').innerText = name;
//         alert("Display Name Updated!");
//     }
// }

function updateName() {
    const nameInput = document.getElementById('new-name');
    const newName = nameInput.value.trim();
    
    if (newName === "") {
        alert("Bhai, pehle naam toh dalo!");
        return;
    }
    
    // Update UI
    document.getElementById('user-display').innerText = newName;
    alert("Display Name updated to: " + newName + " ✅");
    
    // Clear Input
    nameInput.value = "";
}

function logout() { localStorage.removeItem("token"); location.reload(); }