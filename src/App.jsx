import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import RoleSelect from './pages/RoleSelect';
import LearnerSetup from './pages/LearnerSetup';
import TeacherSetup from './pages/TeacherSetup';
import ParentSetup from './pages/ParentSetup';
import LearnerHome from './pages/LearnerHome';
import LearnerLessons from './pages/LearnerLessons';
import LessonDetail from './pages/LessonDetail';
import LearnerChat from './pages/LearnerChat';
import LearnerDownloads from './pages/LearnerDownloads';
import LearnerProfile from './pages/LearnerProfile';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherUpload from './pages/TeacherUpload';
import TeacherStudents from './pages/TeacherStudents';
import TeacherProgress from './pages/TeacherProgress';
import ParentDashboard from './pages/ParentDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />
      <Route path="/learner-setup" element={<LearnerSetup />} />
      <Route path="/teacher-setup" element={<TeacherSetup />} />
      <Route path="/parent-setup" element={<ParentSetup />} />
      <Route path="/learner" element={<LearnerHome />} />
      <Route path="/learner/lessons" element={<LearnerLessons />} />
      <Route path="/learner/lesson/:id" element={<LessonDetail />} />
      <Route path="/learner/chat" element={<LearnerChat />} />
      <Route path="/learner/downloads" element={<LearnerDownloads />} />
      <Route path="/learner/profile" element={<LearnerProfile />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/upload" element={<TeacherUpload />} />
      <Route path="/teacher/students" element={<TeacherStudents />} />
      <Route path="/teacher/progress" element={<TeacherProgress />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
