# NEU Library Visitor Log System

A web-based visitor management system developed for the New Era University Library. Library visitors can log their purpose of visit digitally, while the librarian or administrator can monitor all incoming visits through a real-time dashboard.

Live site → https://weslyquilendireno.github.io/NEULibSystem/

---

## Overview

Instead of signing a physical logbook, visitors sign in with their NEU account, select their reason for visiting, and submit. The admin dashboard updates instantly whenever a new visit is logged — no need to refresh.

---

## Features

**For visitors**
- Sign in with NEU Google account (`@neu.edu.ph`) or email and password
- First-time Google users are guided through a profile setup
- Select one or more purposes: Reading Books, Research/Thesis, Use of Computer, Doing Assignments
- Live timestamp shown on the dashboard

**For administrators**
- Real-time visitor log table
- Today's visit count broken down by purpose
- Search by name, college, or program
- Filter by purpose of visit
- Pagination (10 entries per page)
- Switch between admin and visitor view without signing out
- Clear all logs when needed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend / Database | Firebase Firestore |
| Authentication | Firebase Authentication (Email/Password + Google OAuth) |
| Hosting | GitHub Pages |

---

## Project Structure

```
index.html                  login page
register.html               account registration
dashboard_visitor.html      visitor log page
dashboard_admin.html        admin dashboard
firebase.js                 firebase configuration
loginpage.css / .js
register.css / .js
dashboard_visitor.css / .js
dashboard_admin.css / .js
neu-seal.png
neu-lib-building.jpg
neu-lib-inside.png
```

---

## Running Locally

1. Clone the repository:
```bash
git clone https://github.com/WeslyQuilendireno/NEULibSystem.git
```

2. Open the project in VS Code and run it using the Live Server extension.

3. Use a valid `@neu.edu.ph` email or a registered account to log in.

> Firebase is already configured. No additional setup needed.

---

## Developer

**Wesly Quilendireno**
Bachelor of Science in Information Technology
College of Informatics and Computing Studies
New Era University

---

## License

This project was developed for academic and school project purposes at **New Era University**. Not intended for commercial use.
