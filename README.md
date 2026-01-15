# Pre-Med Election System - Frontend

A modern, mobile-first election management system built with React, TypeScript, and Tailwind CSS for managing student elections with real-time results and comprehensive admin controls.

## 🚀 Features

### User Features
- **Mobile-First Design**: Fully responsive interface optimized for mobile devices
- **User Registration & Verification**: Multi-step registration with ID card upload
- **Real-Time Voting**: Cast votes with instant feedback
- **Live Results**: View election results with rankings and percentages
- **Election Status**: Real-time countdown timer showing time remaining

### Admin Features
- **Comprehensive Dashboard**: Overview with stats cards and live charts
- **User Verification**: Review and approve/reject user registrations
- **Candidate Management**: Add, edit, and manage candidates with photos
- **Category Management**: Create and organize election categories
- **Election Controls**: Start, pause, resume, and stop elections with custom duration
- **Live Results Tracking**: Real-time vote counts and rankings
- **Admin Management**: Super admin can manage other administrators
- **Real-Time Updates**: Socket.IO integration for instant state changes

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Socket.IO Client** - Real-time communication
- **Heroicons** - Icon library

## 📁 Project Structure

```
client/
├── src/
│   ├── core/
│   │   ├── api/
│   │   │   └── client.ts              # API client with error handling
│   │   └── services/
│   │       ├── auth.service.ts        # Authentication service
│   │       ├── admin.service.ts       # Admin operations
│   │       ├── voting.service.ts      # Voting operations
│   │       ├── category.service.ts    # Category CRUD
│   │       └── socket.service.ts      # WebSocket connection
│   ├── features/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx     # Main admin interface
│   │   │   └── components/
│   │   │       ├── AdminLogin.tsx
│   │   │       ├── PendingVerifications.tsx
│   │   │       ├── CandidateManagement.tsx
│   │   │       ├── CategoryManagement.tsx
│   │   │       ├── ElectionControls.tsx
│   │   │       ├── LiveResults.tsx
│   │   │       ├── ElectionCharts.tsx
│   │   │       └── AdminManagement.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── voting/
│   │       ├── VotingPage.tsx
│   │       └── ResultsPage.tsx
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── ElectionStatusWidget.tsx
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProgressStepper.tsx
│   │   ├── contexts/
│   │   │   └── NotificationContext.tsx
│   │   ├── hooks/
│   │   │   ├── useElection.ts         # Election state management
│   │   │   └── useConfirmation.ts     # Confirmation dialogs
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── ranking.ts             # Ranking calculations
│   │   └── constants/
│   │       └── index.ts               # App constants
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running at `https://premed-election-backend.onrender.com`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pre-med-election-system/client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
# .env
VITE_API_URL=https://premed-election-backend.onrender.com
```

4. Start development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🔑 Key Components

### Election State Management
The `useElection` hook manages real-time election state:
- Polls backend every 5 seconds for status updates
- Listens to Socket.IO events for instant updates
- Automatically converts ISO date strings to Date objects

### Admin Dashboard
Comprehensive admin interface with:
- Fixed header with live election indicator
- Tabbed navigation (Dashboard, Verifications, Candidates, Categories, Election, Admins)
- Real-time stats cards
- Live results with rankings
- Interactive charts (bar and pie)

### Election Controls
Flexible duration settings:
- Days (0-30)
- Hours (0-23)
- Minutes (0-59)
- Automatic calculation of total duration
- Smart button states based on election status

### Mobile-First Design
- Minimum 44px touch targets
- Responsive breakpoints (sm, md, lg, xl)
- Touch-friendly interfaces
- Optimized layouts for all screen sizes

## 🔌 API Integration

### Endpoints Used

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

**Voting:**
- `GET /api/candidates` - Get all candidates
- `POST /api/vote` - Cast a vote
- `GET /api/admin/election-status` - Get election state

**Admin:**
- `GET /api/admin/pending-users` - Get pending verifications
- `POST /api/admin/verify-user` - Approve/reject user
- `POST /api/admin/toggle-election` - Control election
- `POST /api/admin/candidate` - Add candidate (FormData)
- `DELETE /api/admin/candidate/:id` - Delete candidate

**Categories:**
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Socket Events

**Listening:**
- `ELECTION_STARTED` - Election begins
- `ELECTION_PAUSED` - Election paused
- `ELECTION_RESUMED` - Election resumed
- `ELECTION_ENDED` - Election concluded
- `VOTE_CAST` - New vote received

## 🎨 Styling

### Tailwind Configuration
- Custom color palette (slate, blue, green, yellow, red)
- Responsive breakpoints
- Custom animations (pulse, spin)
- Mobile-first approach

### Design System
- **Primary Color**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Background**: Slate (#0F172A, #1E293B)

## 🔒 Security Features

- Client-side form validation
- Error handling with user-friendly messages
- No sensitive data in localStorage
- Secure file upload (images only)
- Admin role-based access control

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Socket Connection Issues
If WebSocket fails to connect:
- Check backend URL in `socket.service.ts`
- Ensure backend supports Socket.IO
- Verify CORS settings on backend

### Election State Not Updating
- Check browser console for API errors
- Verify `/api/admin/election-status` endpoint exists
- Ensure socket events are being emitted from backend

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

```env
VITE_API_URL=https://premed-election-backend.onrender.com
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to hosting service
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow mobile-first design principles
4. Maintain minimum 44px touch targets
5. Test on multiple screen sizes

## 📄 License

This project is proprietary software for Pre-Med student elections.

## 👥 Authors

- Frontend Architecture & Development
- Mobile-First Design Implementation
- Real-Time Features Integration

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for utility-first styling
- Recharts for beautiful data visualization
- Socket.IO for real-time communication

---

**Built with ❤️ for Pre-Med Student Elections**
