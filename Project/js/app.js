// Your Firebase project configuration - REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDU4SACKBE72URT5ToHOKdO2hKaezwPJ2M",
  authDomain: "studentteacherappoint.firebaseapp.com",
  projectId: "studentteacherappoint",
  storageBucket: "studentteacherappoint.firebasestorage.app",
  messagingSenderId: "13554961450",
  appId: "1:13554961450:web:877d245401bbde4142c753",
  measurementId: "G-NJHX4GYBFB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore(); // Our Firestore database

console.log("Firebase initialized successfully!");
console.log("Auth object:", auth);
console.log("Firestore DB object:", db);

// --- UI Element References (from index.html) ---
const authSection = document.getElementById('auth-section'); // The section for login/register forms
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

const registerForm = document.getElementById('registerForm');
const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerRole = document.getElementById('registerRole');
const registerSubject = document.getElementById('registerSubject'); // Reference to subject input

const showRegisterFormBtn = document.getElementById('showRegisterForm');
const showLoginFormBtn = document.getElementById('showLoginForm');

const appContent = document.getElementById('app-content'); // The section for logged-in user content
const logoutBtn = document.getElementById('logoutBtn'); // Logout button
const userNameSpan = document.getElementById('userName'); // Span to display user name
const userRoleSpan = document.getElementById('userRole'); // Span to display user role
const approvalStatusP = document.getElementById('approvalStatus'); // Paragraph for approval status

// Dashboard specific divs (initially hidden in HTML)
const studentDashboard = document.getElementById('studentDashboard');
const teacherDashboard = document.getElementById('teacherDashboard');
const adminDashboard = document.getElementById('adminDashboard');

// Teacher listing elements for student dashboard
const teacherListDiv = document.getElementById('teacherList');
const noTeachersMessage = document.getElementById('noTeachersMessage');

// Student Appointments list elements
const studentAppointmentsListDiv = document.getElementById('studentAppointmentsList');
const noStudentAppointmentsMessage = document.getElementById('noStudentAppointmentsMessage');
const studentFilterStatusSelect = document.getElementById('studentFilterStatus');
const studentSortBySelect = document.getElementById('studentSortBy');


// Teacher Appointments list elements
const teacherAppointmentsListDiv = document.getElementById('teacherAppointmentsList');
const noTeacherAppointmentsMessage = document.getElementById('noTeacherAppointmentsMessage');
const teacherFilterStatusSelect = document.getElementById('teacherFilterStatus');
const teacherSortBySelect = document.getElementById('teacherSortBy');

// Admin Dashboard elements
const pendingStudentsListDiv = document.getElementById('pendingStudentsList');
const noPendingStudentsMessage = document.getElementById('noPendingStudentsMessage');
const allUsersListDiv = document.getElementById('allUsersList');
const noUsersMessage = document.getElementById('noUsersMessage');

// Admin 'Add Teacher' elements
const addTeacherBtn = document.getElementById('addTeacherBtn');
const addTeacherModal = document.getElementById('addTeacherModal');
const closeAddTeacherModalBtn = document.getElementById('closeAddTeacherModal');
const addTeacherForm = document.getElementById('addTeacherForm');
const addTeacherName = document.getElementById('addTeacherName');
const addTeacherEmail = document.getElementById('addTeacherEmail');
const addTeacherPassword = document.getElementById('addTeacherPassword');
const addTeacherSubject = document.getElementById('addTeacherSubject');


// Appointment Booking Modal elements
const bookingModal = document.getElementById('bookingModal');
const closeBookingModalBtn = document.getElementById('closeBookingModal');
const modalActionTitle = document.getElementById('modalActionTitle');
const modalTeacherNameSpan = document.getElementById('modalTeacherName');
const appointmentTeacherIdInput = document.getElementById('appointmentTeacherId');
const appointmentTeacherNameInput = document.getElementById('appointmentTeacherName');
const appointmentIdToRescheduleInput = document.getElementById('appointmentIdToReschedule');
const appointmentDateInput = document.getElementById('appointmentDate');
const appointmentTimeInput = document.getElementById('appointmentTime');
const appointmentMessageInput = document.getElementById('appointmentMessage');
const appointmentForm = document.getElementById('appointmentForm');
const appointmentSubmitBtn = document.getElementById('appointmentSubmitBtn');


// Custom Message Box elements
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');

// Custom Confirmation Modal elements
const confirmModal = document.getElementById('confirm-modal');
const confirmMessage = document.getElementById('confirm-message');
const confirmYesBtn = document.getElementById('confirm-yes-btn');
const confirmNoBtn = document.getElementById('confirm-no-btn');
let confirmResolver; // To store the promise resolver for the confirmation modal

// Edit User Modal Elements
const editUserModal = document.getElementById('editUserModal');
const closeEditUserModalBtn = document.getElementById('closeEditUserModal');
const editUserNameDisplay = document.getElementById('editUserNameDisplay');
const editUserForm = document.getElementById('editUserForm');
const editUserIdInput = document.getElementById('editUserId');
const editNameInput = document.getElementById('editName');
const editEmailInput = document.getElementById('editEmail');
const editRoleSelect = document.getElementById('editRole');
const editSubjectLabel = document.getElementById('editSubjectLabel');
const editSubjectInput = document.getElementById('editSubject');
const editIsApprovedCheckbox = document.getElementById('editIsApproved');


