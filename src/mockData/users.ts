export interface User {
    id: string;
    fullName: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    role: 'student' | 'engineer' | 'researcher' | 'freelancer' | 'other';
    fields: string[];
    skills: string[];
    institution: string;
    createdAt: string;
}

export const mockUsers: User[] = [
    {
        id: '1',
        fullName: 'Aarav Mehta',
        username: 'aarav-mehta',
        email: 'aarav@example.com',
        avatar: '',
        bio: 'ECE student building IoT devices and embedded systems.',
        role: 'student',
        fields: ['Electronics', 'Software'],
        skills: ['ESP32', 'Arduino', 'React', 'PCB Design', 'KiCad'],
        institution: 'IIT Delhi',
        createdAt: '2026-01-15T10:00:00Z',
    },
    {
        id: '2',
        fullName: 'Priya Sharma',
        username: 'priya-builds',
        email: 'priya@example.com',
        avatar: '',
        bio: 'Robotics enthusiast and mechanical engineer.',
        role: 'engineer',
        fields: ['Robotics', 'Mechanical'],
        skills: ['ROS', '3D Printing', 'SolidWorks', 'Python', 'Raspberry Pi'],
        institution: 'Bosch India',
        createdAt: '2026-02-01T14:30:00Z',
    },
    {
        id: '3',
        fullName: 'Ravi Kumar',
        username: 'ravi-vlsi',
        email: 'ravi@example.com',
        avatar: '',
        bio: 'VLSI design researcher focused on low-power circuits.',
        role: 'researcher',
        fields: ['Electronics', 'Research'],
        skills: ['VLSI', 'Verilog', 'Cadence', 'FPGA', 'SystemVerilog'],
        institution: 'IISc Bangalore',
        createdAt: '2026-01-20T09:15:00Z',
    },
    {
        id: '4',
        fullName: 'Nisha Patel',
        username: 'nisha-ai',
        email: 'nisha@example.com',
        avatar: '',
        bio: 'AI/ML engineer building computer vision projects.',
        role: 'freelancer',
        fields: ['AI/ML', 'Software'],
        skills: ['PyTorch', 'TensorFlow', 'OpenCV', 'Python', 'Docker'],
        institution: '',
        createdAt: '2026-02-10T16:45:00Z',
    },
];

export const takenUsernames = mockUsers.map(u => u.username);
export const registeredEmails = mockUsers.map(u => u.email);
