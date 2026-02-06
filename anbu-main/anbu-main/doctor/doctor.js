function showDoctorSection(section) {
    document.querySelectorAll('.doctor-section').forEach(s => s.style.display = 'none');
    document.getElementById("doctor" + section.charAt(0).toUpperCase() + section.slice(1)).style.display = "block";
}

function logout() {
    // clear stored user info on logout
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    window.location.href = "../index.html";
}

// initialize doctor page and show username
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');
    if (!username || userType !== 'doctor') {
        window.location.href = "../index.html";
        return;
    }
    const welcome = document.getElementById('welcomeUser');
    if (welcome) welcome.innerText = `Welcome, ${username} 👨‍⚕️`;
});

function approveAppointment() {
    alert("Appointment Approved");
}

function rescheduleAppointment() {
    alert("Reschedule Feature");
}

// Appointments storage helpers (share format with patient page)
function getAppointments() {
    try { return JSON.parse(localStorage.getItem('appointments') || '[]'); } catch (e) { return []; }
}
function saveAppointments(list) {
    localStorage.setItem('appointments', JSON.stringify(list));
}

function renderDoctorAppointments() {
    const username = localStorage.getItem('username');
    const tbody = document.getElementById('doctorAppointmentsBody');
    if (!tbody) return;
    // match by normalized doctor name and limit to hospitals where the doctor works (if known)
    const hospitals = getHospitalsForDoctor(username);
    let items = [];
    const allAppointments = getAppointments();
    console.log('renderDoctorAppointments: username=', username, 'hospitals=', hospitals, 'totalAppointments=', allAppointments.length);
    if (hospitals && hospitals.length > 0) {
        items = allAppointments.filter(a => doctorMatches(a.doctor, username) && hospitals.includes(a.hospital));
    } else {
        items = allAppointments.filter(a => doctorMatches(a.doctor, username));
    }
    console.log('renderDoctorAppointments: matchedAppointments=', items.length, 'matchedIds=', items.map(x=>x.id));

    // Update temporary debug panel with matched appointments and raw localStorage dump
    try {
        const dbg = document.getElementById('doctorDebug');
        if (dbg) {
            const mapped = items.map(a => ({ id: a.id, patient: a.patient, date: a.date, hospital: a.hospital, reportExists: !!a.report, report: a.report || null }));
            const raw = (() => { try { return JSON.parse(localStorage.getItem('appointments') || '[]'); } catch (e) { return []; } })();
            dbg.innerText = 'Matched Appointments:\n' + JSON.stringify(mapped, null, 2) + '\n\nAll Appointments (raw):\n' + JSON.stringify(raw, null, 2);
        }
    } catch (e) { console.warn('debug update failed', e); }

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No appointments found</td></tr>';
        return;
    }
    tbody.innerHTML = items.map(a => `
        <tr data-id="${a.id}">
            <td>${a.patient}</td>
            <td>${a.date}</td>
            <td>${a.hospital}</td>
            <td>${a.department}</td>
            <td>${a.status}</td>
            <td>
                ${a.status === 'Pending' ? `<button class="btn primary" onclick="approve('${a.id}')">Approve</button> <button class="btn danger" onclick="reject('${a.id}')">Reject</button>` : ''}
            </td>
            <td>
                ${a.report ? `<button class="btn" onclick="openViewReport('${a.id}')">View Report</button>` : ''}
            </td>
        </tr>
    `).join('');
}

// Doctor: view report and add notes
function openViewReport(id) {
    const list = getAppointments();
    const appt = list.find(x => x.id === id);
    if (!appt || !appt.report) return alert('Report not found');
    const r = appt.report;
    document.getElementById('drReportSummary').innerText = r.summary || '';
    document.getElementById('drReportSymptoms').innerText = (r.symptoms || []).join(', ');
    document.getElementById('drReportBodyParts').innerText = (r.bodyParts || []).join(', ');
    document.getElementById('drReportSeverity').innerText = r.severity || '';
    document.getElementById('drReportDescription').innerText = r.description || '';
    document.getElementById('doctorNotes').value = appt.report.doctorNotes || '';
    const modal = document.getElementById('doctorReportModal');
    if (modal) modal.classList.add('active');

    document.getElementById('closeDrReport').onclick = function () { modal.classList.remove('active'); };
    document.getElementById('saveDrNotes').onclick = function () {
        const notes = document.getElementById('doctorNotes').value.trim();
        appt.report.doctorNotes = notes;
        appt.report.status = 'reviewed';
        saveAppointments(list);
        modal.classList.remove('active');
        alert('Notes saved');
    };
}

function approve(id) {
    const list = getAppointments();
    const idx = list.findIndex(x => x.id === id);
    if (idx === -1) { alert('Appointment not found'); return; }
    list[idx].status = 'Approved';
    saveAppointments(list);
    renderDoctorAppointments();
    alert('Appointment Approved');
}

function reject(id) {
    const list = getAppointments();
    const idx = list.findIndex(x => x.id === id);
    if (idx === -1) { alert('Appointment not found'); return; }
    list[idx].status = 'Rejected';
    saveAppointments(list);
    renderDoctorAppointments();
    alert('Appointment Rejected');
}

// re-render appointments when page loads (and after other actions in page init)
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');
    if (!username || userType !== 'doctor') { window.location.href = "../index.html"; return; }
    renderDoctorAppointments();

    // update when appointments change elsewhere (other tab/window)
    window.addEventListener('storage', function (e) {
        if (e.key === 'appointments') renderDoctorAppointments();
    });

    // Also listen for BroadcastChannel messages to support immediate cross-tab updates
    try {
        const bc = new BroadcastChannel('appointments');
        bc.onmessage = function (msg) {
            if (!msg) return;
            renderDoctorAppointments();
        };
    } catch (e) { /* BroadcastChannel not supported */ }
});
