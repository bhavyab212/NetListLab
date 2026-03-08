import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding NetListLab database...\n');

    // ─── Users ────────────────────────────────────────────────────────────────
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'arjun.sharma@example.com' },
            update: {},
            create: {
                id: 'seed-user-001',
                email: 'arjun.sharma@example.com',
                username: 'arjun_builds',
                full_name: 'Arjun Sharma',
                bio: 'ECE final year @ IIT Bombay. I build robots and cry about PCB manufacturing tolerances.',
                location: 'Mumbai, India',
                github_url: 'https://github.com/arjun_builds',
                field_of_work: ['ELECTRONICS', 'ROBOTICS'],
                skill_tags: ['esp32', 'kicad', 'ros', 'arduino', 'pcb-design'],
                current_role: 'Student',
                institution: 'IIT Bombay',
                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
            },
        }),
        prisma.user.upsert({
            where: { email: 'priya.nair@example.com' },
            update: {},
            create: {
                id: 'seed-user-002',
                email: 'priya.nair@example.com',
                username: 'priya_circuits',
                full_name: 'Priya Nair',
                bio: 'VLSI engineer at Intel. Weekend maker. If it has a microcontroller, I have opinions.',
                location: 'Bangalore, India',
                linkedin_url: 'https://linkedin.com/in/priyanair',
                field_of_work: ['ELECTRONICS', 'AI_ML'],
                skill_tags: ['vlsi', 'verilog', 'fpga', 'machine-learning', 'python'],
                current_role: 'Engineer',
                institution: 'Intel India',
                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
            },
        }),
        prisma.user.upsert({
            where: { email: 'devesh.patel@example.com' },
            update: {},
            create: {
                id: 'seed-user-003',
                email: 'devesh.patel@example.com',
                username: 'devesh_3d',
                full_name: 'Devesh Patel',
                bio: 'Mechanical + embedded systems. I design enclosures that actually fit the first time.',
                location: 'Ahmedabad, India',
                website_url: 'https://devesh.dev',
                field_of_work: ['MECHANICAL', 'IOT'],
                skill_tags: ['fusion360', 'solidworks', 'esp8266', '3d-printing', 'mqtt'],
                current_role: 'Freelancer',
                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devesh',
            },
        }),
        prisma.user.upsert({
            where: { email: 'meera.krishnan@example.com' },
            update: {},
            create: {
                id: 'seed-user-004',
                email: 'meera.krishnan@example.com',
                username: 'meera_ml',
                full_name: 'Meera Krishnan',
                bio: 'PhD student in Robotics. Building the neural network that will fold my laundry.',
                location: 'Chennai, India',
                github_url: 'https://github.com/meera_ml',
                twitter_url: 'https://twitter.com/meera_ml',
                field_of_work: ['AI_ML', 'ROBOTICS', 'SOFTWARE'],
                skill_tags: ['tensorflow', 'pytorch', 'ros2', 'computer-vision', 'python'],
                current_role: 'Researcher',
                institution: 'IIT Madras',
                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
            },
        }),
        prisma.user.upsert({
            where: { email: 'rahul.kumar@example.com' },
            update: {},
            create: {
                id: 'seed-user-005',
                email: 'rahul.kumar@example.com',
                username: 'rahul_iot',
                full_name: 'Rahul Kumar',
                bio: 'IoT consultant. I connect things to the internet that probably don\'t need to be.',
                location: 'Delhi, India',
                github_url: 'https://github.com/rahul_iot',
                linkedin_url: 'https://linkedin.com/in/rahulkumariot',
                field_of_work: ['IOT', 'SOFTWARE', 'ELECTRONICS'],
                skill_tags: ['aws-iot', 'mqtt', 'raspberry-pi', 'node.js', 'influxdb'],
                current_role: 'Engineer',
                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
            },
        }),
    ]);

    console.log(`✅ Created ${users.length} users`);

    // ─── Projects ─────────────────────────────────────────────────────────────
    const projects = await Promise.all([
        prisma.project.upsert({
            where: { id: 'seed-proj-001' },
            update: {},
            create: {
                id: 'seed-proj-001',
                author_id: 'seed-user-001',
                title: 'Self-Balancing Robot with PID Control',
                tagline: 'A two-wheeled robot that balances itself using MPU6050 and Arduino',
                project_type: 'ROBOTICS',
                difficulty: 'INTERMEDIATE',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['arduino', 'pid', 'mpu6050', 'robotics', 'motors'],
                star_count: 47,
                view_count: 1203,
                github_url: 'https://github.com/arjun_builds/self-balancing-robot',
                cover_image_url: 'https://picsum.photos/seed/robot/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-002' },
            update: {},
            create: {
                id: 'seed-proj-002',
                author_id: 'seed-user-001',
                title: 'Custom PCB for ESP32 LoRa Gateway',
                tagline: 'Compact PCB design for a long-range IoT gateway',
                project_type: 'ELECTRONICS',
                difficulty: 'ADVANCED',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['kicad', 'esp32', 'lora', 'pcb', 'iot', 'gateway'],
                star_count: 89,
                view_count: 2341,
                cover_image_url: 'https://picsum.photos/seed/pcb/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-003' },
            update: {},
            create: {
                id: 'seed-proj-003',
                author_id: 'seed-user-002',
                title: '4-bit ALU in Verilog',
                tagline: 'A complete 4-bit Arithmetic Logic Unit implemented in Verilog HDL',
                project_type: 'ELECTRONICS',
                difficulty: 'INTERMEDIATE',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['verilog', 'fpga', 'vlsi', 'digital-design', 'quartus'],
                star_count: 62,
                view_count: 1876,
                github_url: 'https://github.com/priya_circuits/4bit-alu',
                cover_image_url: 'https://picsum.photos/seed/verilog/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-004' },
            update: {},
            create: {
                id: 'seed-proj-004',
                author_id: 'seed-user-002',
                title: 'MNIST Digit Classifier on FPGA',
                tagline: 'Running a trained neural network on an FPGA without a CPU',
                project_type: 'AI_ML',
                difficulty: 'EXPERT',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['fpga', 'machine-learning', 'verilog', 'neural-network', 'mnist'],
                star_count: 134,
                view_count: 3892,
                cover_image_url: 'https://picsum.photos/seed/fpga/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-005' },
            update: {},
            create: {
                id: 'seed-proj-005',
                author_id: 'seed-user-003',
                title: '3D Printed Mechanical Keyboard Case',
                tagline: 'Fully parametric 65% keyboard case designed in Fusion 360',
                project_type: 'MECHANICAL',
                difficulty: 'BEGINNER',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['fusion360', '3d-printing', 'mechanical-keyboard', 'design'],
                star_count: 211,
                view_count: 5432,
                cover_image_url: 'https://picsum.photos/seed/keyboard/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-006' },
            update: {},
            create: {
                id: 'seed-proj-006',
                author_id: 'seed-user-003',
                title: 'Smart Plant Watering System',
                tagline: 'ESP8266 + soil moisture sensors + MQTT + Home Assistant integration',
                project_type: 'IOT',
                difficulty: 'BEGINNER',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['esp8266', 'mqtt', 'home-assistant', 'sensors', 'iot'],
                star_count: 178,
                view_count: 4211,
                cover_image_url: 'https://picsum.photos/seed/plant/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-007' },
            update: {},
            create: {
                id: 'seed-proj-007',
                author_id: 'seed-user-004',
                title: 'Lane Detection with OpenCV on Raspberry Pi',
                tagline: 'Real-time lane detection for a miniature autonomous car',
                project_type: 'AI_ML',
                difficulty: 'INTERMEDIATE',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['opencv', 'raspberry-pi', 'computer-vision', 'python', 'autonomous'],
                star_count: 93,
                view_count: 2678,
                github_url: 'https://github.com/meera_ml/lane-detection',
                cover_image_url: 'https://picsum.photos/seed/lane/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-008' },
            update: {},
            create: {
                id: 'seed-proj-008',
                author_id: 'seed-user-004',
                title: 'ROS2 Navigation Stack for Indoor Robot',
                tagline: 'Complete SLAM + navigation implementation for a differential drive robot',
                project_type: 'ROBOTICS',
                difficulty: 'EXPERT',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['ros2', 'slam', 'lidar', 'navigation', 'python'],
                star_count: 156,
                view_count: 4123,
                cover_image_url: 'https://picsum.photos/seed/ros/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-009' },
            update: {},
            create: {
                id: 'seed-proj-009',
                author_id: 'seed-user-005',
                title: 'IoT Air Quality Monitor',
                tagline: 'PM2.5, CO2, temperature + AWS IoT + Grafana dashboard',
                project_type: 'IOT',
                difficulty: 'INTERMEDIATE',
                status: 'PUBLISHED',
                published_at: new Date(),
                tags: ['aws-iot', 'grafana', 'influxdb', 'air-quality', 'esp32', 'sensors'],
                star_count: 72,
                view_count: 1923,
                cover_image_url: 'https://picsum.photos/seed/airquality/800/450',
            },
        }),
        prisma.project.upsert({
            where: { id: 'seed-proj-010' },
            update: {},
            create: {
                id: 'seed-proj-010',
                author_id: 'seed-user-005',
                title: 'Raspberry Pi NAS with Docker',
                tagline: 'Personal NAS server running on RPi 4B with automated backups',
                project_type: 'SOFTWARE',
                difficulty: 'BEGINNER',
                status: 'DRAFT',
                tags: ['raspberry-pi', 'docker', 'nas', 'self-hosted', 'linux'],
                star_count: 0,
                view_count: 0,
                cover_image_url: 'https://picsum.photos/seed/nas/800/450',
            },
        }),
    ]);

    console.log(`✅ Created ${projects.length} projects`);

    // ─── Sections for project 001 ─────────────────────────────────────────────
    await prisma.projectSection.createMany({
        skipDuplicates: true,
        data: [
            {
                id: 'seed-sec-001',
                project_id: 'seed-proj-001',
                section_type: 'OVERVIEW',
                title: 'Overview',
                content_markdown: '## Self-Balancing Robot\n\nThis project implements a **PID controller** to balance a two-wheeled robot. The MPU6050 IMU provides real-time tilt angle via the complementary filter.',
                order_index: 0,
            },
            {
                id: 'seed-sec-002',
                project_id: 'seed-proj-001',
                section_type: 'BOM',
                title: 'Components',
                content_markdown: 'See the BOM table below for all components.',
                order_index: 1,
            },
            {
                id: 'seed-sec-003',
                project_id: 'seed-proj-001',
                section_type: 'BUILD_STEPS',
                title: 'Build Steps',
                content_markdown: '### Step 1: Chassis Assembly\nCut two acrylic sheets for the base.\n\n### Step 2: Motor Mounting\nMount the motors at 90° to the chassis.\n\n### Step 3: Wiring\nConnect MPU6050 to Arduino via I2C.',
                order_index: 2,
            },
            {
                id: 'seed-sec-004',
                project_id: 'seed-proj-001',
                section_type: 'RESULT',
                title: 'Result',
                content_markdown: 'The robot successfully balances for up to 5 minutes on a flat surface. PID gains: Kp=40, Ki=0, Kd=2.5',
                order_index: 3,
            },
        ],
    });

    // ─── BOM Items ────────────────────────────────────────────────────────────
    await prisma.bOMItem.createMany({
        skipDuplicates: true,
        data: [
            { id: 'seed-bom-001', project_id: 'seed-proj-001', component_name: 'Arduino Nano', quantity: 1, estimated_price: 280, part_number: 'A000005', buy_link: 'https://robu.in', description: 'Main microcontroller', currency: 'INR' },
            { id: 'seed-bom-002', project_id: 'seed-proj-001', component_name: 'MPU6050 IMU', quantity: 1, estimated_price: 120, part_number: 'MPU-6050', buy_link: 'https://robu.in', description: '6-axis accelerometer + gyroscope', currency: 'INR' },
            { id: 'seed-bom-003', project_id: 'seed-proj-001', component_name: 'L298N Motor Driver', quantity: 1, estimated_price: 90, buy_link: 'https://robu.in', description: 'Dual H-bridge motor driver', currency: 'INR' },
            { id: 'seed-bom-004', project_id: 'seed-proj-001', component_name: 'DC Geared Motor 12V', quantity: 2, estimated_price: 350, description: '150 RPM with encoder', currency: 'INR' },
            { id: 'seed-bom-005', project_id: 'seed-proj-001', component_name: 'LiPo Battery 7.4V 2000mAh', quantity: 1, estimated_price: 650, description: 'Main power source', currency: 'INR' },
            // BOM for IoT air quality monitor
            { id: 'seed-bom-006', project_id: 'seed-proj-009', component_name: 'ESP32 Dev Board', quantity: 1, estimated_price: 400, buy_link: 'https://robu.in', currency: 'INR' },
            { id: 'seed-bom-007', project_id: 'seed-proj-009', component_name: 'PMS5003 PM2.5 Sensor', quantity: 1, estimated_price: 1200, description: 'Laser particle counter', currency: 'INR' },
            { id: 'seed-bom-008', project_id: 'seed-proj-009', component_name: 'MH-Z19B CO2 Sensor', quantity: 1, estimated_price: 1800, currency: 'INR' },
            { id: 'seed-bom-009', project_id: 'seed-proj-009', component_name: 'DHT22 Temperature Sensor', quantity: 1, estimated_price: 180, currency: 'INR' },
        ],
    });

    console.log('✅ Created BOM items');

    // ─── Comments ─────────────────────────────────────────────────────────────
    const comments = await prisma.comment.createMany({
        skipDuplicates: true,
        data: [
            { id: 'seed-cmt-001', user_id: 'seed-user-002', project_id: 'seed-proj-001', content: 'Great project! What PID tuning method did you use? Ziegler-Nichols?', upvote_count: 5 },
            { id: 'seed-cmt-002', user_id: 'seed-user-001', project_id: 'seed-proj-001', content: 'I used manual tuning honestly. Started with just Kp and increased until it oscillated, then added Kd.', parent_comment_id: 'seed-cmt-001', upvote_count: 3 },
            { id: 'seed-cmt-003', user_id: 'seed-user-003', project_id: 'seed-proj-001', content: 'Have you tried using a complementary filter vs a full Kalman filter? I\'m curious about the performance difference.', upvote_count: 7 },
            { id: 'seed-cmt-004', user_id: 'seed-user-004', project_id: 'seed-proj-002', content: 'Impressive PCB! What process did you use at JLCPCB? 2-layer or 4-layer?', upvote_count: 4 },
            { id: 'seed-cmt-005', user_id: 'seed-user-005', project_id: 'seed-proj-003', content: 'This is great for learning VLSI. Did you synthesize this on real hardware?', upvote_count: 8 },
            { id: 'seed-cmt-006', user_id: 'seed-user-001', project_id: 'seed-proj-004', content: 'Running a neural net on FPGA without a CPU is impressive. What\'s the inference latency?', upvote_count: 12 },
            { id: 'seed-cmt-007', user_id: 'seed-user-003', project_id: 'seed-proj-005', content: 'The tolerances look really clean. What layer height and infill did you use?', upvote_count: 6 },
            { id: 'seed-cmt-008', user_id: 'seed-user-002', project_id: 'seed-proj-006', content: 'Does the soil moisture sensor drift over time? I\'ve had issues with resistive sensors corroding.', upvote_count: 9 },
            { id: 'seed-cmt-009', user_id: 'seed-user-005', project_id: 'seed-proj-007', content: 'What FPS are you getting on the Pi? Does it struggle at all?', upvote_count: 11 },
            { id: 'seed-cmt-010', user_id: 'seed-user-001', project_id: 'seed-proj-008', content: 'ROS2 nav stack is notoriously hard to tune. How did you handle the costmap configuration?', upvote_count: 14 },
        ],
    });

    console.log(`✅ Created ${comments.count} comments`);

    // ─── Stars ────────────────────────────────────────────────────────────────
    await prisma.star.createMany({
        skipDuplicates: true,
        data: [
            { user_id: 'seed-user-002', project_id: 'seed-proj-001' },
            { user_id: 'seed-user-003', project_id: 'seed-proj-001' },
            { user_id: 'seed-user-004', project_id: 'seed-proj-001' },
            { user_id: 'seed-user-005', project_id: 'seed-proj-001' },
            { user_id: 'seed-user-001', project_id: 'seed-proj-003' },
            { user_id: 'seed-user-003', project_id: 'seed-proj-003' },
            { user_id: 'seed-user-001', project_id: 'seed-proj-004' },
            { user_id: 'seed-user-005', project_id: 'seed-proj-004' },
            { user_id: 'seed-user-001', project_id: 'seed-proj-005' },
            { user_id: 'seed-user-002', project_id: 'seed-proj-007' },
            { user_id: 'seed-user-001', project_id: 'seed-proj-008' },
            { user_id: 'seed-user-003', project_id: 'seed-proj-009' },
        ],
    });

    console.log('✅ Created stars');

    // ─── Follows ──────────────────────────────────────────────────────────────
    await prisma.follow.createMany({
        skipDuplicates: true,
        data: [
            { follower_id: 'seed-user-001', following_id: 'seed-user-002' },
            { follower_id: 'seed-user-001', following_id: 'seed-user-004' },
            { follower_id: 'seed-user-002', following_id: 'seed-user-001' },
            { follower_id: 'seed-user-002', following_id: 'seed-user-004' },
            { follower_id: 'seed-user-003', following_id: 'seed-user-001' },
            { follower_id: 'seed-user-003', following_id: 'seed-user-005' },
            { follower_id: 'seed-user-004', following_id: 'seed-user-002' },
            { follower_id: 'seed-user-005', following_id: 'seed-user-003' },
            { follower_id: 'seed-user-005', following_id: 'seed-user-004' },
        ],
    });

    console.log('✅ Created follows');

    console.log('\n🎉 Seeding complete! Database is ready.\n');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
