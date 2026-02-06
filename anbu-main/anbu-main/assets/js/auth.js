document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const userType = document.getElementById("userType").value;

    // If any required field missing, show helpful message
    if (!username || !email || !userType) {
        alert("Please fill all required fields");
        return;
    }

    // Email must not start with a digit and must contain '@'
    const emailPattern = /^(?!\d).+@.+$/;
    if (!emailPattern.test(email)) {
        alert("Email must contain '@' and not start with a number");
        return;
    }

    // Save user info for use in dashboard pages
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("userType", userType);

    // Use relative paths so the app works regardless of host filesystem layout
    if (userType === "patient") {
        window.location.href = "D:/Pyplots.exe/example/anbu-main/anbu-main/patient/patient.html";
    } else if (userType === "doctor") {
        window.location.href = "D:/Pyplots.exe/example/anbu-main/anbu-main/doctor/doctor.html";
    } else if (userType === "admin") {
        window.location.href = "admin-dashboard.html";
    }
});
