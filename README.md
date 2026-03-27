# 🌱 Supportify - Crowdfunding Platform

A full-stack crowdfunding platform built using **Vanilla HTML5, CSS3, JavaScript (ES6+)**, and **JSON Server**.

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

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/MT-47/supportify-platform.git

# 2. Navigate to the project folder
cd supportify-platform

# 3. Install dependencies
npm install

# 4. Start the server
npm start
```

---

## 🌐 Run the App

After running the server, open your browser and go to:

```url
http://localhost:3000/index.html
```

---

## 👤 Default Admin Account

| Email                  | Password |
|------------------------|----------|
| <admin@supportify.com> | admin123 |

---

## 📁 Project Structure

```folder
supportify-platform/
│
├── public/
│   ├── css/
│   │   ├── style.css
│   │   ├── admin-enhancements.css
│   │
│   ├── js/
│   │   └── utils.js
│   │   ├── script.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── campaigns.js
│   │   ├── create-campaign.js
│   │   ├── adminDashboard.js
│   │   └── userDashboard.js
│   │   └── navbar.js
│   │
│   ├── images/
│   │   ├── coffee-shop.png
│   │   ├── Help-Save-Ahmed’s-Life.png
│   │   └── Save-Stray-Animals.png
│   │   └── school-building.png
│   │   └── smart-watch.png
│   │   └── spring-fruits.png
│   │   └── Support-Omar-after-losing-his job.png
│   │   └── Tree-Planting-Initiative.png
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

**Mustafa Taher**  
.NET ITI - Zagazig