// --- Custom Message and Confirmation Functions ---
/**
 * Displays a custom message box to the user.
 * @param {string} message The message to display.
 * @param {'success'|'error'|'info'} type The type of message (success, error, or info).
 */
function showMessage(message, type = 'success') {
    messageText.textContent = message;
    messageBox.className = 'message-box show'; // Reset classes and show
    messageBox.classList.remove('error', 'success', 'info'); // Remove previous types
    messageBox.classList.add(type); // Add current type

    // Hide the message after 3 seconds
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}

/**
 * Displays a custom confirmation modal and returns a Promise that resolves to true (Yes) or false (No).
 * @param {string} message The confirmation message to display.
 * @returns {Promise<boolean>} A promise that resolves to true if 'Yes' is clicked, false otherwise.
 */
function showConfirm(message) {
    confirmMessage.textContent = message;
    confirmModal.style.display = 'flex'; // Show the modal

    return new Promise(resolve => {
        confirmResolver = resolve; // Store the resolve function

        confirmYesBtn.onclick = () => {
            confirmModal.style.display = 'none';
            resolve(true);
        };

        confirmNoBtn.onclick = () => {
            confirmModal.style.display = 'none';
            resolve(false);
        };

        // Also handle clicking outside the modal to dismiss (like 'No')
        confirmModal.onclick = (event) => {
            if (event.target === confirmModal) {
                confirmModal.style.display = 'none';
                resolve(false);
            }
        };
    });
}


// --- UI Toggle Logic ---
showRegisterFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
});

showLoginFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
});

// Show/hide subject field based on role selection for registration
registerRole.addEventListener('change', () => {
    if (registerRole.value === 'teacher') {
        registerSubject.style.display = 'block';
        registerSubject.setAttribute('required', 'required');
    } else {
        registerSubject.style.display = 'none';
        registerSubject.removeAttribute('required');
        registerSubject.value = '';
    }
});

// Show/hide subject field based on role selection for user edit modal
editRoleSelect.addEventListener('change', () => {
    if (editRoleSelect.value === 'teacher') {
        editSubjectLabel.style.display = 'block';
        editSubjectInput.style.display = 'block';
        editSubjectInput.setAttribute('required', 'required');
    } else {
        editSubjectLabel.style.display = 'none';
        editSubjectInput.style.display = 'none';
        editSubjectInput.value = '';
        editSubjectInput.removeAttribute('required');
    }
});


// --- Modal Control ---
closeBookingModalBtn.addEventListener('click', () => {
    bookingModal.style.display = 'none';
    appointmentForm.reset();
    appointmentIdToRescheduleInput.value = '';
    modalActionTitle.textContent = 'Book Appointment';
    appointmentSubmitBtn.textContent = 'Request Appointment';
});

closeEditUserModalBtn.addEventListener('click', () => {
    editUserModal.style.display = 'none';
    editUserForm.reset();
    editSubjectLabel.style.display = 'none';
    editSubjectInput.style.display = 'none';
});

closeAddTeacherModalBtn.addEventListener('click', () => {
    addTeacherModal.style.display = 'none';
    addTeacherForm.reset();
});


// Close modals if user clicks outside of them
window.addEventListener('click', (event) => {
    if (event.target == bookingModal) {
        bookingModal.style.display = 'none';
        appointmentForm.reset();
        appointmentIdToRescheduleInput.value = '';
        modalActionTitle.textContent = 'Book Appointment';
        appointmentSubmitBtn.textContent = 'Request Appointment';
    }
    if (event.target == editUserModal) {
        editUserModal.style.display = 'none';
        editUserForm.reset();
        editSubjectLabel.style.display = 'none';
        editSubjectInput.style.display = 'none';
    }
    if (event.target == addTeacherModal) {
        addTeacherModal.style.display = 'none';
        addTeacherForm.reset();
    }
});


// --- Firebase Authentication Logic ---

// 1. User Registration Logic
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value.trim();
    const role = registerRole.value;
    const subject = registerSubject.value.trim();

    if (!name || !email || !password || !role) {
        showMessage("Please fill in all required fields.", 'error');
        return;
    }
    if (role === 'teacher' && !subject) {
        showMessage("Please enter a teaching subject for teacher accounts.", 'error');
        registerSubject.focus();
        return;
    }
    if (password.length < 6) {
        showMessage("Password should be at least 6 characters.", 'error');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: role,
            ...(role === 'teacher' && { subject: subject }),
            isApproved: (role === 'student' ? false : true),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showMessage(`Registration successful! ${role === 'student' ? 'Waiting for admin approval.' : ''}`, 'success');
        console.log("User registered and data saved to Firestore:", user);

        registerForm.reset();
        showLoginFormBtn.click();

    } catch (error) {
        console.error("Error during registration:", error);
        let errorMessage = "An error occurred during registration.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email is already registered.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Password should be at least 6 characters.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Please enter a valid email address.";
        }
        showMessage(`Registration failed: ${errorMessage}`, 'error');
    }
});

