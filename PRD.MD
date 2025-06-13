 📘
Product Requirements Document (PRD) for AI-Powered Collaborative Study Platform
🧱
Tech Stack
● Frontend: React with Vite
● Backend: SUPABASE
● Authentication: SUPABASE AUTH
● Payments: Polar
● AI: Gemini (via OpenRouter)
● Storage: SUPABASE (for document uploads and reading)
🎯
Product Vision
Build a real-time collaborative reading and focus platform for students powered by AI and Pomodoro sessions. The experience is community-driven with gamification, smart agents, and intelligent feedback.
Core Features
1. Authentication
● Sign up/sign in via SUPABASE AUTH
● Onboarding with username, field of study, and interests
● Store user profile metadata (SUPABASE AUTH)
2. Dashboard 1: Lobby (Room Explorer)
● Sidebar:
○ Profile picture, streak info, badges
○ Navigation (Lobby, My Sessions, Settings)
● Main Body:
○ Active Pomodoro Rooms list
  🧩

 ■ Room name, number of participants, document title
■ Join Button → routes to Dashboard 2
○ Button to Create Your Own Session
○ Filter & Search by topic, tags, or number of users
○ Active study streak tracker
3. Dashboard 2: Study Room (Reader UI)
● 70% of screen: Embedded PDF or Document Viewer
● Right Sidebar:
○ Pomodoro Timer with clear progress
■ Group session: locked controls
■ Solo session: full control (start/pause/reset)
○ Active Users (avatars, usernames, tooltips)
○ Leaderboard by focus time or quiz scores
○ AI Helper Toggle (Gemini-based)
● After Pomodoro Ends:
○ Auto-generated comprehension questions:
■ MCQs, True/False, Short Answer
○ "Need Help?" opens AI Assistant with contextual help
○ Option: Take a break OR Start new Pomodoro
4. Room Creation Flow
● Title of Session
● Upload or Select document
● Set Pomodoro duration
● Visibility: Private or Public
5. Study Flow
● First-time users log in → Dashboard 1
● Click join room → routed to Dashboard 2 (group room)
● Click create session → routed to Dashboard 2 (solo session)
● Document is loaded, timer starts
● After session → questions → AI assistance or break
6. AI Features (Gemini)
● Read PDF content live (streamed input)
● Generate comprehension questions every session
● Personalized feedback based on score history
● Optional smart summary agent

 7. Gamification
● Daily streaks
● XP points for completing sessions
● Leaderboards by:
○ Focus hours
○ Quiz scores
● Badges for:
○ First Pomodoro
○ Weekly Challenge Completion
8. Payments (Polar)
● Paywall for premium features:
○ AI Deep Feedback
○ History tracking
○ Study analytics dashboard
● Integration with Polar checkout
● User plan metadata stored in SUPABASE
9. Storage (SUPABASE)
● PDF upload, processed and served to embedded viewer
● Access control via SUPABASE AUTH metadata (ownership + permissions)
Implementation Plan (Step-by-Step)
Phase 1: Foundations
1. Set up React with Vite
2. Integrate Clerk authentication
3. Configure Convex backend
4. Implement routing between Dashboard 1 and 2
5. Build core layout UI (Sidebar + Main area)
Phase 2: Core Workflows
6. Create and join rooms
7. Document upload + SUPABASE integration
8. Embed PDF viewer with scrolling sync
9. Pomodoro logic for group & solo sessions
 🛠

 Phase 3: AI + Quizzes
10. Set up OpenRouter with Gemini API 11. Stream document input to Gemini
12. Generate quizzes after Pomodoro ends 13. Show quiz UI (MCQ, TF, Short Answer) 14. Add AI assistant for help
Phase 4: Real-Time + Gamification
15. Show live user avatars per room
16. Add leaderboard (Convex subscriptions) 17. Build streak logic + XP
18. Design badges system
Phase 5: Monetization + Launch
19. Integrate Polar checkout
20. Lock premium features behind plan
21. Add analytics for usage
22. Final polish, deploy on Cloudflare Pages
🧪
Optional Features (Post-MVP)
● Friends system + direct invites
● Group messaging during break
● Voice chat during Pomodoro breaks
● Browser notifications
● Offline mode + local caching
📂
Folder Structure (Suggestion) /src
/components
/pages
/routes /lib /hooks /context /features
  
 /auth /rooms /documents /pomodoro /ai
🧠
Notes
●
Prioritize minimal friction UX
No empty states: suggest documents, joinable rooms
●
Focus on mental clarity for UI: whitespace, clear CTA, progress bars ●
●
All AI features are assistive, never disruptive
  