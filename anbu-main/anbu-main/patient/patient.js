function showPatientSection(section) {
    document.querySelectorAll('.patient-section').forEach(s => s.style.display = 'none');
    document.getElementById("patient" + section.charAt(0).toUpperCase() + section.slice(1)).style.display = "block";
}

function openBookingModal() {
    document.getElementById("bookingModal").classList.add("active");
}

function closeBookingModal() {
    document.getElementById("bookingModal").classList.remove("active");
}

// logout handled by the logout() below (clears stored user info)


const modal = document.getElementById("bookingModal");
const form = document.getElementById("bookingForm");

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

const bookBtn = document.querySelector('.btn.primary');
if (bookBtn) bookBtn.addEventListener('click', openModal);

// Appointments storage helpers
function getAppointments() {
    try { return JSON.parse(localStorage.getItem('appointments') || '[]'); } catch (e) { return []; }
}
function saveAppointments(list) {
    localStorage.setItem('appointments', JSON.stringify(list));
}

function renderPatientAppointments() {
    const username = localStorage.getItem('username');
    const tbody = document.getElementById('patientAppointmentsBody');
    if (!tbody) return;
    const items = getAppointments().filter(a => a.patient === username);
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No appointments found</td></tr>';
        return;
    }
    tbody.innerHTML = items.map(a => `
        <tr data-id="${a.id}">
            <td>${a.date}</td>
            <td>${a.hospital}</td>
            <td>${a.doctor}</td>
            <td>${a.department}</td>
            <td>${a.status}</td>
            <td>
                ${a.status === 'Pending' ? `<button class="btn danger cancel-btn" data-id="${a.id}">Cancel</button>` : ''}
            </td>
            <td>
                ${a.report ? `<button class="btn" onclick="openViewReport('${a.id}')">View Report</button>` : `<button class="btn" onclick="openChatForAppointment('${a.id}')">Add Report</button>`}
            </td>
        </tr>
    `).join('');
}

// Save a structured report into an appointment and re-render
function saveReportForAppointment(id, report) {
    const list = getAppointments();
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) { alert('Appointment not found'); return; }
    report.reportId = report.reportId || 'r-' + Date.now().toString();
    report.createdAt = report.createdAt || new Date().toISOString();
    report.updatedAt = new Date().toISOString();
    report.status = 'submitted';
    list[idx].report = report;
    console.log('saveReportForAppointment: saving report for id=', id, 'report=', report);
    saveAppointments(list);
    // notify other tabs (storage events fire in other windows) and send a BroadcastChannel message
    try {
        const bc = new BroadcastChannel('appointments');
        bc.postMessage({ type: 'updated', appointmentId: id });
    } catch (e) { /* BroadcastChannel not available */ }
    // legacy: also dispatch a storage-like event for in-page listeners
    try { window.dispatchEvent(new StorageEvent('storage', { key: 'appointments' })); } catch (e) { }
    renderPatientAppointments();
    alert('Report saved and attached to appointment');
}

// Open chatbot attached to a specific appointment
function openChatForAppointment(appointmentId) {
    if (window.Chatbot && window.Chatbot.open) {
        window.Chatbot.open(appointmentId, function (report, apptId) {
            saveReportForAppointment(apptId, report);
        });
    } else {
        alert('Chatbot not available');
    }
}

// View report modal for patient
function openViewReport(id) {
    const list = getAppointments();
    const appt = list.find(x => x.id === id);
    if (!appt || !appt.report) return alert('Report not found');
    const r = appt.report;
    const modal = document.getElementById('reportModal');
    document.getElementById('reportSummary').innerText = r.summary || '';
    document.getElementById('reportSymptoms').innerText = (r.symptoms || []).join(', ');
    document.getElementById('reportBodyParts').innerText = (r.bodyParts || []).join(', ');
    document.getElementById('reportSeverity').innerText = r.severity || '';
    document.getElementById('reportDescription').innerText = r.description || '';
    modal.classList.add('active');

    // delete handler
    const delBtn = document.getElementById('deleteReportBtn');
    delBtn.onclick = function () {
        if (!confirm('Delete this report?')) return;
        deleteReportForAppointment(id);
        closeReportModal();
    }
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) modal.classList.remove('active');
}

