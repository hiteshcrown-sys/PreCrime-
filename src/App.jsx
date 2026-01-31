import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ChatBotProvider } from '@/contexts/ChatBotContext';
import { CityProvider } from '@/contexts/CityContext';
import ChatBot from '@/components/AIAssistant/ChatBot';
import NCISLoadingScreen from '@/components/layout/NCISLoadingScreen';
import { AlertProvider } from '@/contexts/AlertContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LanguageChooser from '@/components/layout/LanguageChooser';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show Indian Government–style loading screen (logo first) while checking app or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return <NCISLoadingScreen />;
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
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  // Splash: show 2.5s, then fade out and reveal main app. Easy to remove – delete this useEffect and #initial-loading in index.html.
  useEffect(() => {
    const splash = document.getElementById("initial-loading");
    const root = document.getElementById("root");
    if (!splash) return;
    const hideSplash = () => {
      splash.classList.add("splash-fade-out");
      setTimeout(() => {
        splash.remove();
        if (root) root.classList.add("splash-done");
      }, 500);
    };
    const t = setTimeout(hideSplash, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <CityProvider>
          <AlertProvider>
            <ChatBotProvider>
              <QueryClientProvider client={queryClientInstance}>
                <Router>
                  <LanguageChooser />
                  <NavigationTracker />
                  <AuthenticatedApp />
                  <ChatBot />
                </Router>
                <Toaster />
              </QueryClientProvider>
            </ChatBotProvider>
          </AlertProvider>
        </CityProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App;