// 2. User Login Logic
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
        showMessage("Please enter your email and password.", 'error');
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log("User logged in:", user);

        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData.role === 'student' && !userData.isApproved) {
                await auth.signOut();
                showMessage("Your student account is awaiting admin approval. Please try again after approval.", 'error');
                console.log("Student account not approved, logged out.");
                loginForm.reset();
            } else {
                showMessage(`Welcome, ${userData.name}! You are logged in as a ${userData.role}.`, 'success');
                loginForm.reset();
            }
        } else {
            await auth.signOut();
            showMessage("User data not found in database. Please register again or contact support.", 'error');
            console.error("User document not found for UID:", user.uid);
        }

    } catch (error) {
        console.error("Error during login:", error);
        let errorMessage = "An error occurred during login.";
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = "Invalid email or password.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Please enter a valid email address.";
        }
        showMessage(`Login failed: ${errorMessage}`, 'error');
    }
});

// Function to fetch and display teachers for students
async function displayTeachersForStudent(loggedInUserId) {
    teacherListDiv.innerHTML = '<p class="info-message">Loading teachers...</p>';
    noTeachersMessage.style.display = 'none';

    try {
        const teachersSnapshot = await db.collection('users')
            .where('role', '==', 'teacher')
            .where('isApproved', '==', true)
            .get();

        let teachers = [];
        teachersSnapshot.forEach(doc => {
            const teacher = doc.data();
            if (doc.id !== loggedInUserId) {
                teachers.push({ id: doc.id, ...teacher });
            }
        });

        teachers.sort((a, b) => a.name.localeCompare(b.name));

        if (teachers.length === 0) {
            teacherListDiv.innerHTML = '';
            noTeachersMessage.style.display = 'block';
            console.log("No approved teachers found (or only the current user is a teacher).");
            return;
        }

        let teachersHtml = '';
        teachers.forEach(teacher => {
            teachersHtml += `
                <div class="teacher-card">
                    <h3>${teacher.name}</h3>
                    <p>Email: ${teacher.email}</p>
                    <p>Subject: ${teacher.subject || 'N/A'}</p>
                    <button class="book-appointment-btn" data-teacher-id="${teacher.id}" data-teacher-name="${teacher.name}">Book Appointment</button>
                </div>
            `;
        });
        teacherListDiv.innerHTML = teachersHtml;

        document.querySelectorAll('.book-appointment-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const teacherId = event.target.dataset.teacherId;
                const teacherName = event.target.dataset.teacherName;

                appointmentIdToRescheduleInput.value = '';
                modalActionTitle.textContent = 'Book Appointment';
                appointmentSubmitBtn.textContent = 'Request Appointment';

                modalTeacherNameSpan.textContent = teacherName;
                appointmentTeacherIdInput.value = teacherId;
                appointmentTeacherNameInput.value = teacherName;

                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                appointmentDateInput.min = `${year}-${month}-${day}`;
                appointmentDateInput.value = ''; // Clear previous selection
                appointmentTimeInput.value = ''; // Clear previous selection

                appointmentMessageInput.value = '';

                bookingModal.style.display = 'flex';
            });
        });

    } catch (error) {
        console.error("Error fetching teachers:", error);
        teacherListDiv.innerHTML = '<p style="color: red;" class="info-message">Failed to load teachers. Please try again later.</p>';
    }
}


