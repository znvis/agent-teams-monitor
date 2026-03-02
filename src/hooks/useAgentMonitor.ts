import { useState, useEffect } from 'react';

// 类型定义
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

// 初始模拟数据
const initialAgents: Agent[] = [
  {
    id: 'agent-1',
    name: '研究助手',
    role: 'Researcher',
    status: 'busy',
    currentTask: '分析最新的 AI 论文',
    lastSeen: new Date(),
    tasksCompleted: 142,
    avgResponseTime: 1200,
    cpuUsage: 72,
    memoryUsage: 58,
  },
  {
    id: 'agent-2',
    name: '代码工程师',
    role: 'Coder',
    status: 'online',
    currentTask: undefined,
    lastSeen: new Date(),
    tasksCompleted: 289,
    avgResponseTime: 890,
    cpuUsage: 23,
    memoryUsage: 41,
  },
  {
    id: 'agent-3',
    name: '测试员',
    role: 'Tester',
    status: 'idle',
    currentTask: '等待新任务',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    tasksCompleted: 98,
    avgResponseTime: 1500,
    cpuUsage: 12,
    memoryUsage: 28,
  },
  {
    id: 'agent-4',
    name: '文档助手',
    role: 'Writer',
    status: 'offline',
    currentTask: undefined,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tasksCompleted: 76,
    avgResponseTime: 2100,
    cpuUsage: 0,
    memoryUsage: 0,
  },
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: '实现用户认证模块',
    description: '使用 JWT 实现登录注册功能',
    status: 'in-progress',
    assignedAgent: 'agent-2',
    priority: 'high',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    startedAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'task-2',
    title: '调研向量数据库方案',
    description: '对比 Pinecone, Weaviate, Milvus 的优缺点',
    status: 'in-progress',
    assignedAgent: 'agent-1',
    priority: 'medium',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    startedAt: new Date(Date.now() - 90 * 60 * 1000),
  },
  {
    id: 'task-3',
    title: '编写 API 文档',
    description: '为 v2 版本的 API 生成完整文档',
    status: 'pending',
    assignedAgent: undefined,
    priority: 'low',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'task-4',
    title: '修复支付模块 bug',
    description: '部分用户支付后订单状态未更新',
    status: 'completed',
    assignedAgent: 'agent-2',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

const initialLogs: LogEntry[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 2 * 60 * 1000), level: 'info', message: 'Agent 研究助手开始处理任务', agentId: 'agent-1', taskId: 'task-2' },
  { id: 'log-2', timestamp: new Date(Date.now() - 5 * 60 * 1000), level: 'success', message: '任务 修复支付模块 bug 已完成', agentId: 'agent-2', taskId: 'task-4' },
  { id: 'log-3', timestamp: new Date(Date.now() - 10 * 60 * 1000), level: 'warn', message: 'Agent 文档助手心跳超时，标记为离线', agentId: 'agent-4' },
  { id: 'log-4', timestamp: new Date(Date.now() - 15 * 60 * 1000), level: 'info', message: '新任务已分配给 代码工程师', agentId: 'agent-2', taskId: 'task-1' },
  { id: 'log-5', timestamp: new Date(Date.now() - 20 * 60 * 1000), level: 'error', message: '任务执行失败：网络连接超时', agentId: 'agent-3', taskId: 'task-5' },
];

export const useAgentMonitor = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  // 模拟实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      // 更新 agent 状态
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'offline') return agent;
        return {
          ...agent,
          lastSeen: new Date(),
          cpuUsage: Math.max(5, Math.min(95, agent.cpuUsage + (Math.random() - 0.5) * 10)),
          memoryUsage: Math.max(10, Math.min(90, agent.memoryUsage + (Math.random() - 0.5) * 5)),
        };
      }));

      // 随机添加新日志
      if (Math.random() < 0.3) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        const levels: LogEntry['level'][] = ['info', 'warn', 'error', 'success'];
        const newLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date(),
          level: levels[Math.floor(Math.random() * levels.length)],
          message: `Agent ${randomAgent.name} 活动记录`,
          agentId: randomAgent.id,
          taskId: randomTask.id,
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [agents, tasks]);

  // 统计数据
  const stats = {
    totalAgents: agents.length,
    onlineAgents: agents.filter(a => a.status !== 'offline').length,
    busyAgents: agents.filter(a => a.status === 'busy').length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    failedTasks: tasks.filter(t => t.status === 'failed').length,
  };

  return { agents, tasks, logs, stats };
};
