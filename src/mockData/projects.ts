/**
 * Mock project data for NetListLab Explore page
 * Generated with realistic project structure and statistics
 */

import { Project, ProjectsResponse } from '../types/project';

// Sample cover images - using placeholder service
const placeholderImage = (id: number) => 
  `https://images.unsplash.com/photo-${1500*id}-?auto=format&fit=crop&w=1200&h=675`;

export const mockProjects: Project[] = [
  {
    id: 'proj_001',
    title: 'ESP32 WiFi Radar Intrusion Detection',
    slug: 'esp32-wifi-radar-intrusion',
    tagline: 'Real-time presence detection using WiFi signal reflection',
    description: 'Advanced IoT system combining ESP32 microcontroller with WiFi radar sensing to detect human presence and movement patterns in indoor environments. Includes ML model for gesture recognition.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_001',
      username: 'tech_wizard',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isFollowedByMe: false,
    },
    domain: 'electronics',
    difficulty: 'Advanced',
    tags: ['ESP32', 'WiFi', 'IoT', 'Radar', 'Signal Processing'],
    stats: {
      stars: 1247,
      views: 4521,
      comments: 34,
      isStarredByMe: false,
    },
    publishedAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-02-20T14:22:00Z',
  },
  {
    id: 'proj_002',
    title: 'Real-time 3D Gesture Recognition System',
    slug: 'realtime-3d-gesture-recognition',
    tagline: 'Hand gesture recognition using stereo vision and ML',
    description: 'Machine learning-powered gesture recognition system using dual camera setup and TensorFlow Lite for real-time processing on edge devices.',
    coverImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_002',
      username: 'ai_enthusiast',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isFollowedByMe: false,
    },
    domain: 'aiml',
    difficulty: 'Advanced',
    tags: ['TensorFlow', 'Computer Vision', 'Edge ML', 'Python'],
    stats: {
      stars: 892,
      views: 3200,
      comments: 21,
      isStarredByMe: false,
    },
    publishedAt: '2026-02-01T08:15:00Z',
    updatedAt: '2026-02-18T11:44:00Z',
  },
  {
    id: 'proj_003',
    title: 'Modular Robotic Arm Control System',
    slug: 'modular-robotic-arm-control',
    tagline: 'Open-source control firmware for 6-DOF robotic manipulator',
    description: 'Complete control system for modular robotic arm with inverse kinematics solver, trajectory planning, and force feedback sensing.',
    coverImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_003',
      username: 'robotics_dev',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isFollowedByMe: false,
    },
    domain: 'robotics',
    difficulty: 'Expert',
    tags: ['ROS', 'Kinematics', 'C++', 'Control Theory'],
    stats: {
      stars: 756,
      views: 2890,
      comments: 18,
      isStarredByMe: false,
    },
    publishedAt: '2026-01-28T14:20:00Z',
    updatedAt: '2026-02-22T09:33:00Z',
  },
  {
    id: 'proj_004',
    title: 'Smart Home Lighting Dashboard',
    slug: 'smart-home-lighting-dashboard',
    tagline: 'React-based control interface for Philips Hue ecosystems',
    description: 'Beautiful, responsive web dashboard for managing smart home lighting with scene creation, automation scheduling, and voice integration.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_004',
      username: 'fullstack_dev',
      avatar: 'https://i.pravatar.cc/150?img=4',
      isFollowedByMe: false,
    },
    domain: 'software',
    difficulty: 'Intermediate',
    tags: ['React', 'TypeScript', 'IoT', 'REST API'],
    stats: {
      stars: 634,
      views: 1950,
      comments: 12,
      isStarredByMe: false,
    },
    publishedAt: '2026-02-05T16:45:00Z',
    updatedAt: '2026-02-19T13:12:00Z',
  },
  {
    id: 'proj_005',
    title: 'Parametric Desk Lamp Design',
    slug: 'parametric-desk-lamp-design',
    tagline: '3D-printable design with adjustable geometry',
    description: 'Fully parametric CAD design of a modern desk lamp optimized for 3D printing. Includes technical drawings, assembly guide, and material analysis.',
    coverImage: 'https://images.unsplash.com/photo-1565636788981-e89fdd4f311b?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_005',
      username: 'cad_designer',
      avatar: 'https://i.pravatar.cc/150?img=5',
      isFollowedByMe: false,
    },
    domain: 'design',
    difficulty: 'Intermediate',
    tags: ['CAD', '3D Printing', 'Fusion360', 'Industrial Design'],
    stats: {
      stars: 521,
      views: 1620,
      comments: 8,
      isStarredByMe: false,
    },
    publishedAt: '2026-01-20T11:30:00Z',
    updatedAt: '2026-02-21T15:50:00Z',
  },
  {
    id: 'proj_006',
    title: 'STM32 BLDC Motor Controller',
    slug: 'stm32-bldc-motor-controller',
    tagline: 'High-performance brushless DC motor control firmware',
    description: 'Optimized motor control firmware for STM32F4 microcontroller with FOC algorithm, supports multiple sensor types and safety features.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_006',
      username: 'firmware_engineer',
      avatar: 'https://i.pravatar.cc/150?img=6',
      isFollowedByMe: false,
    },
    domain: 'electronics',
    difficulty: 'Expert',
    tags: ['Embedded C', 'STM32', 'Motor Control', 'FOC'],
    stats: {
      stars: 1089,
      views: 3800,
      comments: 29,
      isStarredByMe: false,
    },
    publishedAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-02-23T10:15:00Z',
  },
  {
    id: 'proj_007',
    title: 'Mechanical Keyboard Design Kit',
    slug: 'mechanical-keyboard-design-kit',
    tagline: 'Complete open-source 65% keyboard design with hotswap PCB',
    description: 'Comprehensive mechanical keyboard kit featuring custom stabilizers, RGB lighting, programmable firmware, and detailed assembly instructions.',
    coverImage: 'https://images.unsplash.com/photo-1587829191301-dc798b83add3?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_007',
      username: 'keyboard_designer',
      avatar: 'https://i.pravatar.cc/150?img=7',
      isFollowedByMe: false,
    },
    domain: 'mechanical',
    difficulty: 'Intermediate',
    tags: ['PCB Design', 'Keyboard', 'KiCad', 'QMK'],
    stats: {
      stars: 2134,
      views: 6720,
      comments: 67,
      isStarredByMe: false,
    },
    publishedAt: '2025-12-25T12:00:00Z',
    updatedAt: '2026-02-17T08:23:00Z',
  },
  {
    id: 'proj_008',
    title: 'Climate Control Microclimate Research',
    slug: 'climate-control-research',
    tagline: 'Published study on IoT environmental monitoring systems',
    description: 'Peer-reviewed research paper on deploying distributed sensor networks for micro-climate monitoring with analysis of data collection patterns.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_008',
      username: 'research_scientist',
      avatar: 'https://i.pravatar.cc/150?img=8',
      isFollowedByMe: false,
    },
    domain: 'research',
    difficulty: 'Advanced',
    tags: ['IoT', 'Sensor Networks', 'Data Analysis', 'Climate'],
    stats: {
      stars: 445,
      views: 1240,
      comments: 9,
      isStarredByMe: false,
    },
    publishedAt: '2025-11-30T10:00:00Z',
    updatedAt: '2026-02-16T14:30:00Z',
  },
  {
    id: 'proj_009',
    title: 'Vue 3 Component Library',
    slug: 'vue3-component-library',
    tagline: 'Production-ready UI component system with TypeScript',
    description: 'Comprehensive Vue 3 component library with Storybook documentation, automatic changelog generation, and accessibility compliance.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f6?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_009',
      username: 'vue_maintainer',
      avatar: 'https://i.pravatar.cc/150?img=9',
      isFollowedByMe: false,
    },
    domain: 'software',
    difficulty: 'Intermediate',
    tags: ['Vue3', 'TypeScript', 'Storybook', 'Components'],
    stats: {
      stars: 678,
      views: 2340,
      comments: 15,
      isStarredByMe: false,
    },
    publishedAt: '2026-01-05T13:20:00Z',
    updatedAt: '2026-02-15T11:45:00Z',
  },
  {
    id: 'proj_010',
    title: 'Miniature Solar Panel Tracker',
    slug: 'miniature-solar-panel-tracker',
    tagline: 'Dual-axis sun-tracking system for solar experiments',
    description: 'Educational project demonstrating dual-axis solar tracking with light sensors, servo motors, and efficiency measurement system.',
    coverImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_010',
      username: 'solar_hacker',
      avatar: 'https://i.pravatar.cc/150?img=10',
      isFollowedByMe: false,
    },
    domain: 'electronics',
    difficulty: 'Beginner',
    tags: ['Arduino', 'Solar', 'Servo Motors', 'Prototyping'],
    stats: {
      stars: 389,
      views: 890,
      comments: 5,
      isStarredByMe: false,
    },
    publishedAt: '2026-02-10T15:30:00Z',
    updatedAt: '2026-02-20T12:10:00Z',
  },
  {
    id: 'proj_011',
    title: 'Deep Learning Image Segmentation',
    slug: 'deep-learning-image-segmentation',
    tagline: 'State-of-the-art medical image segmentation with PyTorch',
    description: 'Implementation of advanced U-Net architecture for semantic segmentation in medical imaging with pre-trained weights and inference pipeline.',
    coverImage: 'https://images.unsplash.com/photo-1551431009-381d36ac3a14?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_011',
      username: 'ml_researcher',
      avatar: 'https://i.pravatar.cc/150?img=11',
      isFollowedByMe: false,
    },
    domain: 'aiml',
    difficulty: 'Expert',
    tags: ['PyTorch', 'Deep Learning', 'Medical Imaging', 'U-Net'],
    stats: {
      stars: 923,
      views: 2950,
      comments: 24,
      isStarredByMe: false,
    },
    publishedAt: '2026-01-18T09:45:00Z',
    updatedAt: '2026-02-14T16:22:00Z',
  },
  {
    id: 'proj_012',
    title: 'Autonomous Wheeled Robot Platform',
    slug: 'autonomous-wheeled-robot',
    tagline: 'ROS-based mobile robot with SLAM and autonomous navigation',
    description: 'Complete autonomous mobile robot platform with LiDAR SLAM, path planning, obstacle avoidance, and distributed control architecture.',
    coverImage: 'https://images.unsplash.com/photo-1485579149c0-123dd979885f?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_012',
      username: 'robotics_master',
      avatar: 'https://i.pravatar.cc/150?img=12',
      isFollowedByMe: false,
    },
    domain: 'robotics',
    difficulty: 'Expert',
    tags: ['ROS', 'SLAM', 'LiDAR', 'Path Planning'],
    stats: {
      stars: 1456,
      views: 4230,
      comments: 42,
      isStarredByMe: false,
    },
    publishedAt: '2025-12-15T11:00:00Z',
    updatedAt: '2026-02-13T13:50:00Z',
  },
  {
    id: 'proj_013',
    title: 'Modular Home Server NAS',
    slug: 'modular-home-server-nas',
    tagline: 'DIY network storage with redundancy and mobile access',
    description: 'Custom-built home NAS server with RAID configuration, automated backup system, and secure remote access capabilities.',
    coverImage: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_013',
      username: 'sysadmin_builder',
      avatar: 'https://i.pravatar.cc/150?img=13',
      isFollowedByMe: false,
    },
    domain: 'software',
    difficulty: 'Intermediate',
    tags: ['Linux', 'NAS', 'Storage', 'Networking'],
    stats: {
      stars: 512,
      views: 1680,
      comments: 10,
      isStarredByMe: false,
    },
    publishedAt: '2026-02-08T14:15:00Z',
    updatedAt: '2026-02-12T10:30:00Z',
  },
  {
    id: 'proj_014',
    title: 'Haptic Feedback Wearable Glove',
    slug: 'haptic-feedback-wearable-glove',
    tagline: 'Wireless wearable with distributed actuators for tactile feedback',
    description: 'Advanced wearable haptic device using ERM motors with wireless control, gesture recognition, and immersive feedback patterns.',
    coverImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_014',
      username: 'wearable_dev',
      avatar: 'https://i.pravatar.cc/150?img=14',
      isFollowedByMe: false,
    },
    domain: 'electronics',
    difficulty: 'Advanced',
    tags: ['Haptics', 'Wearables', 'Wireless', 'Arduino'],
    stats: {
      stars: 678,
      views: 2100,
      comments: 14,
      isStarredByMe: false,
    },
    publishedAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-02-11T15:42:00Z',
  },
  {
    id: 'proj_015',
    title: 'Industrial UI Design System',
    slug: 'industrial-ui-design-system',
    tagline: 'Figma-based design system for factory automation interfaces',
    description: 'Comprehensive design system with 500+ components optimized for industrial touchscreen interfaces with accessibility guidelines.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_015',
      username: 'design_system_lead',
      avatar: 'https://i.pravatar.cc/150?img=15',
      isFollowedByMe: false,
    },
    domain: 'design',
    difficulty: 'Intermediate',
    tags: ['Figma', 'Design System', 'UI/UX', 'Accessibility'],
    stats: {
      stars: 445,
      views: 1450,
      comments: 9,
      isStarredByMe: false,
    },
    publishedAt: '2026-01-30T12:30:00Z',
    updatedAt: '2026-02-10T09:20:00Z',
  },
  {
    id: 'proj_016',
    title: 'Quantum Simulation Framework',
    slug: 'quantum-simulation-framework',
    tagline: 'Educational quantum computing simulator with visual debugger',
    description: 'Interactive quantum circuit simulator built with Python and WebGL for educational purposes, supporting major quantum gates and measurements.',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e5b94fbb133f?auto=format&fit=crop&w=1200&h=675',
    author: {
      id: 'user_016',
      username: 'quantum_dev',
      avatar: 'https://i.pravatar.cc/150?img=16',
      isFollowedByMe: false,
    },
    domain: 'research',
    difficulty: 'Advanced',
    tags: ['Quantum Computing', 'Python', 'WebGL', 'Physics'],
    stats: {
      stars: 567,
      views: 1890,
      comments: 11,
      isStarresByMe: false,
    },
    publishedAt: '2026-01-12T14:00:00Z',
    updatedAt: '2026-02-09T11:33:00Z',
  },
];

