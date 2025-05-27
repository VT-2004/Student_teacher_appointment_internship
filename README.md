Student-Teacher Appointment Booking System
🚀 Project Overview
The Student-Teacher Appointment Booking System is a web-based platform designed to streamline the appointment scheduling process between students and teachers. In today's fast-paced educational environment, traditional booking methods can be inefficient, leading to increased wait times and communication bottlenecks. This system aims to provide a convenient, accessible solution, allowing both students and teachers to manage appointments efficiently from anywhere, using web or mobile devices. Students can easily find available teachers, book appointments, and send messages detailing their appointment purpose. Teachers can view, approve, reject, or reschedule incoming requests, ensuring effective time management.

✨ Key Features
This system is built with modularity and user experience in mind, offering distinct functionalities for different user roles:

Admin Module
Add Teacher: Admins can easily add new teacher profiles, including name, email, password, and subject.

Update/Delete Teacher: Full control over existing teacher accounts.

Approve Student Registration: Manages pending student registrations, granting access to the system.

View All Users: Overview of all registered users (students, teachers, admins).

Teacher Module
Login: Secure access to their personalized dashboard.

View Incoming Appointments: See all appointments requested by students.

Approve/Reject Appointment: Manage appointment requests, including reschedule requests.

View Messages: Access messages sent by students regarding appointments.

View All Appointments: Comprehensive list of all their past and upcoming appointments.

Logout: Securely exit the session.

Student Module
Register: Create a new account. Student accounts require admin approval to activate.

Login: Secure access to their personalized dashboard.

Search Teacher: Browse available teachers and their subjects.

Book Appointment: Request appointments with specific teachers.

Send Message: Include a message with the appointment request to convey purpose or specific needs.

Cancel/Reschedule Appointment: Manage their booked appointments.

💻 Technologies Used
Frontend: HTML5, CSS3, JavaScript

Backend/Database: Firebase (Authentication and Firestore)

🌐 Domain
Education

📈 Project Difficulty Level
Easy

🧩 System Modules (Detailed)
Admin Dashboard
Teacher Management:

Add Teacher: Form to input teacher's name, email, password, and subject.

Update/Delete Teacher: Functionality to modify or remove teacher accounts from the system.

Student Approval:

List of pending student registrations with options to approve them.

User Management:

List of all registered users (students, teachers, admins) with basic details.

Teacher Dashboard
Appointment Management:

List of all appointments booked by students.

Actions: Approve, Reject appointments.

Specific handling for "reschedule pending" requests, allowing approval of new dates/times.

Messaging:

View messages associated with appointment requests.

Student Dashboard
Teacher Discovery:

List of all approved teachers, including their subjects.

"Book Appointment" button for each teacher.

Appointment Booking:

Modal form to select date, time, and add a message for the teacher.

Option to request a reschedule for an existing appointment.

Appointment Tracking:

List of their booked appointments with status (Pending, Approved, Rejected, Cancelled, Reschedule Pending).

Actions: Cancel, Reschedule.

🛠️ How to Run the Project Locally
To set up and run this project on your local machine, follow these steps:

1. Clone the Repository
If you haven't already, clone the project from GitHub:

git clone [https://github.com/VT-2004/Student_teacher_appointment_internship.git](https://github.com/VT-2004/Student_teacher_appointment_internship.git)
cd Student_teacher_appointment_internship

2. Set up Firebase Project
This project relies on Google Firebase for authentication and database services.

Create a Firebase Project:

Go to the Firebase Console.

Click "Add project" and follow the on-screen instructions.

Enable Authentication:

In your Firebase project, navigate to Build > Authentication.

Go to the "Sign-in method" tab and enable "Email/Password" provider.

Create a Firestore Database:

In your Firebase project, navigate to Build > Firestore Database.

Click "Create database". Choose "Start in production mode" (you'll set up rules later) and select a suitable location.

You'll need to define collections for users and appointments. Initially, you can create them programmatically by adding documents.

Get Your Firebase Configuration:

In your Firebase project settings (gear icon next to "Project overview"), click "Project settings".

Scroll down to "Your apps" and add a web app (the </> icon).

Follow the steps to register your app. You'll be provided with a firebaseConfig object.

3. Update js/app.js with Your Firebase Config
Open the js/app.js file in your project. Locate the firebaseConfig object at the top of the file and replace the placeholder values with your actual Firebase project configuration.

// Your Firebase project configuration - REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

4. Run the Application
This is a static web application. You can open index.html directly in your web browser, or use a local development server for better practice (e.g., Live Server extension in VS Code).

Option A: Open Directly

Locate the index.html file in your project folder.

Double-click it to open it in your default web browser.

Option B: Using a Local Server (Recommended for consistency and avoiding CORS issues)

If you have Node.js installed, you can use http-server:

npm install -g http-server
http-server .

Then, open your browser and go to http://localhost:8080 (or whatever port http-server indicates).

🔒 Firebase Security Rules
For a production environment, it's crucial to secure your Firestore database. Here are basic rules you can set in your Firebase console under Build > Firestore Database > Rules to control read/write access:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection rules
    match /users/{userId} {
      allow read: if request.auth != null; // Authenticated users can read any user profile
      allow write: if request.auth.uid == userId; // Only a user can write to their own profile
    }

    // Appointments collection rules
    match /appointments/{appointmentId} {
      allow read: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        resource.data.teacherId == request.auth.uid
      ); // Student can read their appointments, teacher can read their appointments

      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid; // Only students can create appointments for themselves
      allow update: if request.auth != null && (
        // Students can update their own appointments for reschedule/cancel (pending/approved state)
        (resource.data.studentId == request.auth.uid && (
            resource.data.status == 'pending' ||
            resource.data.status == 'approved'
        )) ||
        // Teachers can update status of appointments assigned to them (approve/reject)
        (resource.data.teacherId == request.auth.uid)
      );
      allow delete: if false; // No deletion from client side; admin only or via Cloud Function
    }
  }
}

