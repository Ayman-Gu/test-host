// Check if user is logged in
const loginContainer = document.getElementById('login-container');
const crudContainer = document.getElementById('crud-container');
const userList = document.getElementById('user-list');
let editingUserId = null;

// Dummy admin credentials
const admin = { username: 'zwict', password: 'zwict' };

// Event Listeners
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('user-form').addEventListener('submit', handleUserForm);
document.getElementById('logout-btn').addEventListener('click', handleLogout);

// Display logged-in or login form
if (localStorage.getItem('loggedIn')) {
    showCrud();
} else {
    showLogin();
}

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username === admin.username && password === admin.password) {
        localStorage.setItem('loggedIn', 'true');
        showCrud();
    } else {
        document.getElementById('login-message').textContent = 'Invalid credentials!';
    }
}

// Logout handler
function handleLogout() {
    localStorage.removeItem('loggedIn');
    showLogin();
}

// Show CRUD UI
function showCrud() {
    loginContainer.classList.add('hidden');
    crudContainer.classList.remove('hidden');
    renderUsers();
}

// Show login UI
function showLogin() {
    loginContainer.classList.remove('hidden');
    crudContainer.classList.add('hidden');
}

// Handle user form (Add/Update)
function handleUserForm(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users') || '[]');

    if (editingUserId !== null) {
        users = users.map(user =>
            user.id === editingUserId ? { id: editingUserId, username, password } : user
        );
        editingUserId = null;
    } else {
        const newUser = { id: Date.now(), username, password };
        users.push(newUser);
    }

    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('user-form').reset();
    renderUsers();
}

// Render users list
function renderUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    userList.innerHTML = users
        .map(
            user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        </tr>
    `
        )
        .join('');
}

// Edit user
function editUser(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.id === id);
    if (user) {
        document.getElementById('username').value = user.username;
        document.getElementById('password').value = user.password;
        editingUserId = id;
    }
}

// Delete user
function deleteUser(id) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
}
