# SpeedType Trainer - Typing Game with Flying Animation

SpeedType Trainer is an interactive typing web app built with React and Node.js, deployed on Vercel. It helps users improve typing speed through a fun challenge: a 2D flying character that moves faster as you type correctly.

<!-- Last updated to fix GitHub push verification -->

## 🧩 Key Features

### Typing Challenge
- Type the displayed text within a countdown timer
- Each correct word boosts your flight speed

### 2D Flying Animation
- A simple paper plane or rocket flies across the screen
- Gravity pulls it down when you stop typing or make mistakes
- Reaches the goal when you complete the text

### Timer & Score
- 60-second default timer
- Final screen shows WPM, accuracy, and completion score

### User Profiles & Subscriptions
- **Free Plan**: Access short typing games
- **Pro Plan**: Longer challenges + stats dashboard
- **Trainer Plan**: Guided lessons and progress analytics

### Progress Saving
- Stores user performance (speed, accuracy, time) in a MongoDB database
- Users can review progress in a dashboard

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TailwindCSS |
| Animation | Framer Motion (for flight + gravity) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT (Login / Register) |
| Deployment | Vercel (Frontend + Serverless Functions) |

## 🧠 Game Flow

1. User logs in → chooses a challenge
2. Timer starts → text appears → plane begins to fly
3. Correct typing = forward & upward motion
4. Pausing or errors = gravity pulls plane down
5. When time ends or finish line reached → results displayed
6. Score saved → user can retry or upgrade plan

## 💳 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Basic challenges |
| Pro | $9/mo | Extended texts, progress tracking |
| Trainer | $19/mo | Series lessons, advanced analytics |

Payments can be integrated with Stripe.

## 🌐 Deployment Flow

- Deploy frontend + backend via Vercel
- Use MongoDB Atlas for persistent data
- Store keys in .env (MONGO_URI, JWT_SECRET, STRIPE_KEY)

## ✨ Animation Style

- Character: 🚀 Rocket (SVG or Lottie file)
- Background: Slowly scrolling sky + clouds

### Animation Control:
- Typing speed → flight speed
- Mistake → drop slightly (gravity)
- Finish → small landing or celebration motion

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd type-flow-game
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

4. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

5. **Set up environment variables:**
   - Create a `.env` file in the `server` directory
   - Add your MongoDB connection string and other secrets

6. **Start the development servers:**
   ```bash
   # From the root directory, start both frontend and backend
   npm run dev
   
   # Or start them separately:
   # In one terminal, start the backend
   cd server
   npm run dev
   
   # In another terminal, start the frontend
   cd client
   npm run dev
   ```

7. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
type-flow-game/
├── client/              # React frontend
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── package.json     # Frontend dependencies
├── server/              # Node.js backend
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── index.js         # Server entry point
│   └── package.json     # Backend dependencies
├── package.json         # Root package with build scripts
└── README.md            # This file
```

## 🛠️ Development

### Frontend
- Built with React and Vite for fast development
- Uses TailwindCSS for styling
- Framer Motion for animations
- Context API for state management

### Backend
- RESTful API with Express.js
- MongoDB with Mongoose for data persistence
- JWT for authentication
- CORS enabled for frontend communication

## 🧪 Testing

To run tests (when implemented):
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## 📦 Deployment

### Vercel Deployment

1. **Create a Vercel account**
   - Go to [vercel.com](https://vercel.com) and sign up

2. **Import your project**
   - Click "New Project" in your Vercel dashboard
   - Import your GitHub repository (or upload the code directly)
   - Select the root directory of your project

3. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT token generation

4. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Root Directory: `.` (root of the project)
   - Build Command: `npm run build`
   - Output Directory: `client/dist`

5. **Deploy!**
   - Click "Deploy" and wait for the build to complete

### Manual Deployment Steps

If you prefer to deploy manually:

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Use the Vercel CLI: `vercel --prod`
   - Or deploy the `client/dist` folder manually

3. **Deploy the backend**
   - Deploy the server as a separate Vercel serverless function
   - Update the frontend API base URL to point to your deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend library
- [Vite](https://vitejs.dev/) - Frontend build tool
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database