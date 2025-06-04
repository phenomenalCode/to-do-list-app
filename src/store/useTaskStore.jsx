import { create } from 'zustand';


const load = (key)  => JSON.parse(localStorage.getItem(key)) || [];
const save = (key,data) => localStorage.setItem(key, JSON.stringify(data));

export const useTaskStore = create((set, get) => ({

  /* ---------- STATE ---------- */
  tasks    : load('tasks'),
  projects : load('projects'),

  /* ---------- TASK ACTIONS ---------- */
  addTask: (task) => {
    const newTask = {
      ...task,
      id        : Date.now(),
      completed : false,
      createdAt : new Date().toISOString(),
    };
    const tasks = [...get().tasks, newTask];
    save('tasks', tasks);
    set({ tasks });
    get().updateProjectCompletion(newTask.projectId);
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter(t => t.id !== id);
    save('tasks', tasks);
    set({ tasks });
  },

  toggleTaskCompletion: (id) => {
    const tasks = get().tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    save('tasks', tasks);
    set({ tasks });

    const task = tasks.find(t => t.id === id);
    if (task?.projectId) get().updateProjectCompletion(task.projectId);
  },

  completeAllTasks: () => {
    const tasks = get().tasks.map(t => ({ ...t, completed: true }));
    save('tasks', tasks);
    set({ tasks });

    // refresh every linked project’s status
    [...new Set(tasks.map(t => t.projectId).filter(Boolean))]
      .forEach(pid => get().updateProjectCompletion(pid));
  },

  /* ---------- TASK QUERIES ---------- */
  filterTasks: (status = 'all', afterDate = null) => {
    let filtered = get().tasks;

    if (status === 'completed')   filtered = filtered.filter(t => t.completed);
    if (status === 'uncompleted') filtered = filtered.filter(t => !t.completed);

    if (afterDate) {
      const after = new Date(afterDate);
      filtered = filtered.filter(t => new Date(t.createdAt) > after);
    }

    return filtered;
  },

  /* ---------- PROJECT ACTIONS ---------- */
  addProject: (project) => {
    const projects = [...get().projects, project];
    save('projects', projects);
    set({ projects });
  },

  /** Delete a project, and detach any tasks that belonged to it */
  deleteProject: (projectId) => {
    // 1️⃣  remove the project
    const projects = get().projects.filter(p => p.id !== projectId);
    save('projects', projects);
    set({ projects });

    // 2️⃣  detach tasks – keep them but clear their projectId
    const tasks = get().tasks.map(t =>
      t.projectId === projectId ? { ...t, projectId: null } : t
    );
    save('tasks', tasks);
    set({ tasks });
  },

  /** Re-evaluate a project’s “completed” flag whenever one of its tasks changes */
  updateProjectCompletion: (projectId) => {
    if (!projectId) return;

    const tasks = get().tasks;
    const allComplete = tasks
      .filter(t => t.projectId === projectId)
      .every(t => t.completed);

    const projects = get().projects.map(p =>
      p.id === projectId ? { ...p, completed: allComplete } : p
    );
    save('projects', projects);
    set({ projects });
  },

  /* ---------- HELPERS ---------- */
  isOverdue: (task) =>
    !!task.dueDate && !task.completed && new Date(task.dueDate) < new Date(),

}));
