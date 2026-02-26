/**
 * Predefined skill tags for autocomplete in onboarding.
 * Organized by rough category but treated as a flat list in the UI.
 */
export const skillTags: string[] = [
    // Electronics
    'ESP32', 'Arduino', 'Raspberry Pi', 'STM32', 'PCB Design', 'KiCad',
    'Altium', 'Eagle', 'VLSI', 'Verilog', 'SystemVerilog', 'FPGA',
    'Cadence', 'LTSpice', 'Oscilloscope', 'Soldering', 'SMD Assembly',
    'Power Electronics', 'Analog Design', 'RF Design', 'Antenna Design',

    // Software
    'React', 'TypeScript', 'JavaScript', 'Python', 'C', 'C++', 'Rust',
    'Go', 'Node.js', 'Next.js', 'Vue', 'Svelte', 'Django', 'Flask',
    'Docker', 'Kubernetes', 'Git', 'Linux', 'AWS', 'Firebase',

    // AI/ML
    'PyTorch', 'TensorFlow', 'OpenCV', 'Scikit-learn', 'Pandas',
    'Computer Vision', 'NLP', 'Reinforcement Learning', 'Keras',
    'Hugging Face', 'LLM', 'Stable Diffusion',

    // Mechanical
    'SolidWorks', 'AutoCAD', 'Fusion 360', 'CATIA', 'Ansys',
    '3D Printing', 'CNC Machining', 'Laser Cutting', 'Sheet Metal',
    'FEA', 'CFD', 'GD&T',

    // Robotics
    'ROS', 'ROS2', 'Gazebo', 'SLAM', 'Motion Planning',
    'Sensor Fusion', 'PID Control', 'Servo Motors', 'Stepper Motors',
    'IMU', 'LiDAR', 'Computer Vision',

    // Design
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Blender',
    'After Effects', 'UI/UX', 'Prototyping', 'Design Systems',

    // Research
    'LaTeX', 'MATLAB', 'Simulink', 'R', 'SPICE', 'Signal Processing',
    'Control Systems', 'Embedded Systems', 'IoT', 'BLE', 'LoRa', 'MQTT',
];

/**
 * Filter skills by search query
 */
export function filterSkills(query: string, excludeSkills: string[] = []): string[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [];

    return skillTags
        .filter(skill =>
            skill.toLowerCase().includes(normalizedQuery) &&
            !excludeSkills.includes(skill)
        )
        .slice(0, 8);
}
