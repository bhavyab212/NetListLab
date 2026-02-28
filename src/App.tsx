import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/Toast';
import { useThemeStore } from './stores/themeStore';
import ExplorePage from './app/explore/ExplorePage';
import LoginPage from './app/login/LoginPage';
import RegisterPage from './app/register/RegisterPage';
import OnboardingPage from './app/onboarding/OnboardingPage';

function ThemeSync() {
    const { theme } = useThemeStore();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return null;
}

function App() {
    return (
        <BrowserRouter>
            <ThemeSync />
            <Toaster>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/" element={<Navigate to="/explore" replace />} />
                    <Route path="*" element={<Navigate to="/explore" replace />} />
                </Routes>
            </Toaster>
        </BrowserRouter>
    );
}

export default App;