// Function to cancel an appointment (for students)
async function cancelAppointment(appointmentId, studentId) {
    const confirmed = await showConfirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) {
        return;
    }

    try {
        await db.collection('appointments').doc(appointmentId).update({
            status: 'cancelled',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showMessage("Appointment cancelled successfully!", 'info');
        displayStudentAppointments(studentId, studentFilterStatusSelect.value, studentSortBySelect.value);
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        showMessage("Failed to cancel appointment. Please try again.", 'error');
    }
}

// Function to open the booking modal for rescheduling
async function openRescheduleModal(appointmentId, studentId) {
    try {
        const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
        if (!appointmentDoc.exists) {
            showMessage("Appointment not found!", 'error');
            return;
        }
        const appointmentData = appointmentDoc.data();

        appointmentIdToRescheduleInput.value = appointmentId;
        modalActionTitle.textContent = 'Reschedule Appointment';
        appointmentSubmitBtn.textContent = 'Save Changes';

        modalTeacherNameSpan.textContent = appointmentData.teacherName;
        appointmentTeacherIdInput.value = appointmentData.teacherId;
        appointmentTeacherNameInput.value = appointmentData.teacherName;
        appointmentDateInput.value = appointmentData.date;
        appointmentTimeInput.value = appointmentData.time;
        appointmentMessageInput.value = appointmentData.message || '';

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        appointmentDateInput.min = `${year}-${month}-${day}`;

        bookingModal.style.display = 'flex';

    } catch (error) {
        console.error("Error preparing reschedule modal:", error);
        showMessage("Failed to load appointment data for rescheduling.", 'error');
    }
}


// Utility function to filter and sort appointments
function filterAndSortAppointments(appointments, filterStatus, sortBy) {
    let filteredAppointments = appointments;

    // 1. Filter
    if (filterStatus !== 'all') {
        filteredAppointments = appointments.filter(app => app.status === filterStatus);
    }

    // 2. Sort
    filteredAppointments.sort((a, b) => {
        const dateA_created = a.createdAt ? a.createdAt.toDate().getTime() : new Date(0).getTime();
        const dateB_created = b.createdAt ? b.createdAt.toDate().getTime() : new Date(0).getTime();

        const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
        const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();

        if (sortBy === 'upcoming') {
            // Sort by upcoming date & time first
            // Only compare if dates are in the future or today
            const now = Date.now();
            if (dateTimeA < now && dateTimeB < now) {
                return dateB_created - dateA_created; // If both past, show newest created first
            } else if (dateTimeA < now) {
                return 1; // A is past, push to end
            } else if (dateTimeB < now) {
                return -1; // B is past, push to end
            }
            return dateTimeA - dateTimeB; // Both future/today, sort by time
        } else if (sortBy === 'creation_newest') {
            return dateB_created - dateA_created;
        } else if (sortBy === 'creation_oldest') {
            return dateA_created - dateB_created;
        }
        return 0;
    });

    return filteredAppointments;
}


// Function to fetch and display a student's booked appointments
async function displayStudentAppointments(studentId, filterStatus = 'all', sortBy = 'upcoming') {
    studentAppointmentsListDiv.innerHTML = '<p class="info-message">Loading your appointments...</p>';
    noStudentAppointmentsMessage.style.display = 'none';

    try {
        const appointmentsSnapshot = await db.collection('appointments')
            .where('studentId', '==', studentId)
            .get();

        let appointments = [];
        appointmentsSnapshot.forEach(doc => {
            appointments.push({ id: doc.id, ...doc.data() });
        });

        const processedAppointments = filterAndSortAppointments(appointments, filterStatus, sortBy);

        if (processedAppointments.length === 0) {
            studentAppointmentsListDiv.innerHTML = '';
            noStudentAppointmentsMessage.style.display = 'block';
            console.log("No appointments found for this student matching filter/sort criteria.");
            return;
        }

        let appointmentsHtml = '';
        processedAppointments.forEach(appointment => {
            let statusClass = '';
            let statusText = '';
            if (appointment.status === 'pending') {
                statusClass = 'status-pending';
                statusText = 'PENDING';
            } else if (appointment.status === 'approved') {
                statusClass = 'status-approved';
                statusText = 'APPROVED';
            } else if (appointment.status === 'rejected') {
                statusClass = 'status-rejected';
                statusText = 'REJECTED';
            } else if (appointment.status === 'cancelled') {
                statusClass = 'status-rejected';
                statusText = 'CANCELLED';
            } else if (appointment.status === 'reschedule_pending') {
                statusClass = 'status-pending';
                statusText = 'RESCHEDULE PENDING';
            }

            const appointmentId = appointment.id;

            let previousDetails = '';
            if (appointment.status === 'reschedule_pending' && appointment.originalDate && appointment.originalTime) {
                previousDetails = `<p class="text-sm italic">Previous: ${appointment.originalDate} at ${appointment.originalTime}</p>`;
            }

            appointmentsHtml += `
                <div class="appointment-card">
                    <h3>Appointment with ${appointment.teacherName}</h3>
                    <p>Date: ${appointment.date} | Time: ${appointment.time}</p>
                    ${previousDetails}
                    <p>Message: ${appointment.message || 'No message provided'}</p>
                    <p>Status: <span class="${statusClass}">${statusText.replace('_', ' ')}</span></p>
                    <div class="appointment-actions">
                        ${appointment.status === 'pending' ? `
                            <button class="cancel-btn" data-appointment-id="${appointmentId}">Cancel</button>
                        ` : ''}
                        ${appointment.status === 'approved' ? `
                            <button class="reschedule-btn" data-appointment-id="${appointmentId}" data-student-id="${studentId}">Reschedule</button>
                            <button class="cancel-btn" data-appointment-id="${appointmentId}">Cancel</button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        studentAppointmentsListDiv.innerHTML = appointmentsHtml;

        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', () => cancelAppointment(button.dataset.appointmentId, studentId));
        });
        document.querySelectorAll('.reschedule-btn').forEach(button => {
            button.addEventListener('click', () => openRescheduleModal(button.dataset.appointmentId, studentId));
        });

    } catch (error) {
        console.error("Error fetching student appointments:", error);
        studentAppointmentsListDiv.innerHTML = '<p style="color: red;" class="info-message">Failed to load appointments. Please try again later.</p>';
    }
}


// Function to update appointment status (Approve/Reject)
async function updateAppointmentStatus(appointmentId, newStatus, teacherId) {
    try {
        const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
        if (!appointmentDoc.exists) {
            showMessage("Appointment not found!", 'error');
            return;
        }
        const appointmentData = appointmentDoc.data();

        let updatePayload = {
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (newStatus === 'approved' && appointmentData.status === 'reschedule_pending') {
            updatePayload.originalDate = firebase.firestore.FieldValue.delete();
            updatePayload.originalTime = firebase.firestore.FieldValue.delete();
        }

        await db.collection('appointments').doc(appointmentId).update(updatePayload);
        showMessage(`Appointment ${newStatus} successfully!`, 'success');
        displayTeacherAppointments(teacherId, teacherFilterStatusSelect.value, teacherSortBySelect.value);
    } catch (error) {
        console.error(`Error updating appointment status to ${newStatus}:`, error);
        showMessage(`Failed to ${newStatus} appointment. Please try again.`, 'error');
    }
}


// Function to fetch and display a teacher's incoming appointments
async function displayTeacherAppointments(teacherId, filterStatus = 'all', sortBy = 'upcoming') {
    teacherAppointmentsListDiv.innerHTML = '<p class="info-message">Loading incoming appointments...</p>';
    noTeacherAppointmentsMessage.style.display = 'none';

    try {
        const appointmentsSnapshot = await db.collection('appointments')
            .where('teacherId', '==', teacherId)
            .get();

        let appointments = [];
        appointmentsSnapshot.forEach(doc => {
            appointments.push({ id: doc.id, ...doc.data() });
        });

        const processedAppointments = filterAndSortAppointments(appointments, filterStatus, sortBy);

        if (processedAppointments.length === 0) {
            teacherAppointmentsListDiv.innerHTML = '';
            noTeacherAppointmentsMessage.style.display = 'block';
            console.log("No incoming appointments for this teacher matching filter/sort criteria.");
            return;
        }

        let appointmentsHtml = '';
        processedAppointments.forEach(appointment => {
            const appointmentId = appointment.id;

            let statusClass = '';
            let statusText = '';
            let previousDetails = '';

            if (appointment.status === 'pending') {
                statusClass = 'status-pending';
                statusText = 'PENDING';
            } else if (appointment.status === 'approved') {
                statusClass = 'status-approved';
                statusText = 'APPROVED';
            } else if (appointment.status === 'rejected') {
                statusClass = 'status-rejected';
                statusText = 'REJECTED';
            } else if (appointment.status === 'cancelled') {
                statusClass = 'status-rejected';
                statusText = 'CANCELLED (Student Initiated)';
            } else if (appointment.status === 'reschedule_pending') {
                statusClass = 'status-pending';
                statusText = 'RESCHEDULE PENDING';
                previousDetails = `<p class="text-sm italic">Original: ${appointment.originalDate} at ${appointment.originalTime}</p>`;
            }

            appointmentsHtml += `
                <div class="appointment-card">
                    <h3>Appointment from ${appointment.studentName}</h3>
                    <p>Date: ${appointment.date} | Time: ${appointment.time}</p>
                    ${previousDetails}
                    <p>Message: ${appointment.message || 'No message provided'}</p>
                    <p>Status: <span class="${statusClass}">${statusText.replace('_', ' ')}</span></p>
                    ${(appointment.status === 'pending' || appointment.status === 'reschedule_pending') ? `
                        <div class="appointment-actions">
                            <button class="approve-btn" data-appointment-id="${appointmentId}">Approve</button>
                            <button class="reject-btn" data-appointment-id="${appointmentId}">Reject</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        teacherAppointmentsListDiv.innerHTML = appointmentsHtml;

        document.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', () => updateAppointmentStatus(button.dataset.appointmentId, 'approved', teacherId));
        });
        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', () => updateAppointmentStatus(button.dataset.appointmentId, 'rejected', teacherId));
        });

    } catch (error) {
        console.error("Error fetching teacher appointments:", error);
        teacherAppointmentsListDiv.innerHTML = '<p style="color: red;" class="info-message">Failed to load appointments. Please try again later.</p>';
    }
}