// Mock function to fetch projects with filtering and pagination
export function getMockProjects(params: {
  domains?: string[];
  difficulty?: string;
  tags?: string[];
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}): ProjectsResponse {
  const {
    domains = [],
    difficulty = null,
    tags = [],
    sort = 'trending',
    search = '',
    page = 1,
    limit = 12,
  } = params;

  let filtered = [...mockProjects];

  // Domain filter
  if (domains.length > 0) {
    filtered = filtered.filter(p => domains.includes(p.domain));
  }

  // Difficulty filter
  if (difficulty) {
    filtered = filtered.filter(p => p.difficulty === difficulty);
  }

  // Tag filter (match at least one tag)
  if (tags.length > 0) {
    filtered = filtered.filter(p =>
      tags.some(tag => p.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()))
    );
  }

  // Search filter (title, tagline, tags)
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  const sorted = [...filtered];
  switch (sort) {
    case 'latest':
      sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      break;
    case 'most-starred':
      sorted.sort((a, b) => b.stats.stars - a.stats.stars);
      break;
    case 'most-viewed':
      sorted.sort((a, b) => b.stats.views - a.stats.views);
      break;
    case 'trending':
    default:
      // Trending: combines stars, views, and recency
      sorted.sort((a, b) => {
        const scoreA = a.stats.stars * 0.4 + a.stats.views * 0.4 + (Date.now() - new Date(a.publishedAt).getTime()) / 1000000 * 0.2;
        const scoreB = b.stats.stars * 0.4 + b.stats.views * 0.4 + (Date.now() - new Date(b.publishedAt).getTime()) / 1000000 * 0.2;
        return scoreB - scoreA;
      });
  }

  // Pagination
  const total = sorted.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = sorted.slice(start, end);

  // Extract facets from original data (not filtered)
  const allDomains = [...new Map(
    mockProjects
      .filter(p => domains.length === 0 || domains.includes(p.domain))
      .map(p => [p.domain, true])
  ).keys()];

  const facetDomains = [
    { name: 'Electronics', count: mockProjects.filter(p => p.domain === 'electronics').length, emoji: '⚡' },
    { name: 'Software', count: mockProjects.filter(p => p.domain === 'software').length, emoji: '💻' },
    { name: 'Mechanical', count: mockProjects.filter(p => p.domain === 'mechanical').length, emoji: '⚙️' },
    { name: 'Design', count: mockProjects.filter(p => p.domain === 'design').length, emoji: '🎨' },
    { name: 'AI/ML', count: mockProjects.filter(p => p.domain === 'aiml').length, emoji: '🧠' },
    { name: 'Robotics', count: mockProjects.filter(p => p.domain === 'robotics').length, emoji: '🤖' },
    { name: 'Research', count: mockProjects.filter(p => p.domain === 'research').length, emoji: '🔬' },
  ];

  const difficulties = [
    { name: 'Beginner' as const, count: mockProjects.filter(p => p.difficulty === 'Beginner').length },
    { name: 'Intermediate' as const, count: mockProjects.filter(p => p.difficulty === 'Intermediate').length },
    { name: 'Advanced' as const, count: mockProjects.filter(p => p.difficulty === 'Advanced').length },
    { name: 'Expert' as const, count: mockProjects.filter(p => p.difficulty === 'Expert').length },
  ];

  const allTags = new Map<string, number>();
  mockProjects.forEach(p => {
    p.tags.forEach(tag => {
      allTags.set(tag, (allTags.get(tag) || 0) + 1);
    });
  });

  const topTags = Array.from(allTags.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return {
    success: true,
    data: {
      projects: paginated,
      pagination: {
        total,
        page,
        limit,
        hasMore: end < total,
        totalPages: Math.ceil(total / limit),
      },
      facets: {
        domains: facetDomains,
        difficulties,
        topTags,
      },
    },
    meta: {
      executionTime: Math.random() * 100 + 50,
    },
  };
}