Note: These rules are a starting point. For a robust production application, you would need more detailed rules, potentially using custom claims for roles and more granular access control.

📜 Coding Standards & Modularity
The project adheres to basic coding standards for readability and maintainability:

HTML: Semantic structure, clear ids and classes.

CSS: Organized into general styles, layout styles, and component-specific styles, utilizing flexbox and grid for responsive layouts. Media queries ensure adaptability across various devices.

JavaScript: Modular approach separating UI elements, authentication logic, and data manipulation functions. Event listeners are used for interactivity. Comments are used to explain complex sections.

The code is designed to be:

Safe: Input validations are implemented where necessary (e.g., password length). Firebase rules add a layer of security.

Testable: Functions are generally self-contained, making them easier to test.

Maintainable: Clear function names, consistent formatting, and separation of concerns contribute to ease of maintenance and future enhancements.

Portable: Standard web technologies (HTML, CSS, JS) and cloud-agnostic Firebase services ensure the application can run in any modern web environment.

🗄️ Database (Firebase Firestore)
Firestore is used as the NoSQL document database. Key collections:

users: Stores user profiles (name, email, role, subject (for teachers), isApproved status, createdAt).

appointments: Stores appointment details (student ID, student name, teacher ID, teacher name, date, time, message, status, createdAt, updatedAt, originalDate, originalTime for reschedule requests).

📊 Logging
Basic client-side logging is implemented using console.log() and console.error() for debugging and tracking user actions or errors. For a production environment, integrating a dedicated logging service (e.g., Firebase Crashlytics, Google Cloud Logging) would be recommended for comprehensive monitoring. showMessage() is used for user-facing notifications.

🚀 Deployment
The project is designed as a static web application. It can be hosted on various cloud platforms.

Deployment Platform: GitHub Pages (as demonstrated in the previous steps).

Justification: GitHub Pages is ideal for this type of project due to its ease of setup, free hosting for static sites, direct integration with GitHub repositories, and reliable global CDN. It's perfectly suited for client-side applications like this one, where the backend is handled by Firebase.

💡 Solutions Design & System Architecture
Low-Level Design (LLD) Considerations:
User Roles & Permissions: Distinct UIs and functionalities based on student, teacher, and admin roles stored in Firestore.

Data Models: Clear structures for user and appointment documents in Firestore.

Event Handling: Event listeners are attached to UI elements to trigger Firebase interactions (login, register, book, approve, etc.).

Modularity: Breaking down logic into smaller, reusable functions (e.g., displayTeachersForStudent, updateAppointmentStatus, showMessage).

System Architecture Design (Wireframe/Architecture Document - conceptual):
Client-Side (Frontend):

HTML: Structure and content.

CSS: Styling and responsiveness.

JavaScript: All application logic, UI manipulation, and Firebase interactions.

Cloud Backend (Firebase):

Firebase Authentication: Handles user registration, login, and session management.

Firestore Database: Stores user profiles and appointment data.

(Potentially: Firebase Hosting for deployment)

(For complex logic: Firebase Cloud Functions could be added for server-side operations, e.g., sending notifications, complex data cleanup, but not currently implemented).

⚙️ Optimization of Solutions
Code Level:

Efficient DOM Manipulation: Updates to the UI are batched where possible to minimize reflows/repaints.