// --- Admin Functions ---

// Open Add Teacher Modal
addTeacherBtn.addEventListener('click', () => {
    addTeacherModal.style.display = 'flex';
});

// Add Teacher Form Submission
addTeacherForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = addTeacherName.value.trim();
    const email = addTeacherEmail.value.trim();
    const password = addTeacherPassword.value.trim();
    const subject = addTeacherSubject.value.trim();

    if (!name || !email || !password || !subject) {
        showMessage("Please fill in all teacher details.", 'error');
        return;
    }
    if (password.length < 6) {
        showMessage("Password should be at least 6 characters.", 'error');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: 'teacher',
            subject: subject,
            isApproved: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showMessage(`Teacher '${name}' added successfully!`, 'success');
        addTeacherForm.reset();
        addTeacherModal.style.display = 'none';
        displayAllUsers(auth.currentUser.uid);
        displayTeachersForStudent(auth.currentUser.uid);
    } catch (error) {
        console.error("Error adding teacher:", error);
        let errorMessage = "An error occurred while adding teacher.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email is already registered.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Password should be at least 6 characters.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Please enter a valid email address.";
        }
        showMessage(`Failed to add teacher: ${errorMessage}`, 'error');
    }
});


// Function to fetch and display pending student registrations
async function displayPendingStudents() {
    pendingStudentsListDiv.innerHTML = '<p class="info-message">Loading pending students...</p>';
    noPendingStudentsMessage.style.display = 'none';

    try {
        const pendingStudentsSnapshot = await db.collection('users')
            .where('role', '==', 'student')
            .where('isApproved', '==', false)
            .get();

        let pendingStudents = [];
        pendingStudentsSnapshot.forEach(doc => {
            pendingStudents.push({ id: doc.id, ...doc.data() });
        });

        if (pendingStudents.length === 0) {
            pendingStudentsListDiv.innerHTML = '';
            noPendingStudentsMessage.style.display = 'block';
            return;
        }

        let pendingStudentsHtml = '';
        pendingStudents.forEach(student => {
            pendingStudentsHtml += `
                <div class="user-card">
                    <h3>${student.name}</h3>
                    <p>Email: ${student.email}</p>
                    <p>Role: ${student.role}</p>
                    <p>Status: <span class="status-pending">Pending Approval</span></p>
                    <div class="appointment-actions">
                        <button class="approve-student-btn" data-student-id="${student.id}">Approve</button>
                    </div>
                </div>
            `;
        });
        pendingStudentsListDiv.innerHTML = pendingStudentsHtml;

        document.querySelectorAll('.approve-student-btn').forEach(button => {
            button.addEventListener('click', () => approveStudent(button.dataset.studentId));
        });

    } catch (error) {
        console.error("Error fetching pending students:", error);
        pendingStudentsListDiv.innerHTML = '<p style="color: red;" class="info-message">Failed to load pending students.</p>';
    }
}

