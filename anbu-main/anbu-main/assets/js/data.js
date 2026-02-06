// data.js — hospital and doctor mapping helpers
const HOSPITALS = [
    { name: 'City Hospital', doctors: ['Dr. Sarah', 'Dr. Chen'] },
    { name: 'Central Medical', doctors: ['Dr. Emily', 'Dr. John'] },
    { name: 'Sunrise Clinic', doctors: ['Dr. Mike'] }
];

function normalizeDoctorName(name) {
    if (!name) return '';
    // Remove 'Dr' prefix, convert to lowercase and strip non-alpha characters so
    // variants like 'Dr. Sarah', 'dr_sarah', 'Sarah' normalize the same.
    return name.toString().toLowerCase().replace(/^dr\.?\s*/i, '').replace(/[^a-z]/g, '').trim();
}

function doctorMatches(doctorName, username) {
    return normalizeDoctorName(doctorName) === normalizeDoctorName(username);
}

function getDoctorsForHospital(hospitalName) {
    const h = HOSPITALS.find(x => x.name === hospitalName);
    return h ? h.doctors.slice() : [];
}

function getHospitalsForDoctor(username) {
    const result = HOSPITALS.filter(h => h.doctors.some(d => doctorMatches(d, username))).map(h => h.name);
    return result;
}