Modular JavaScript: Promotes code reusability and reduces redundancy.

Early Exits/Guard Clauses: Improves readability and performance by handling invalid conditions early.

Responsive CSS: Using flexbox, grid, and well-defined media queries ensures optimal layout and performance across devices without needing separate codebases.

Architecture Level:

Serverless Backend (Firebase): Eliminates the need for traditional server management, reducing operational overhead and enabling automatic scaling.

Real-time Database (Firestore Listeners): For teacher/student dashboards, real-time listeners could be implemented to instantly update appointment lists without manual refreshes, offering a more dynamic user experience (partially implemented for live updates on status changes).

Client-Side Rendering: The entire application logic runs in the browser, minimizing server load.

✅ Test Cases
Here are some example test cases covering different user roles and functionalities:

Authentication
Student Registration:

Input: Valid name, email, password (>=6 chars), role=student.

Expected: Account created, user logged out, isApproved: false in Firestore, success message, prompted to login.

Teacher Registration:

Input: Valid name, email, password (>=6 chars), role=teacher, subject.

Expected: Account created, user logged out, isApproved: true in Firestore, success message, prompted to login.

Login (Student - Pending):

Input: Email/password of an unapproved student.

Expected: Login attempt fails, error message "account awaiting admin approval", user remains logged out.

Login (Student - Approved):

Input: Email/password of an approved student.

Expected: Successful login, student dashboard visible, "Welcome, [Name] (student)!" message.

Login (Teacher):

Input: Email/password of a teacher.

Expected: Successful login, teacher dashboard visible, "Welcome, [Name] (teacher)!" message.

Login (Admin):

Input: Email/password of an admin.

Expected: Successful login, admin dashboard visible, "Welcome, [Name] (admin)!" message.

Login (Invalid Credentials):

Input: Incorrect email or password.

Expected: Login fails, error message "Invalid email or password."

Student Dashboard
View Teachers:

Expected: List of approved teachers (name, subject) displayed. Unapproved teachers not shown.

Book Appointment (New):

Steps: Select a teacher, choose future date/time, add message, submit.

Expected: Booking modal closes, success message, new appointment appears in "Your Booked Appointments" list with "Pending" status. Firestore updated.

Cancel Appointment (Pending)::

Steps: Click "Cancel" on a pending appointment, confirm.

Expected: Appointment status changes to "Cancelled", info message, UI updates. Firestore updated.

Reschedule Appointment (Approved):

Steps: Click "Reschedule" on an approved appointment, select new future date/time, submit.

Expected: Booking modal closes, success message, appointment status changes to "Reschedule Pending" with original details visible, UI updates. Firestore updated.

Filter Appointments:

Steps: Select "Approved" from filter dropdown.

Expected: Only appointments with "Approved" status are displayed.

Sort Appointments:

Steps: Select "Upcoming Date & Time" from sort dropdown.

Expected: Appointments are sorted chronologically.

Teacher Dashboard
View Incoming Appointments:

Expected: List of pending appointments (new and reschedule requests) and approved appointments.

Approve Appointment (Pending):

Steps: Click "Approve" on a pending appointment.

Expected: Appointment status changes to "Approved", success message, UI updates. Firestore updated.

Reject Appointment (Pending):

Steps: Click "Reject" on a pending appointment.

Expected: Appointment status changes to "Rejected", info message, UI updates. Firestore updated.

Approve Reschedule Request:

Steps: Click "Approve" on a "Reschedule Pending" appointment.

Expected: Appointment status changes to "Approved", original date/time details removed from Firestore, UI updates.

Admin Dashboard
View Pending Student Approvals:

Expected: List of all unapproved student accounts.

Approve Student:

Steps: Click "Approve" on a pending student, confirm.

Expected: Student's isApproved status becomes true, success message, student disappears from pending list and appears in "All Users" list as approved.

Add New Teacher:

Steps: Click "Add New Teacher", fill form, submit.

Expected: New teacher account created with isApproved: true, success message, new teacher appears in "All Users" list and "Available Teachers" for students.

Edit User:

Steps: Click "Edit" on a user, modify name/role/subject/approval status, save.

Expected: User details updated in Firestore, success message, UI updates.

Delete User:

Steps: Click "Delete" on a user (not self), confirm.

Expected: User deleted from Firestore, info message, user disappears from lists.

📦 Submission Requirements
Project Code: Submitted to this GitHub repository.

Detailed Project Report: To be created as a separate document, following the given sample.

System Architecture Design & Wireframe: To be submitted as separate documents.

Low-Level Design (LLD) Document: To be submitted as a separate document.