// Function to approve a student registration
async function approveStudent(studentId) {
    const confirmed = await showConfirm("Are you sure you want to approve this student?");
    if (!confirmed) {
        return;
    }

    try {
        await db.collection('users').doc(studentId).update({
            isApproved: true,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showMessage("Student approved successfully!", 'success');
        displayPendingStudents();
        displayAllUsers(auth.currentUser.uid);
    } catch (error) {
        console.error("Error approving student:", error);
        showMessage("Failed to approve student. Please try again.", 'error');
    }
}

// Function to fetch and display all users (for Admin)
async function displayAllUsers(currentAdminId) {
    allUsersListDiv.innerHTML = '<p class="info-message">Loading all users...</p>';
    noUsersMessage.style.display = 'none';

    try {
        const usersSnapshot = await db.collection('users').get();
        let users = [];
        usersSnapshot.forEach(doc => {
            if (doc.id !== currentAdminId) {
                users.push({ id: doc.id, ...doc.data() });
            }
        });

        if (users.length === 0) {
            allUsersListDiv.innerHTML = '';
            noUsersMessage.style.display = 'block';
            return;
        }

        let usersHtml = '';
        users.forEach(user => {
            let statusText = user.isApproved ? 'Approved' : 'Pending';
            let statusClass = user.isApproved ? 'status-approved' : 'status-pending';

            usersHtml += `
                <div class="user-card">
                    <h3>${user.name}</h3>
                    <p>Email: ${user.email}</p>
                    <p>Role: ${user.role} ${user.role === 'teacher' ? `(${user.subject || 'N/A'})` : ''}</p>
                    <p>Status: <span class="${statusClass}">${statusText}</span></p>
                    <div class="appointment-actions">
                        <button class="edit-user-btn" data-user-id="${user.id}">Edit</button>
                        <button class="delete-user-btn" data-user-id="${user.id}">Delete</button>
                    </div>
                </div>
            `;
        });
        allUsersListDiv.innerHTML = usersHtml;

        document.querySelectorAll('.edit-user-btn').forEach(button => {
            button.addEventListener('click', () => editUser(button.dataset.userId));
        });
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', () => deleteUser(button.dataset.userId, currentAdminId));
        });

    } catch (error) {
        console.error("Error fetching all users:", error);
        allUsersListDiv.innerHTML = '<p style="color: red;" class="info-message">Failed to load all users.</p>';
    }
}

// Function to populate and show the edit user modal
async function editUser(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            showMessage("User not found!", 'error');
            return;
        }
        const userData = userDoc.data();

        editUserIdInput.value = userId;
        editUserNameDisplay.textContent = userData.name;
        editNameInput.value = userData.name;
        editEmailInput.value = userData.email;
        editRoleSelect.value = userData.role;
        editIsApprovedCheckbox.checked = userData.isApproved;

        if (userData.role === 'teacher') {
            editSubjectLabel.style.display = 'block';
            editSubjectInput.style.display = 'block';
            editSubjectInput.value = userData.subject || '';
            editSubjectInput.setAttribute('required', 'required');
        } else {
            editSubjectLabel.style.display = 'none';
            editSubjectInput.style.display = 'none';
            editSubjectInput.value = '';
            editSubjectInput.removeAttribute('required');
        }

        editUserModal.style.display = 'flex';

    } catch (error) {
        console.error("Error loading user for edit:", error);
        showMessage("Failed to load user data for editing.", 'error');
    };
}

// Handle form submission for editing user
editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = editUserIdInput.value;
    const name = editNameInput.value.trim();
    const email = editEmailInput.value.trim();
    const role = editRoleSelect.value;
    const subject = editSubjectInput.value.trim();
    const isApproved = editIsApprovedCheckbox.checked;

    if (!name || !email || !role) {
        showMessage("Please fill in all required user fields.", 'error');
        return;
    }
    if (role === 'teacher' && !subject) {
        showMessage("Please enter a teaching subject for teacher accounts.", 'error');
        editSubjectInput.focus();
        return;
    }

    try {
        await db.collection('users').doc(userId).update({
            name: name,
            email: email,
            role: role,
            ...(role === 'teacher' ? { subject: subject } : { subject: firebase.firestore.FieldValue.delete() }),
            isApproved: isApproved,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showMessage("User updated successfully!", 'success');
        editUserModal.style.display = 'none';
        editUserForm.reset();
        editSubjectLabel.style.display = 'none';
        editSubjectInput.style.display = 'none';

        displayAllUsers(auth.currentUser.uid);
        displayPendingStudents();
        displayTeachersForStudent(auth.currentUser.uid);

    } catch (error) {
        console.error("Error updating user:", error);
        showMessage("Failed to update user.", 'error');
    }
});

