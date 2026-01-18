# VALK – Transport Marketplace 🚚

VALK is a two-sided transport marketplace platform that connects **Shippers** and
**Transporters** to enable efficient and transparent movement of goods. The application
allows shippers to post load requirements and transporters to discover, negotiate, and
accept loads based on their vehicle availability.

The platform focuses on real-world logistics workflows such as role-based access,
two-way price negotiation, real-time notifications, and load journey tracking.

---

## 🚀 Key Features

### 👤 Role-Based Access
- Users can log in as either a **Shipper** or a **Transporter**
- Conditional navigation and protected screens based on user role

### 📦 Shipper Features
- Post load details including source, destination, vehicle type, and expected price
- View transporter bids and negotiate pricing
- Track load journey from pickup to delivery
- Receive real-time status updates and notifications

### 🚛 Transporter Features
- Browse available loads posted by shippers
- Place bids and negotiate rates with shippers
- Accept confirmed loads
- Update journey status and receive notifications

### 🔔 Communication & Updates
- Two-way rate negotiation between shippers and transporters
- Real-time notifications for bid updates, load status changes, and journey milestones

---

## 🛠 Tech Stack

- **Mobile:** React Native
- **Language:** JavaScript / TypeScript
- **State Management:** React Hooks
- **Backend:** REST APIs
- **Notifications:** API-based real-time updates
- **Version Control:** Git & GitHub

---

## 📦 Installation & Setup

Follow the steps below to run the project locally.

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Chirag-Bellani/Valk.git
```
2️⃣ Navigate to the project folder
```bash
cd Valk
```
3️⃣ Install dependencies
```bash
npm install
```
4️⃣ Start Metro server
```bash
npm start
```
5️⃣ Run the app on Android
```bash
npm run android
```
Environment Variables

Create a .env file in the root directory and configure required API keys:
```bash
API_BASE_URL=your_api_base_url
```
