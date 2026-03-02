import { useAgentMonitor, type Agent, type Task, type LogEntry } from './hooks/useAgentMonitor';

function App() {
  const { agents, tasks, logs, stats } = useAgentMonitor();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'idle': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      case 'pending': return 'bg-gray-400';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400 bg-blue-400/10';
      case 'warn': return 'text-yellow-400 bg-yellow-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      case 'success': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Agent Teams 监控看板
                </h1>
                <p className="text-slate-400 text-sm">实时监控你的智能体团队</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-slate-300">实时更新中</span>
              </div>
              <div className="text-slate-400 text-sm">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:border-violet-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Agent 总数</p>
                <p className="text-3xl font-bold">{stats.totalAgents}</p>
              </div>
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center text-2xl">
                🤖
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-400">{stats.onlineAgents} 在线</span>
              <span className="text-slate-500">·</span>
              <span className="text-yellow-400">{stats.busyAgents} 忙碌</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">进行中任务</p>
                <p className="text-3xl font-bold">{stats.inProgressTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                🔄
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-400">
              共 {stats.totalTasks} 个任务
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:border-green-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">已完成任务</p>
                <p className="text-3xl font-bold">{stats.completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
            <div className="mt-3 text-sm text-green-400">
              完成率 {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">待处理任务</p>
                <p className="text-3xl font-bold">{stats.pendingTasks}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl">
                📋
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-400">
              {stats.failedTasks > 0 && (
                <span className="text-red-400 mr-2">{stats.failedTasks} 失败</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span>🤖</span> Agent 列表
                </h2>
                <span className="text-sm text-slate-400">{agents.length} 个智能体</span>
              </div>
              <div className="divide-y divide-slate-700">
                {agents.map(agent => (
                  <div key={agent.id} className="px-6 py-4 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        🤖
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{agent.name}</h3>
                            <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                              {agent.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(agent.status)}`}></span>
                            <span className="text-sm capitalize">{agent.status}</span>
                          </div>
                        </div>
                        {agent.currentTask && (
                          <p className="text-slate-400 text-sm mb-3 truncate">
                            🔸 {agent.currentTask}
                          </p>
                        )}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">CPU</span>
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all"
                                style={{ width: `${agent.cpuUsage}%` }}
                              ></div>
                            </div>
                            <span className="text-slate-400">{Math.round(agent.cpuUsage)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">内存</span>
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                                style={{ width: `${agent.memoryUsage}%` }}
                              ></div>
                            </div>
                            <span className="text-slate-400">{Math.round(agent.memoryUsage)}%</span>
                          </div>
                          <div className="text-slate-500 ml-auto">
                            完成 {agent.tasksCompleted} 任务 · 平均 {Math.round(agent.avgResponseTime)}ms
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span>📋</span> 任务列表
                </h2>
              </div>
              <div className="divide-y divide-slate-700">
                {tasks.map(task => (
                  <div key={task.id} className="px-6 py-4 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${getStatusColor(task.status)}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{task.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                          {task.assignedAgent && (
                            <span className="text-sm text-slate-400">
                              @ {agents.find(a => a.id === task.assignedAgent)?.name}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>创建于 {task.createdAt.toLocaleString()}</span>
                          {task.startedAt && <span>开始于 {task.startedAt.toLocaleString()}</span>}
                          {task.completedAt && <span>完成于 {task.completedAt.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span>📝</span> 实时日志
              </h2>
              <span className="text-sm text-slate-400">最近 50 条</span>
            </div>
            <div className="p-4 h-[600px] overflow-y-auto space-y-3">
              {logs.map(log => (
                <div key={log.id} className="text-sm">
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${getLogLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-200">{log.message}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{log.timestamp.toLocaleTimeString()}</span>
                        {log.agentId && (
                          <span>@{agents.find(a => a.id === log.agentId)?.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