// Function to delete a user
async function deleteUser(userId, currentAdminId) {
    if (userId === currentAdminId) {
        showMessage("You cannot delete your own admin account!", 'error');
        return;
    }

    const confirmed = await showConfirm("Are you sure you want to delete this user? This action cannot be undone.");
    if (!confirmed) {
        return;
    }

    try {
        await db.collection('users').doc(userId).delete();

        // Consider handling associated appointments via Cloud Functions for robustness in a real app
        console.warn(`User ${userId} deleted. Associated appointments might need manual cleanup or a Cloud Function to handle.`);

        showMessage("User deleted successfully!", 'info');
        displayAllUsers(currentAdminId);
        displayPendingStudents();
        displayTeachersForStudent(currentAdminId);
    } catch (error) {
        console.error("Error deleting user:", error);
        showMessage("Failed to delete user. Please try again.", 'error');
    }
}


// --- Appointment Form Submission ---
appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const teacherId = appointmentTeacherIdInput.value;
    const teacherName = appointmentTeacherNameInput.value;
    const appointmentDate = appointmentDateInput.value;
    const appointmentTime = appointmentTimeInput.value;
    const appointmentMessage = appointmentMessageInput.value.trim();
    const appointmentId = appointmentIdToRescheduleInput.value;

    if (!appointmentDate || !appointmentTime) {
        showMessage("Please select both date and time for the appointment.", 'error');
        return;
    }

    const student = auth.currentUser;
    if (!student) {
        showMessage("You must be logged in to book/reschedule an appointment.", 'error');
        return;
    }

    const studentDoc = await db.collection('users').doc(student.uid).get();
    if (!studentDoc.exists) {
        showMessage("Your user data could not be found. Please try logging in again.", 'error');
        return;
    }
    const studentData = studentDoc.data();
    const studentName = studentData.name;
    const studentId = student.uid;

    try {
        if (appointmentId) {
            const originalAppointmentDoc = await db.collection('appointments').doc(appointmentId).get();
            const originalAppointmentData = originalAppointmentDoc.data();

            await db.collection('appointments').doc(appointmentId).update({
                date: appointmentDate,
                time: appointmentTime,
                message: appointmentMessage,
                status: 'reschedule_pending',
                originalDate: originalAppointmentData.date,
                originalTime: originalAppointmentData.time,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showMessage("Appointment reschedule request sent successfully! Waiting for teacher's re-approval.", 'success');
        } else {
            await db.collection('appointments').add({
                studentId: studentId,
                studentName: studentName,
                teacherId: teacherId,
                teacherName: teacherName,
                date: appointmentDate,
                time: appointmentTime,
                message: appointmentMessage,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showMessage("Appointment request sent successfully! Waiting for teacher's approval.", 'success');
        }

        bookingModal.style.display = 'none';
        appointmentForm.reset();
        appointmentIdToRescheduleInput.value = '';
        modalActionTitle.textContent = 'Book Appointment';
        appointmentSubmitBtn.textContent = 'Request Appointment';

        displayStudentAppointments(studentId, studentFilterStatusSelect.value, studentSortBySelect.value);

    } catch (error) {
        console.error("Error processing appointment:", error);
        showMessage("Failed to process appointment. Please try again.", 'error');
    }
});


// Store active listeners to unsubscribe on logout
let studentAppointmentsListener = null;
let teacherAppointmentsListener = null;


// 3. Authentication State Change Listener
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log("Auth state changed: User is signed in.", user.uid);
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log("User data from Firestore:", userData);

            if (userData.role === 'student' && !userData.isApproved) {
                await auth.signOut();
                authSection.style.display = 'block';
                appContent.style.display = 'none';
                approvalStatusP.textContent = "Your student account is awaiting admin approval. Please try again after approval.";
                approvalStatusP.className = 'status-pending'; // Ensure correct styling
                showMessage("Your student account is awaiting admin approval. You cannot log in yet.", 'error');
                return;
            }

            authSection.style.display = 'none';
            appContent.style.display = 'block';

            logoutBtn.style.display = 'block';

            userNameSpan.textContent = userData.name;
            userRoleSpan.textContent = userData.role;
            approvalStatusP.textContent = ''; // Clear previous messages
            approvalStatusP.className = ''; // Clear previous styling

            studentDashboard.style.display = 'none';
            teacherDashboard.style.display = 'none';
            adminDashboard.style.display = 'none';

            if (userData.role === 'student') {
                studentDashboard.style.display = 'block';
                displayTeachersForStudent(user.uid);

                displayStudentAppointments(user.uid, studentFilterStatusSelect.value, studentSortBySelect.value);

                studentFilterStatusSelect.onchange = () => displayStudentAppointments(user.uid, studentFilterStatusSelect.value, studentSortBySelect.value);
                studentSortBySelect.onchange = () => displayStudentAppointments(user.uid, studentFilterStatusSelect.value, studentSortBySelect.value);

                if (studentAppointmentsListener) {
                    studentAppointmentsListener();
                }
                studentAppointmentsListener = db.collection('appointments')
                    .where('studentId', '==', user.uid)
                    .onSnapshot((snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                            const appointment = change.doc.data();
                            const appointmentId = change.doc.id;

                            if (change.type === 'modified') {
                                if (appointment.status === 'approved') {
                                    showMessage(`Your appointment with ${appointment.teacherName} on ${appointment.date} at ${appointment.time} has been APPROVED!`, 'success');
                                } else if (appointment.status === 'rejected') {
                                    showMessage(`Your appointment with ${appointment.teacherName} on ${appointment.date} at ${appointment.time} has been REJECTED.`, 'error');
                                } else if (appointment.status === 'cancelled') {
                                    showMessage(`Your appointment with ${appointment.teacherName} on ${appointment.date} at ${appointment.time} has been CANCELLED.`, 'info');
                                } else if (appointment.status === 'reschedule_pending') {
                                    showMessage(`Your appointment with ${appointment.teacherName} is now 'Reschedule Pending' for ${appointment.date} at ${appointment.time}.`, 'info');
                                }
                                displayStudentAppointments(user.uid, studentFilterStatusSelect.value, studentSortBySelect.value);
                            } else if (change.type === 'added') {
                                showMessage(`New appointment booked with ${appointment.teacherName} on ${appointment.date} at ${appointment.time}.`, 'success');
                                displayStudentAppointments(user.uid, studentFilterStatusSelect.value, studentSortBySelect.value);
                            } else if (change.type === 'removed') {
                                showMessage(`An appointment with ${appointment.teacherName} was removed.`, 'info');
                                displayStudentAppointments(user.uid, studentFilterStatusSelect.value, studentSortBySelect.value);
                            }
                        });
                    }, (error) => {
                        console.error("Error listening to student appointments:", error);
                        showMessage("Failed to listen for appointment updates.", 'error');
                    });

            } else if (userData.role === 'teacher') {
                teacherDashboard.style.display = 'block';
                displayTeacherAppointments(user.uid, teacherFilterStatusSelect.value, teacherSortBySelect.value);

                teacherFilterStatusSelect.onchange = () => displayTeacherAppointments(user.uid, teacherFilterStatusSelect.value, teacherSortBySelect.value);
                teacherSortBySelect.onchange = () => displayTeacherAppointments(user.uid, teacherFilterStatusSelect.value, teacherSortBySelect.value);

                if (teacherAppointmentsListener) {
                    teacherAppointmentsListener();
                }
                teacherAppointmentsListener = db.collection('appointments')
                    .where('teacherId', '==', user.uid)
                    .onSnapshot((snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                            const appointment = change.doc.data();
                            if (change.type === 'added') {
                                showMessage(`New appointment request from ${appointment.studentName} for ${appointment.date} at ${appointment.time}.`, 'info');
                                displayTeacherAppointments(user.uid, teacherFilterStatusSelect.value, teacherSortBySelect.value);
                            } else if (change.type === 'modified') {
                                // Specific messages for status changes relevant to teachers
                                if (change.before.data().status === 'pending' && appointment.status === 'cancelled') {
                                    showMessage(`Appointment with ${appointment.studentName} on ${appointment.date} at ${appointment.time} has been cancelled by student.`, 'info');
                                } else if (change.before.data().status === 'approved' && appointment.status === 'reschedule_pending') {
                                     showMessage(`Reschedule request from ${appointment.studentName} for ${appointment.date} at ${appointment.time}.`, 'info');
                                }
                                displayTeacherAppointments(user.uid, teacherFilterStatusSelect.value, teacherSortBySelect.value);
                            }
                        });
                    }, (error) => {
                        console.error("Error listening to teacher appointments:", error);
                    });

            } else if (userData.role === 'admin') {
                adminDashboard.style.display = 'block';
                displayPendingStudents();
                displayAllUsers(user.uid);
            }

            console.log(`User ${userData.name} (${userData.role}) is now logged in and viewing their dashboard.`);

        } else {
            console.warn("User document not found in Firestore for UID:", user.uid);
            await auth.signOut();
            showMessage("Error: User profile data not found. Please try logging in again or contact support.", 'error');
        }
    } else {
        console.log("Auth state changed: User is signed out.");
        authSection.style.display = 'block';
        appContent.style.display = 'none';

        logoutBtn.style.display = 'none';

        userNameSpan.textContent = '';
        userRoleSpan.textContent = '';
        approvalStatusP.textContent = '';
        approvalStatusP.className = '';
        loginForm.reset();
        registerForm.reset();
        registerSubject.style.display = 'none';
        registerSubject.removeAttribute('required');
        registerRole.value = '';

        if (studentAppointmentsListener) {
            studentAppointmentsListener();
            studentAppointmentsListener = null;
            console.log("Unsubscribed from student appointments listener.");
        }
        if (teacherAppointmentsListener) {
            teacherAppointmentsListener();
            teacherAppointmentsListener = null;
            console.log("Unsubscribed from teacher appointments listener.");
        }
    }
});

// 4. User Logout Logic
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        showMessage("Logged out successfully!", 'info');
    } catch (error) {
        console.error("Error during logout:", error);
        showMessage("Failed to logout. Please try again.", 'error');
    }
});