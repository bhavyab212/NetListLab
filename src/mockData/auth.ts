import { mockUsers, type User } from './users';

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

// For duplicate-checking during registration
const registeredEmails = mockUsers.map(u => u.email);
const takenUsernames = mockUsers.map(u => u.username.toLowerCase());

/** Mock login — DEV MODE: any non-empty email/username + any non-empty password succeeds.
 *  If the email matches a mock user, log in as them. Otherwise default to bhavya_dev (user-1). */
export async function mockLogin(credentials: LoginCredentials): Promise<AuthResult> {
    await delay(600);
    // Minimum non-empty check
    if (!credentials.email.trim() || !credentials.password.trim()) {
        return { success: false, error: 'Please enter a username and password.' };
    }
    // Try to find a matching mock user by email or username
    const matched =
        mockUsers.find(u => u.email === credentials.email.trim()) ??
        mockUsers.find(u => u.username === credentials.email.trim()) ??
        mockUsers[0]; // fallback: always log in as bhavya_dev
    return { success: true, user: matched };
}

/** Mock register — in-memory only */
export async function mockRegister(data: RegisterData): Promise<AuthResult> {
    await delay(1000);
    if (registeredEmails.includes(data.email)) return { success: false, error: 'This email is already in use.' };
    if (takenUsernames.includes(data.username.toLowerCase())) return { success: false, error: 'This username is taken.' };

    const newUser: User = {
        id: `user-${mockUsers.length + 1}`,
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        avatar: `https://i.pravatar.cc/150?u=${data.username}`,
        bio: '',
        role: 'Builder',
        institution: '',
        location: '',
        joinedAt: new Date().toISOString(),
        skills: [],
        followers: 0,
        following: 0,
        projectCount: 0,
        totalStars: 0,
        isVerified: false,
        domains: [],
    };
    return { success: true, user: newUser };
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    await delay(500);
    return !takenUsernames.includes(username.toLowerCase());
}
