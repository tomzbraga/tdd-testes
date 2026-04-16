// ============================================================
// taskManager.js — Regras de negócio do gerenciador de tarefas
// ============================================================

// ------------------------------------------------------------
// Validação
// ------------------------------------------------------------

let _nextId = 1;

/**
 * Reseta o contador de IDs (útil para testes determinísticos).
 */
export function resetId() {
  _nextId = 1;
}

export function validateTitle(title) {
  if (typeof title !== 'string') {
    return false;
  }

  const trimmed = title.trim();
  return trimmed.length >= 3;
}

// ------------------------------------------------------------
// Adição com validação
// ------------------------------------------------------------

export function toggleTask(task) {
  return { ...task, completed: !task.completed };
}

export function removeTask(tasks, taskId) {
  // Retorna um novo array sem a tarefa cujo id corresponde a taskId
  return tasks.filter(task => task.id !== taskId);
}

export function filterTasks(tasks, status) {
  switch (status) {
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'all':
      return [...tasks]; // cópia para garantir imutabilidade
    default:
      return [...tasks]; // fallback para filtros desconhecidos
  }
}

export function countTasks(tasks) {
  return tasks.length;
}

export function countCompleted(tasks) {
  return tasks.filter(task => task.completed).length;
}

export function countPending(tasks) {
  return tasks.filter(task => !task.completed).length;
}

export function validatePriority(priority) {
  return ['low', 'medium', 'high'].includes(priority);
}

export function createTask(title, priority = 'medium') {
  if (!validateTitle(title)) {
    throw new Error('Título inválido: deve ser uma string com pelo menos 3 caracteres.');
  }

  if (!validatePriority(priority)) {
    priority = 'medium'; // fallback para valores inválidos
  }

  return {
    id: _nextId++,
    title: title.trim(),
    completed: false,
    priority
  };

  const task = {
    id: currentId++,
    title: title.trim(),
    completed: false,
    priority
  };
  return task;
}

export function filterByPriority(tasks, priority) {
  if (!validatePriority(priority)) {
    return [...tasks]; // retorna todas se prioridade inválida
  }
  return tasks.filter(task => task.priority === priority);
}

export function isDuplicate(tasks, title) {
  if (typeof title !== 'string') return false;
  const normalized = title.trim().toLowerCase();
  return tasks.some(task => task.title.trim().toLowerCase() === normalized);
}

export function addTask(tasks, title) {
  if (!validateTitle(title)) {
    throw new Error(
      'Título inválido: deve ser uma string com pelo menos 3 caracteres.'
    );
  }

  if (isDuplicate(tasks, title)) {
    throw new Error('Título duplicado');

  const newTask = createTask(title);
  return [...tasks, newTask];
}


  if (isDuplicate(tasks, title)) {
    throw new Error('Título duplicado');
  }

  const newTask = createTask(title);
  return [...tasks, newTask];
}

export function sortTasks(tasks) {
  // Cria uma cópia para garantir imutabilidade
  const copy = [...tasks];
  // Ordena: pendentes (false) primeiro, concluídas (true) depois
  return copy.sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });
}



