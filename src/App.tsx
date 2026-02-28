import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/Toast';
import { useThemeStore } from './stores/themeStore';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
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
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <BrowserRouter>
            <ThemeSync />
            <Toaster>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route
                        path="/explore"
                        element={
                            <Layout isDark={isDark} toggleTheme={toggleTheme}>
                                <Dashboard />
                            </Layout>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Toaster>
        </BrowserRouter>
    );
}

export default App;