function deleteReportForAppointment(id) {
    const list = getAppointments();
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return;
    delete list[idx].report;
    saveAppointments(list);
    renderPatientAppointments();
}


// Handle booking submission
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const selects = form.querySelectorAll('select');
        const hospital = selects[0].value;
        const department = selects[1].value;
        const doctor = selects[2].value;
        const date = form.querySelector('input[type="date"]').value;

        if (!hospital || !department || !doctor || !date) { alert('Please fill all fields'); return; }

        const username = localStorage.getItem('username');
        const appointment = {
            id: Date.now().toString(),
            date,
            hospital,
            doctor,
            department,
            status: 'Pending',
            patient: username
        };
        const list = getAppointments();
        list.push(appointment);
        saveAppointments(list);
        renderPatientAppointments();
        alert('Appointment Requested Successfully');
        closeModal();
        form.reset();
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const department = form.querySelectorAll("select")[0].value;
    const doctor = form.querySelectorAll("select")[1].value;
    const date = form.querySelector("input").value;

    const table = document.querySelector("tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${date}</td>
        <td>${doctor}</td>
        <td>${department}</td>
        <td>Pending</td>
        <td><button class="btn danger">Cancel</button></td>
    `;

    table.appendChild(row);

    alert("Appointment Requested Successfully");
    closeModal();
    form.reset();
});

function logout() {
    // clear stored user info on logout
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    window.location.href = "../index.html";
}

// Initialize page: set welcome text, attach handlers, render appointments
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');
    if (!username || userType !== 'patient') { window.location.href = "../index.html"; return; }
    const welcome = document.getElementById('welcomeUser'); if (welcome) welcome.innerText = `Welcome, ${username} 👋`;

    // populate hospitals and wire doctor dropdown
    const hospitalSelect = document.getElementById('hospitalSelect');
    const doctorSelect = document.getElementById('doctorSelect');
    if (hospitalSelect) {
        // populate hospitals from data.js HOSPITALS
        HOSPITALS.forEach(h => {
            const opt = document.createElement('option'); opt.value = h.name; opt.text = h.name; hospitalSelect.add(opt);
        });
        hospitalSelect.addEventListener('change', function () {
            const docs = getDoctorsForHospital(this.value);
            if (doctorSelect) {
                doctorSelect.innerHTML = '<option value="">Select</option>';
                docs.forEach(d => doctorSelect.add(new Option(d, d)));
            }
        });
    }

    // set doctors if hospital already selected
    if (hospitalSelect && hospitalSelect.value && doctorSelect) {
        const docs = getDoctorsForHospital(hospitalSelect.value);
        docs.forEach(d => doctorSelect.add(new Option(d, d)));
    }

    // Delegated cancel handler for patient's table
    const tbody = document.getElementById('patientAppointmentsBody');
    if (tbody) {
        tbody.addEventListener('click', function (e) {
            const target = e.target;
            if (target && target.matches('.cancel-btn')) {
                const id = target.getAttribute('data-id');
                if (!id) return;
                if (!confirm('Are you sure you want to cancel this appointment?')) return;
                const list = getAppointments();
                const idx = list.findIndex(x => x.id === id);
                if (idx === -1) return;
                list[idx].status = 'Cancelled';
                saveAppointments(list);
                renderPatientAppointments();
                alert('Appointment cancelled');
            }
        });
    }

    // re-render when storage changes (e.g., doctor approves in another tab)
    window.addEventListener('storage', function (e) {
        if (e.key === 'appointments') renderPatientAppointments();
    });

    // initial render
    renderPatientAppointments();
});
