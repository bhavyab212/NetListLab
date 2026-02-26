import { mockUsers, takenUsernames, registeredEmails, type User } from './users';

// Simulated delay to mimic network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    fullName: string;
    username: string;
    email: string;
    password: string;
}

export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}

/**
 * Mock login — accepts any registered email with password "password123"
 */
export async function mockLogin(credentials: LoginCredentials): Promise<AuthResult> {
    await delay(800);

    const user = mockUsers.find(u => u.email === credentials.email);

    if (!user) {
        return { success: false, error: 'Invalid email or password.' };
    }

    // Accept any password in mock mode for demo purposes
    if (credentials.password.length < 1) {
        return { success: false, error: 'Invalid email or password.' };
    }

    return { success: true, user };
}

/**
 * Mock register — creates a new user (in-memory only)
 */
export async function mockRegister(data: RegisterData): Promise<AuthResult> {
    await delay(1000);

    if (registeredEmails.includes(data.email)) {
        return { success: false, error: 'This email is already in use.' };
    }

    if (takenUsernames.includes(data.username)) {
        return { success: false, error: 'This username is taken.' };
    }

    const newUser: User = {
        id: String(mockUsers.length + 1),
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        avatar: '',
        bio: '',
        role: 'student',
        fields: [],
        skills: [],
        institution: '',
        createdAt: new Date().toISOString(),
    };

    return { success: true, user: newUser };
}

/**
 * Mock username availability check
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
    await delay(500);
    return !takenUsernames.includes(username.toLowerCase());
}
