// NEU Library – Admin Dashboard (Firebase Compat SDK)
document.addEventListener('DOMContentLoaded', function () {

    var ADMIN_EMAILS = [
        'wesly.quilendireno@neu.edu.ph',
        'jcesperanza@neu.edu.ph'
    ];

    auth.onAuthStateChanged(function (firebaseUser) {
        if (!firebaseUser) { window.location.href = 'index.html'; return; }

        var userEmail     = (firebaseUser.email || '').toLowerCase().trim();
        var isWhitelisted = ADMIN_EMAILS.indexOf(userEmail) !== -1;

        db.collection('users').doc(firebaseUser.uid).get()
            .then(function (doc) {
                var systemRole = doc.exists ? doc.data().systemRole : '';
                if (!isWhitelisted && systemRole !== 'admin') {
                    auth.signOut().then(function () { window.location.href = 'index.html'; });
                    return;
                }
                var fullName, email, initials;
                if (doc.exists) {
                    var d = doc.data();
                    fullName = d.fullName || firebaseUser.email;
                    email    = d.email    || firebaseUser.email;
                    var parts = fullName.split(/[\s,]+/).filter(Boolean);
                    initials  = parts.map(function (p) { return p[0].toUpperCase(); }).slice(0, 2).join('') || 'AU';
                } else {
                    fullName = firebaseUser.email;
                    email    = firebaseUser.email;
                    initials = 'AU';
                }
                document.getElementById('headerName').textContent   = fullName;
                document.getElementById('headerAvatar').textContent = initials;
                document.getElementById('dropAvatar').textContent   = initials;
                document.getElementById('dropName').textContent     = fullName;
                document.getElementById('dropEmail').textContent    = email;
                initDashboard();
            })
            .catch(function () {
                if (isWhitelisted) {
                    document.getElementById('headerName').textContent   = firebaseUser.email;
                    document.getElementById('headerAvatar').textContent = 'AU';
                    document.getElementById('dropAvatar').textContent   = 'AU';
                    document.getElementById('dropName').textContent     = firebaseUser.email;
                    document.getElementById('dropEmail').textContent    = firebaseUser.email;
                    initDashboard();
                } else {
                    window.location.href = 'index.html';
                }
            });
    });

    function initDashboard() {

        // ── PROFILE DROPDOWN ──────────────────────────────────────
        var headerProfile   = document.getElementById('headerProfile');
        var profileDropdown = document.getElementById('profileDropdown');
        headerProfile.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('open');
        });
        document.addEventListener('click', function () { profileDropdown.classList.remove('open'); });

        document.getElementById('signOutBtn').addEventListener('click', function () {
            auth.signOut().then(function () { window.location.href = 'index.html'; });
        });
        document.getElementById('switchVisitorBtn').addEventListener('click', function () {
            window.location.href = 'dashboard_visitor.html';
        });

        // ── SCROLL TO TOP ─────────────────────────────────────────
        var scrollBtn = document.getElementById('scrollTopBtn');
        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ── PURPOSE CONFIG ────────────────────────────────────────
        var purposeConfig = {
            'Reading Books':     { icon: '📖', cls: 'badge-reading',    short: 'Reading…'     },
            'Research / Thesis': { icon: '🔬', cls: 'badge-research',   short: 'Research…'    },
            'Use of Computer':   { icon: '💻', cls: 'badge-computer',   short: 'Computer…'    },
            'Doing Assignments': { icon: '📝', cls: 'badge-assignment', short: 'Assignments…' }
        };
        var roleConfig = {
            'Student':  'role-student',
            'Faculty':  'role-faculty',
            'Employee': 'role-employee'
        };

        function esc(str) {
            return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // ── BUILD PURPOSE CELL ────────────────────────────────────
        function buildPurposeCell(log) {
            var purposes = log.purposes && log.purposes.length
                ? log.purposes
                : (log.purpose ? log.purpose.split(', ') : []);

            if (purposes.length === 0) return '<span class="no-program">—</span>';

            var count = purposes.length;
            var html  = '<div class="purpose-cell">';

            purposes.forEach(function (p) {
                var cfg = purposeConfig[p] || { icon: '❓', cls: '', short: p };
                if (count === 1) {
                    html += '<span class="purpose-badge ' + cfg.cls + '">' + cfg.icon + ' ' + esc(p) + '</span>';
                } else if (count === 2) {
                    html += '<span class="purpose-badge ' + cfg.cls + ' badge-short" title="' + esc(p) + '">' + cfg.icon + ' ' + esc(cfg.short) + '</span>';
                } else {
                    html += '<span class="purpose-badge ' + cfg.cls + ' badge-emoji" title="' + esc(p) + '">' + cfg.icon + '</span>';
                }
            });
            html += '</div>';
            return html;
        }

        // ── PAGINATION ────────────────────────────────────────────
        var PAGE_SIZE    = 10;
        var currentPage  = 1;
        var filteredLogs = [];

        function renderTable(logs) {
            var tbody      = document.getElementById('logTableBody');
            var emptyState = document.getElementById('emptyState');
            var pagBar     = document.getElementById('paginationBar');
            tbody.innerHTML = '';

            if (logs.length === 0) {
                emptyState.classList.add('visible');
                pagBar.style.display = 'none';
                return;
            }
            emptyState.classList.remove('visible');

            var totalPages = Math.ceil(logs.length / PAGE_SIZE);
            if (currentPage > totalPages) currentPage = totalPages;
            var start = (currentPage - 1) * PAGE_SIZE;
            var end   = Math.min(start + PAGE_SIZE, logs.length);

            logs.slice(start, end).forEach(function (log, i) {
                var roleCls     = roleConfig[log.role] || '';
                var isStudent   = (log.role === 'Student');
                var programCell = isStudent
                    ? '<span class="program-cell">' + esc(log.program || '—') + '</span>'
                    : '<span class="no-program">—</span>';

                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td><span class="row-num">' + (start + i + 1) + '</span></td>' +
                    '<td><span class="name-cell">' + esc(log.name) + '</span></td>' +
                    '<td><span class="college-cell">' + esc(log.college) + '</span></td>' +
                    '<td>' + programCell + '</td>' +
                    '<td><span class="role-tag ' + roleCls + '">' + esc(log.role || 'N/A') + '</span></td>' +
                    '<td>' + buildPurposeCell(log) + '</td>' +
                    '<td><span class="time-cell">' + esc(log.display) + '</span></td>';
                tbody.appendChild(tr);
            });

            if (logs.length <= PAGE_SIZE) {
                pagBar.style.display = 'none';
            } else {
                pagBar.style.display = 'flex';
                document.getElementById('paginationInfo').textContent =
                    'Showing ' + (start + 1) + '–' + end + ' of ' + logs.length;
                document.getElementById('prevBtn').disabled = (currentPage === 1);
                document.getElementById('nextBtn').disabled = (currentPage >= totalPages);
            }
        }

        document.getElementById('prevBtn').addEventListener('click', function () {
            if (currentPage > 1) { currentPage--; renderTable(filteredLogs); }
        });
        document.getElementById('nextBtn').addEventListener('click', function () {
            if (currentPage < Math.ceil(filteredLogs.length / PAGE_SIZE)) { currentPage++; renderTable(filteredLogs); }
        });

        // ── STATS ─────────────────────────────────────────────────
        function updateStats(logs) {
            var today = new Date().toDateString();
            var todayLogs = logs.filter(function (l) {
                var ts = l.timestamp;
                var d  = ts && ts.toDate ? ts.toDate() : new Date(ts || 0);
                return d.toDateString() === today;
            });
            function countPurpose(label) {
                return todayLogs.filter(function (l) {
                    var ps = l.purposes && l.purposes.length ? l.purposes : (l.purpose ? [l.purpose] : []);
                    return ps.indexOf(label) !== -1;
                }).length;
            }
            document.getElementById('statTotal').textContent      = todayLogs.length;
            document.getElementById('statReading').textContent    = countPurpose('Reading Books');
            document.getElementById('statResearch').textContent   = countPurpose('Research / Thesis');
            document.getElementById('statComputer').textContent   = countPurpose('Use of Computer');
            document.getElementById('statAssignment').textContent = countPurpose('Doing Assignments');
        }

        // ── SEARCH / FILTER ───────────────────────────────────────
        function nameMatches(fullName, search) {
            if (!search) return true;
            var name = (fullName || '').toLowerCase();
            if (name.includes(search)) return true;
            return name.split(/[\s,]+/).filter(Boolean).some(function (w) { return w.startsWith(search); });
        }

        var allLogs = [];
        function applyFilters() {
            var search  = document.getElementById('searchInput').value.trim().toLowerCase();
            var purpose = document.getElementById('filterPurpose').value;

            filteredLogs = allLogs.filter(function (log) {
                var matchSearch = nameMatches(log.name, search)
                    || (!search || (log.college || '').toLowerCase().includes(search))
                    || (!search || (log.program || '').toLowerCase().includes(search));
                var matchPurpose = !purpose;
                if (!matchPurpose) {
                    var ps = log.purposes && log.purposes.length ? log.purposes : (log.purpose ? [log.purpose] : []);
                    matchPurpose = ps.indexOf(purpose) !== -1;
                }
                return matchSearch && matchPurpose;
            });

            currentPage = 1;
            renderTable(filteredLogs);
        }

        document.getElementById('searchInput').addEventListener('input', applyFilters);
        document.getElementById('filterPurpose').addEventListener('change', applyFilters);

        // ── FIRESTORE LISTENER ────────────────────────────────────
        db.collection('visitor_logs')
            .orderBy('timestamp', 'desc')
            .onSnapshot(function (snapshot) {
                allLogs = snapshot.docs.map(function (doc) {
                    var d = doc.data();
                    if (!d.display && d.timestamp) {
                        var dt = d.timestamp.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
                        d.display = dt.toLocaleString('en-PH', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit', hour12: true
                        });
                    }
                    return d;
                });
                updateStats(allLogs);
                applyFilters();
            }, function (err) { console.error('Firestore error:', err); });

        // ── CLEAR LOGS ────────────────────────────────────────────
        document.getElementById('clearLogsBtn').addEventListener('click', function () {
            if (!confirm('Clear ALL visitor logs? This cannot be undone.')) return;
            db.collection('visitor_logs').get()
                .then(function (snapshot) {
                    var batch = db.batch();
                    snapshot.docs.forEach(function (doc) { batch.delete(doc.ref); });
                    return batch.commit();
                })
                .then(function () {
                    allLogs = []; filteredLogs = []; currentPage = 1;
                    updateStats([]); renderTable([]);
                })
                .catch(function (err) { alert('Error: ' + err.message); });
        });
    }
});