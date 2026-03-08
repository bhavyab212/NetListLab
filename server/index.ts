import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Health routes (no auth, no prefix)
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'NetListLab API is running',
        version: '1.0.0'
    })
})

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
})

// API Routes
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import sectionRoutes from './routes/sections'
import bomRoutes from './routes/bom'
import starRoutes from './routes/stars'
import followRoutes from './routes/follows'
import commentRoutes from './routes/comments'
import notificationRoutes from './routes/notifications'
import forkRoutes from './routes/forks'
import uploadRoutes from './routes/upload'

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/sections', sectionRoutes)
app.use('/api/bom', bomRoutes)
app.use('/api/stars', starRoutes)
app.use('/api/follows', followRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/forks', forkRoutes)
app.use('/api/upload', uploadRoutes)

// 404 handler — MUST be last
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// Global error handler — MUST be after 404
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    })
})

app.listen(PORT, () => {
    console.log(`NetListLab API running on port ${PORT}`)
})

export default app
