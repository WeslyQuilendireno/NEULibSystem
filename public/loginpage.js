// NEU Library – Login Page Logic (Firebase Compat SDK)
document.addEventListener('DOMContentLoaded', function () {

    var toggleBtns        = document.querySelectorAll('.toggle-btn');
    var toggleSlider      = document.querySelector('.toggle-slider');
    var roleToggle        = document.getElementById('roleToggle');
    var formTitle         = document.getElementById('formTitle');
    var formSubtitle      = document.getElementById('formSubtitle');
    var googleBtnText     = document.getElementById('googleBtnText');
    var statusMsg         = document.getElementById('statusMessage');
    var googleBtn         = document.getElementById('googleLoginBtn');
    var emailInput        = document.getElementById('emailInput');
    var passwordInput     = document.getElementById('passwordInput');
    var loginBtn          = document.getElementById('loginBtn');
    var togglePasswordBtn = document.getElementById('togglePassword');
    var createAccountBtn  = document.getElementById('createAccountBtn');

    var currentMode = 'visitor';

    // ── ADMIN WHITELIST ───────────────────────────────────────────
    var ADMIN_EMAILS = [
        'wesly.quilendireno@neu.edu.ph',
        'jcesperanza@neu.edu.ph'
    ];

    function isAdminEmail(email) {
        return ADMIN_EMAILS.indexOf((email || '').toLowerCase().trim()) !== -1;
    }

    // ── ROLE TOGGLE ───────────────────────────────────────────────
    toggleBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var newMode = btn.dataset.role;
            if (newMode === currentMode) return;
            toggleBtns.forEach(function (b) { b.classList.remove('active'); });
            roleToggle.classList.remove('admin-active', 'visitor-active');
            btn.classList.add('active');
            setTimeout(function () {
                if (newMode === 'visitor') {
                    toggleSlider.style.transform = 'translateX(0%)';
                    roleToggle.classList.add('visitor-active');
                } else {
                    toggleSlider.style.transform = 'translateX(100%)';
                    roleToggle.classList.add('admin-active');
                }
            }, 50);
            updateContent(newMode);
            currentMode = newMode;
        });
    });

    function updateContent(mode) {
        var content = {
            visitor: { title: 'Welcome Visitor!', subtitle: 'Quick sign in for library visits', google: 'Sign in with Google', ph: 'Enter your @neu.edu.ph email' },
            admin:   { title: 'Admin Login',       subtitle: 'Access visitor statistics',       google: 'Admin Sign in',        ph: 'Enter admin @neu.edu.ph email' }
        };
        var c = content[mode];
        formTitle.textContent     = c.title;
        formSubtitle.textContent  = c.subtitle;
        googleBtnText.textContent = c.google;
        emailInput.placeholder    = c.ph;
        statusMsg.textContent     = '';
        statusMsg.className       = 'status-message';
    }

    // ── PASSWORD TOGGLE ───────────────────────────────────────────
    togglePasswordBtn.addEventListener('click', function () {
        var isPass = passwordInput.type === 'password';
        passwordInput.type = isPass ? 'text' : 'password';
        togglePasswordBtn.querySelector('.eye-icon').textContent = isPass ? '🙈' : '👁️';
    });

    // ── STATUS HELPER ─────────────────────────────────────────────
    function setStatus(msg, type) {
        statusMsg.textContent = msg;
        statusMsg.className   = 'status-message status-' + type;
    }

    // ── REDIRECT LOGIC ────────────────────────────────────────────
    function handleRedirect(email) {
        if (currentMode === 'visitor') {
            window.location.href = 'dashboard_visitor.html';
            return;
        }
        if (isAdminEmail(email)) {
            window.location.href = 'dashboard_admin.html';
        } else {
            setStatus('❌ You do not have admin access.', 'error');
            auth.signOut();
        }
    }

    // ── EMAIL + PASSWORD LOGIN ────────────────────────────────────
    loginBtn.addEventListener('click', function () {
        var email    = emailInput.value.trim();
        var password = passwordInput.value;

        if (!email)    { setStatus('❌ Please enter your email address.', 'error'); return; }
        if (!email.endsWith('@neu.edu.ph')) { setStatus('❌ Please use your @neu.edu.ph email.', 'error'); return; }
        if (!password) { setStatus('❌ Please enter your password.', 'error'); return; }

        setStatus('🔄 Logging in…', 'loading');

        auth.signInWithEmailAndPassword(email, password)
            .then(function (cred) {
                handleRedirect(cred.user.email);
            })
            .catch(function (err) {
                var msg = '❌ Login failed.';
                if (err.code === 'auth/user-not-found')     msg = '❌ No account found with this email.';
                if (err.code === 'auth/wrong-password')     msg = '❌ Incorrect password.';
                if (err.code === 'auth/invalid-credential') msg = '❌ Wrong email or password.';
                if (err.code === 'auth/invalid-email')      msg = '❌ Invalid email address.';
                if (err.code === 'auth/too-many-requests')  msg = '❌ Too many attempts. Try again later.';
                setStatus(msg, 'error');
            });
    });

    // ── GOOGLE SIGN-IN ────────────────────────────────────────────
    googleBtn.addEventListener('click', async function () {
        try {
            setStatus('🔄 Signing in with Google…', 'loading');

            googleProvider.setCustomParameters({ prompt: 'select_account' });

            const result = await auth.signInWithPopup(googleProvider);

            if (!result || !result.user) {
                throw new Error("No user returned from Google.");
            }

            const googleUser = result.user;
            const email = googleUser.email || '';

            if (!email.endsWith('@neu.edu.ph')) {
                setStatus('❌ Use your @neu.edu.ph email.', 'error');
                await auth.signOut();
                return;
            }

            const doc = await db.collection('users').doc(googleUser.uid).get();

            if (!doc.exists) {
                sessionStorage.setItem('google_prefill', JSON.stringify({
                    fullName: googleUser.displayName || email.split('@')[0],
                    email: email,
                    uid: googleUser.uid
                }));
                setStatus('👤 New user! Redirecting…', 'loading');
                setTimeout(() => { window.location.href = 'register.html'; }, 800);
            } else {
                handleRedirect(email);
            }

        } catch (err) {
            console.error("Google Sign-In Error:", err);
            if (err.code === 'auth/popup-closed-by-user') {
                setStatus('⚠️ Popup closed.', 'error');
            } else if (err.code === 'auth/popup-blocked') {
                setStatus('❌ Popup blocked! Allow popups for this site.', 'error');
            } else {
                setStatus('❌ ' + err.message, 'error');
            }
        }
    });

    // ── CREATE ACCOUNT ────────────────────────────────────────────
    createAccountBtn.addEventListener('click', function () {
        window.location.href = 'register.html';
    });

});