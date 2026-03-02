export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy' | 'idle';
  currentTask?: string;
  lastSeen: Date;
  tasksCompleted: number;
  avgResponseTime: number; // ms
  cpuUsage: number; // 0-100
  memoryUsage: number; // 0-100
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignedAgent?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  agentId?: string;
  taskId?: string;
}
