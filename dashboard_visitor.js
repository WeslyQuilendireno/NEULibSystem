// NEU Library – Visitor Dashboard (Firebase Compat SDK)
document.addEventListener('DOMContentLoaded', function () {

    auth.onAuthStateChanged(function (firebaseUser) {
        if (!firebaseUser) { window.location.href = 'index.html'; return; }

        db.collection('users').doc(firebaseUser.uid).get()
            .then(function (doc) {
                var user;
                if (doc.exists) {
                    var d = doc.data();
                    var parts = (d.fullName || '').split(/[\s,]+/).filter(Boolean);
                    var initials = parts.map(function (p) { return p[0].toUpperCase(); }).slice(0, 2).join('') || 'U';
                    user = {
                        fullName: d.fullName || 'Visitor',
                        college: d.college || '—',
                        program: d.program || '',
                        role: d.role || 'Student',
                        email: d.email || firebaseUser.email,
                        initials: initials,
                        shortLabel: d.shortLabel || d.department || '—'
                    };
                } else {
                    var em = firebaseUser.email || '';
                    user = {
                        fullName: em.split('@')[0], college: '—', program: '',
                        role: 'Student', email: em,
                        initials: em[0].toUpperCase(), shortLabel: '—'
                    };
                }
                populatePage(user, firebaseUser.uid);
            })
            .catch(function () { window.location.href = 'index.html'; });
    });

    function populatePage(user, uid) {

        //  HEADER 
        document.getElementById('headerName').textContent = user.fullName;
        document.getElementById('headerCollege').textContent = user.shortLabel;
        document.getElementById('headerAvatar').textContent = user.initials;
        document.getElementById('dropAvatar').textContent = user.initials;
        document.getElementById('dropName').textContent = user.fullName;
        document.getElementById('dropEmail').textContent = user.email;

        //  WELCOME BANNER & INFO STRIP 
        document.getElementById('bannerAvatar').textContent = user.initials;
        document.getElementById('bannerName').textContent = user.fullName;
        document.getElementById('infoCollege').textContent = user.college;
        document.getElementById('infoProgram').textContent = user.program;
        document.getElementById('infoRole').textContent = user.role;

        if (user.role === 'Faculty' || user.role === 'Employee') {
            var pi = document.getElementById('programInfoItem');
            var pd = document.getElementById('programDivider');
            if (pi) pi.style.display = 'none';
            if (pd) pd.style.display = 'none';
        }

        //  LIVE CLOCK 
        function updateClock() {
            document.getElementById('bannerTime').textContent =
                new Date().toLocaleString('en-PH', {
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                });
        }
        updateClock();
        setInterval(updateClock, 1000);

        //  PROFILE DROPDOWN 
        var headerProfile = document.getElementById('headerProfile');
        var profileDropdown = document.getElementById('profileDropdown');
        headerProfile.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('open');
        });
        document.addEventListener('click', function () {
            profileDropdown.classList.remove('open');
        });

        //  MULTI-SELECT PURPOSE 
        var selectedPurposes = [];  // can hold 1–4 purposes
        var purposeCards = document.querySelectorAll('.purpose-card');
        var logBtn = document.getElementById('logVisitBtn');
        var logBtnText = document.getElementById('logBtnText');
        var statusMsg = document.getElementById('statusMsg');

        purposeCards.forEach(function (card) {
            card.addEventListener('click', function () {
                var purpose = card.dataset.purpose;
                var idx = selectedPurposes.indexOf(purpose);

                if (idx === -1) {
                    // Add to selection
                    selectedPurposes.push(purpose);
                    card.classList.add('selected');
                } else {
                    // Remove from selection (toggle off)
                    selectedPurposes.splice(idx, 1);
                    card.classList.remove('selected');
                }

                statusMsg.textContent = '';
                statusMsg.className = 'status-msg';

                if (selectedPurposes.length === 0) {
                    logBtn.disabled = true;
                    logBtnText.textContent = 'Select a Purpose to Log Visit';
                } else if (selectedPurposes.length === 1) {
                    logBtn.disabled = false;
                    logBtnText.textContent = 'Log Visit – ' + selectedPurposes[0];
                } else {
                    logBtn.disabled = false;
                    logBtnText.textContent = 'Log Visit – ' + selectedPurposes.length + ' purposes selected';
                }
            });
        });

        //  LOG VISIT → FIRESTORE 
        logBtn.addEventListener('click', function () {
            if (selectedPurposes.length === 0) return;

            logBtn.disabled = true;
            logBtnText.textContent = '⏳ Logging visit…';
            statusMsg.textContent  = '';
            statusMsg.className = 'status-msg';

            var now = new Date();
            var display = now.toLocaleString('en-PH', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            });

            var logEntry = {
                uid:       uid,
                name:      user.fullName,
                college:   user.college,
                program:   user.program,
                role:      user.role,
                purposes:  selectedPurposes,           // array of selected purposes
                purpose:   selectedPurposes.join(', '), // backward-compat string
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                display:   display
            };

            db.collection('visitor_logs').add(logEntry)
                .then(function () {
                    var label = selectedPurposes.length === 1
                        ? selectedPurposes[0]
                        : selectedPurposes.length + ' purposes';
                    statusMsg.textContent = '✅ Visit logged! Purpose: ' + label + ' — ' + display;
                    statusMsg.className = 'status-msg success';
                    logBtnText.textContent = '✅ Visit Logged!';

                    setTimeout(function () {
                        purposeCards.forEach(function (c) { c.classList.remove('selected'); });
                        selectedPurposes = [];
                        logBtn.disabled = true;
                        logBtnText.textContent = 'Select a Purpose to Log Visit';
                        statusMsg.textContent = '';
                        statusMsg.className = 'status-msg';
                    }, 4000);
                })
                .catch(function (err) {
                    logBtn.disabled = false;
                    logBtnText.textContent = selectedPurposes.length === 1
                        ? 'Log Visit – ' + selectedPurposes[0]
                        : 'Log Visit – ' + selectedPurposes.length + ' purposes selected';
                    statusMsg.textContent = '❌ Failed to log visit: ' + err.message;
                    statusMsg.className   = 'status-msg error';
                });
        });

        //  SIGN OUT 
        document.getElementById('signOutBtn').addEventListener('click', function () {
            auth.signOut().then(function () { window.location.href = 'index.html'; });
        });
    }
});