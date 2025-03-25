# Inventory Status Analysis & Dashboard

## Overview
The **Inventory Status Analysis & Dashboard** is a real-time inventory tracking system that helps businesses monitor stock levels and avoid shortages. The system categorizes inventory into different regions based on availability thresholds and allows users to directly email vendors when a part reaches the critical region. 

## Features
✅ **Real-time inventory tracking** – Monitor stock levels efficiently.  
✅ **Threshold-based categorization** – Inventory is classified into Safe, Warning, and Critical regions.  
✅ **Vendor communication** – Users can directly email vendors if stock is in the critical region.  
✅ **Interactive dashboard** – A clean and user-friendly UI for easy navigation.  
✅ **Separate frontend and backend** – Designed for modularity and performance.  

## Screenshots
![Untitled design](https://github.com/user-attachments/assets/83199eec-3568-4212-8ca5-b29e276fe766)
![Untitled design (1)](https://github.com/user-attachments/assets/3f6fb5ac-cfd9-4150-8461-3d056ecfa21a)


## Tech Stack
- **Frontend:** Next.js (React-based framework for fast UI rendering)
- **Backend:** Python (Handles data processing and API calls)


## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- **Node.js & npm** (For frontend setup)
- **Python & pip** (For backend setup)
- **Git** (For version control)

### Clone the Repository
```sh
git clone <repository-url>
cd inventory_management-2
```

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```
This will start the Next.js development server.

### Backend Setup
```sh
cd backend
python main.py
```
This will start the backend API server.

## Usage
1. Open the dashboard in your browser.
2. View real-time inventory levels.
3. If a part is in the **Critical region**, click the **Email Vendor** button to notify the supplier.
4. Monitor stock trends and take necessary actions before shortages occur.


## Future Improvements
- **Automated alerts** for low-stock items.
- **Integration with third-party inventory management tools**.
- **Detailed analytics & reporting** for better decision-making.


## License
This project is licensed under the MIT License.

---
📌 Stay ahead of inventory issues – automate tracking and vendor communication! 🚀
