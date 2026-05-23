// NEU Library – Register Page Logic (Firebase Compat SDK)
document.addEventListener('DOMContentLoaded', function () {

    var programs = {
        sgs:   [{ value: 'sgs_grad',  label: 'Graduate Studies' }],
        coa:   [{ value: 'bsa',       label: 'BSA - Bachelor of Science in Accountancy' },
                { value: 'bsais',     label: 'BSAIS - BS Accounting Information System' }],
        cag:   [{ value: 'bsag',      label: 'BSAg - Bachelor of Science in Agriculture' }],
        cas:   [{ value: 'ba_eco',    label: 'BAEcon - Bachelor of Arts in Economics' },
                { value: 'ba_polsci', label: 'BAPolSci - Bachelor of Arts in Political Science' },
                { value: 'bs_bio',    label: 'BSBio - Bachelor of Science in Biology' },
                { value: 'bs_psych',  label: 'BSPsych - Bachelor of Science in Psychology' },
                { value: 'bpa',       label: 'BPA - Bachelor of Public Administration' }],
        cba:   [{ value: 'bsba_fm',   label: 'BSBA-FM - Major in Financial Management' },
                { value: 'bsba_hrdm', label: 'BSBA-HRDM - Major in HR Dev. and Management' },
                { value: 'bsba_lm',   label: 'BSBA-LM - Major in Legal Management' },
                { value: 'bsba_mm',   label: 'BSBA-MM - Major in Marketing Management' },
                { value: 'bs_entre',  label: 'BSEntre - BS Entrepreneurship' },
                { value: 'bsrem',     label: 'BSREM - BS Real Estate Management' }],
        ccom:  [{ value: 'ba_comm',   label: 'BAComm - Bachelor of Arts in Communication' },
                { value: 'ba_broad',  label: 'BABroad - Bachelor of Arts in Broadcasting' },
                { value: 'ba_journ',  label: 'BAJourn - Bachelor of Arts in Journalism' }],
        cics:  [{ value: 'blis',      label: 'BLIS - Bachelor of Library and Information Science' },
                { value: 'bscs',      label: 'BSCS - Bachelor of Science in Computer Science' },
                { value: 'bsemc_da',  label: 'BSEMC-DAT - BS EMC in Digital Animation Technology' },
                { value: 'bsemc_gd',  label: 'BSEMC-GD - BS EMC in Game Development' },
                { value: 'bsit',      label: 'BSIT - Bachelor of Science in Information Technology' },
                { value: 'bsis',      label: 'BSIS - Bachelor of Science in Information System' }],
        ccrim: [{ value: 'bscrim',    label: 'BSCrim - Bachelor of Science in Criminology' }],
        ced:   [{ value: 'beed',      label: 'BEED - Bachelor of Elementary Education' },
                { value: 'beed_eced', label: 'BEED-ECED - Specialization in Early Childhood Ed.' },
                { value: 'beed_sned', label: 'BEED-SNED - Specialization in Special Education' },
                { value: 'bse_eng',   label: 'BSE-Eng - Major in English' },
                { value: 'bse_fil',   label: 'BSE-Fil - Major in Filipino' },
                { value: 'bse_math',  label: 'BSE-Math - Major in Mathematics' },
                { value: 'bse_ss',    label: 'BSE-SS - Major in Social Studies' },
                { value: 'bse_sci',   label: 'BSE-Sci - Major in Science' },
                { value: 'bse_mape',  label: 'BSE-MAPE - Major in MAPE' },
                { value: 'bse_tle',   label: 'BSE-TLE - Major in Technology and Livelihood Ed.' }],
        cea:   [{ value: 'bsce',      label: 'BSCE - Bachelor of Science in Civil Engineering' },
                { value: 'bsece',     label: 'BSECE - BS Electronics Engineering' },
                { value: 'bsee',      label: 'BSEE - BS Electrical Engineering' },
                { value: 'bsie',      label: 'BSIE - BS Industrial Engineering' },
                { value: 'bsme',      label: 'BSME - BS Mechanical Engineering' },
                { value: 'bsarch',    label: 'BSArch - Bachelor of Science in Architecture' },
                { value: 'bsastro',   label: 'BSAstro - Bachelor of Science in Astronomy' }],
        cmt:   [{ value: 'bsmt',      label: 'BSMT - Bachelor of Science in Medical Technology' }],
        con:   [{ value: 'bsn',       label: 'BSN - Bachelor of Science in Nursing' }]
    };

    var deptNames = {
        sgs:'School of Graduate Studies', coa:'College of Accountancy',
        cag:'College of Agriculture', cas:'College of Arts and Sciences',
        cba:'College of Business Administration', ccom:'College of Communication',
        cics:'College of Informatics and Computing Studies', ccrim:'College of Criminology',
        ced:'College of Education', cea:'College of Engineering and Architecture',
        cmt:'College of Medical Technology', con:'College of Nursing'
    };

    var departmentSelect = document.getElementById('departmentSelect');
    var courseSelect     = document.getElementById('courseSelect');
    var togglePwd        = document.getElementById('togglePwd');
    var passwordField    = document.getElementById('passwordField');
    var eyeIcon          = document.getElementById('eyeIcon');
    var registerForm     = document.getElementById('registerForm');
    var formStatus       = document.getElementById('formStatus');

    // ── GOOGLE PRE-FILL ───────────────────────────────────────────
    var isGoogleUser  = false;
    var googleUid     = null;
    var googleData    = sessionStorage.getItem('google_prefill');

    if (googleData) {
        try {
            var gd = JSON.parse(googleData);
            isGoogleUser = true;
            googleUid    = gd.uid;

            // Pre-fill name
            if (gd.fullName) {
                var fnEl = document.getElementById('fullName');
                if (fnEl) fnEl.value = gd.fullName;
            }
            // Pre-fill email and lock it
            if (gd.email) {
                var emEl = document.getElementById('emailAddress');
                if (emEl) {
                    emEl.value    = gd.email;
                    emEl.readOnly = true;
                    emEl.style.background = '#F3F4F6';
                    emEl.style.color      = '#6B7280';
                    emEl.title = 'Email from your Google account';
                }
            }
            // Hide password field — not needed for Google users
            if (passwordField) {
                var pwdParent = passwordField.closest('.field-group');
                if (pwdParent) pwdParent.style.display = 'none';
            }
            // Show welcome notice
            if (formStatus) {
                formStatus.textContent = '👋 Welcome! Your Google account was detected. Please complete your profile below.';
                formStatus.className   = 'form-status success';
            }
            sessionStorage.removeItem('google_prefill');
        } catch (e) {
            sessionStorage.removeItem('google_prefill');
            isGoogleUser = false;
        }
    }

    // ── DEPARTMENT → COURSE ───────────────────────────────────────
    departmentSelect.addEventListener('change', function () {
        var dept = this.value;
        courseSelect.innerHTML = '';
        courseSelect.disabled  = true;
        if (!dept) { courseSelect.innerHTML = '<option value="">Select Department First</option>'; return; }
        departmentSelect.classList.remove('is-error');
        var dErr = document.getElementById('departmentError');
        if (dErr) dErr.textContent = '';
        var list = programs[dept];
        if (!list || !list.length) { courseSelect.innerHTML = '<option value="">No programs listed yet</option>'; return; }
        var ph = document.createElement('option'); ph.value = ''; ph.textContent = 'Select Program';
        courseSelect.appendChild(ph);
        for (var i = 0; i < list.length; i++) {
            var opt = document.createElement('option');
            opt.value = list[i].value; opt.textContent = list[i].label;
            courseSelect.appendChild(opt);
        }
        courseSelect.disabled = false;
    });

    // ── ROLE → CONDITIONAL FIELDS ─────────────────────────────────
    document.getElementById('roleSelect').addEventListener('change', function () {
        var role     = this.value;
        var yearGroup  = document.getElementById('yearLevelGroup');
        var posGroup   = document.getElementById('positionGroup');
        var courseGroup = document.getElementById('courseProgramGroup');
        this.classList.remove('is-error');
        var rErr = document.getElementById('roleError'); if (rErr) rErr.textContent = '';
        if (role === 'student') {
            yearGroup.classList.remove('hidden'); courseGroup.classList.remove('hidden'); posGroup.classList.add('hidden');
        } else if (role === 'faculty' || role === 'employee') {
            yearGroup.classList.add('hidden'); courseGroup.classList.add('hidden'); posGroup.classList.remove('hidden');
            courseSelect.innerHTML = '<option value="">Select Department First</option>'; courseSelect.disabled = true;
        } else {
            yearGroup.classList.remove('hidden'); courseGroup.classList.remove('hidden'); posGroup.classList.add('hidden');
        }
    });

    // ── PASSWORD TOGGLE ───────────────────────────────────────────
    togglePwd.addEventListener('click', function () {
        var isH = passwordField.type === 'password';
        passwordField.type  = isH ? 'text' : 'password';
        eyeIcon.textContent = isH ? '🙈' : '👁️';
    });

    // ── LIVE ERROR CLEAR ──────────────────────────────────────────
    ['fullName','idNumber','emailAddress','passwordField'].forEach(function (id) {
        var el = document.getElementById(id); if (!el) return;
        el.addEventListener('input', function () {
            el.classList.remove('is-error');
            var k = id === 'passwordField' ? 'passwordError' : id + 'Error';
            var e = document.getElementById(k); if (e) e.textContent = '';
            if (formStatus) { formStatus.textContent = ''; formStatus.className = 'form-status'; }
        });
    });

    function setError(iId, eId, msg) {
        var i = document.getElementById(iId); var e = document.getElementById(eId);
        if (i) i.classList.add('is-error'); if (e) e.textContent = msg;
    }
    function clearError(iId, eId) {
        var i = document.getElementById(iId); var e = document.getElementById(eId);
        if (i) i.classList.remove('is-error'); if (e) e.textContent = '';
    }

    // ── FORM SUBMIT ───────────────────────────────────────────────
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        clearError('fullName','fullNameError'); clearError('idNumber','idNumberError');
        clearError('roleSelect','roleError'); clearError('departmentSelect','departmentError');
        clearError('emailAddress','emailError'); clearError('passwordField','passwordError');
        formStatus.textContent = ''; formStatus.className = 'form-status';

        var fullName   = document.getElementById('fullName').value.trim();
        var idNumber   = document.getElementById('idNumber').value.trim();
        var role       = document.getElementById('roleSelect').value;
        var dept       = document.getElementById('departmentSelect').value;
        var email      = document.getElementById('emailAddress').value.trim();
        var password   = document.getElementById('passwordField').value;
        var yearLevel  = document.getElementById('yearLevel') ? document.getElementById('yearLevel').value : 'na';
        var position   = document.getElementById('positionInput') ? document.getElementById('positionInput').value.trim() : '';
        var programVal   = courseSelect.value;
        var programLabel = courseSelect.options[courseSelect.selectedIndex] ? courseSelect.options[courseSelect.selectedIndex].text : '';

        var hasError = false;
        if (!fullName)  { setError('fullName','fullNameError','Full name is required.'); hasError = true; }
        if (!idNumber)  { setError('idNumber','idNumberError','ID number is required.'); hasError = true; }
        else if (!/^\d{2}-\d{5}-\d{3}$/.test(idNumber)) { setError('idNumber','idNumberError','Format: 12-34567-890'); hasError = true; }
        if (!role)      { setError('roleSelect','roleError','Please select a role.'); hasError = true; }
        if (!dept)      { setError('departmentSelect','departmentError','Please select a department.'); hasError = true; }
        if (!email)     { setError('emailAddress','emailError','Email is required.'); hasError = true; }
        else if (!email.endsWith('@neu.edu.ph')) { setError('emailAddress','emailError','Use your @neu.edu.ph email.'); hasError = true; }

        // Only require password for non-Google users
        if (!isGoogleUser) {
            if (!password)             { setError('passwordField','passwordError','Password is required.'); hasError = true; }
            else if (password.length < 8) { setError('passwordField','passwordError','Minimum 8 characters.'); hasError = true; }
        }

        if (hasError) {
            formStatus.textContent = 'Please fill in all required fields correctly.';
            formStatus.className   = 'form-status error';
            return;
        }

        formStatus.textContent = '⏳ Saving your profile…';
        formStatus.className   = 'form-status';
        document.getElementById('createAccountBtn').disabled = true;

        var parts       = fullName.split(/[\s,]+/).filter(Boolean);
        var initials    = parts.map(function (p) { return p[0].toUpperCase(); }).slice(0, 2).join('');
        var roleCap     = role.charAt(0).toUpperCase() + role.slice(1);
        var collegeName = deptNames[dept] || dept;
        var shortLabel  = programVal ? dept.toUpperCase() + ' – ' + programVal.split('_')[0].toUpperCase() : dept.toUpperCase();

        // ── SAVE PROFILE TO FIRESTORE ─────────────────────────────
        function saveProfile(uid) {
            return db.collection('users').doc(uid).set({
                uid:         uid,
                fullName:    fullName,
                email:       email,
                idNumber:    idNumber,
                role:        roleCap,
                systemRole:  'visitor',
                department:  dept,
                college:     collegeName,
                program:     programLabel || '',
                programCode: programVal   || '',
                yearLevel:   role === 'student' ? yearLevel : null,
                position:    (role === 'faculty' || role === 'employee') ? position : null,
                initials:    initials,
                shortLabel:  shortLabel,
                createdAt:   firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        function onSuccess() {
            formStatus.textContent = '✅ Profile saved! Redirecting to sign in…';
            formStatus.className   = 'form-status success';
            setTimeout(function () { window.location.href = 'index.html'; }, 2000);
        }

        function onError(err) {
            document.getElementById('createAccountBtn').disabled = false;
            var msg = '❌ ' + err.message;
            if (err.code === 'auth/email-already-in-use') msg = '❌ This email is already registered.';
            if (err.code === 'auth/weak-password')        msg = '❌ Password is too weak.';
            formStatus.textContent = msg;
            formStatus.className   = 'form-status error';
        }

        if (isGoogleUser && googleUid) {
            // Google user — already authenticated, just save profile
            saveProfile(googleUid).then(onSuccess).catch(onError);
        } else {
            // Email/password user — create Firebase Auth account first
            auth.createUserWithEmailAndPassword(email, password)
                .then(function (cred) { return saveProfile(cred.user.uid); })
                .then(onSuccess)
                .catch(onError);
        }
    });
});