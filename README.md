# 🌱 Supportify - Crowdfunding Platform

A full-stack crowdfunding platform built using **Vanilla HTML5, CSS3, JavaScript (ES6+)**, and **JSON Server**.

## 🚀 Live Demo

🔗 [**View Live Demo**](https://supportify-mt47.up.railway.app/)

---

## 👤 Default Admin Account

|         Email          | Password |
|------------------------|----------|
| [admin@supportify.com] | admin123 |

---

## 📋 Features

### 👤 Guest

- Browse approved campaigns
- Search campaigns

### 🙋 Registered User

- Register & Login
- Create campaigns with image upload
- Support campaigns with pledges
- View personal dashboard
- Edit campaign deadline
- View pledge history

### 🛡️ Admin

- View all users & campaigns
- Ban / Unban users
- Approve / Reject campaigns
- Delete campaigns

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** JSON Server (v0.17.4)
- **Fonts:** Google Fonts *(Plus Jakarta Sans, Fraunces)*

---

## ⚙️ Local Setup

> **Prerequisites:** Make sure you have [Node.js](https://nodejs.org/) installed.

```bash
# 1. Clone the repository
git clone https://github.com/MT-47/supportify-platform.git

# 2. Navigate to the project folder
cd supportify-platform

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Then open your browser and go to:

```url
http://localhost:3000/index.html
```

---

## 📁 Project Structure

```folder
supportify-platform/
│
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── admin-enhancements.css
│   │
│   ├── js/
│   │   ├── utils.js
│   │   ├── script.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── campaigns.js
│   │   ├── create-campaign.js
│   │   ├── adminDashboard.js
│   │   ├── userDashboard.js
│   │   └── navbar.js
│   │
│   ├── images/
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── campaigns.html
│   ├── create-campaign.html
│   ├── adminDashboard.html
│   └── userDashboard.html
│
├── db.json
├── package.json
└── README.md
```

---

## 👨‍💻 Author

**Mustafa Taher** — .NET ITI, Zagazig
