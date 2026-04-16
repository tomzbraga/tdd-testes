import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateTitle,
  createTask,
  addTask,
  resetId,
  toggleTask,
  removeTask 
} from '../src/taskManager.js';

// ============================================================
// 1. validateTitle
// ============================================================
describe('validateTitle', () => {
  it('deve retornar true para um título válido', () => {
    expect(validateTitle('Estudar Vitest')).toBe(true);
  });

  it('deve retornar true para título com exatamente 3 caracteres', () => {
    expect(validateTitle('abc')).toBe(true);
  });

  it('deve retornar false para string vazia', () => {
    expect(validateTitle('')).toBe(false);
  });

  it('deve retornar false para string com apenas espaços', () => {
    expect(validateTitle('   ')).toBe(false);
  });

  it('deve retornar false para título com menos de 3 caracteres', () => {
    expect(validateTitle('ab')).toBe(false);
  });

  it('deve retornar false para null', () => {
    expect(validateTitle(null)).toBe(false);
  });

  it('deve retornar false para undefined', () => {
    expect(validateTitle(undefined)).toBe(false);
  });

  it('deve retornar false para número', () => {
    expect(validateTitle(123)).toBe(false);
  });

  it('deve retornar false para booleano', () => {
    expect(validateTitle(true)).toBe(false);
  });

  it('deve retornar false para array', () => {
    expect(validateTitle(['tarefa'])).toBe(false);
  });

  it('deve considerar o título após trim', () => {
    expect(validateTitle('  abc  ')).toBe(true);
  });
});

// ============================================================
// 2. createTask
// ============================================================
describe('createTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve criar uma tarefa com as propriedades corretas', () => {
    const task = createTask('Estudar TDD');

    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title', 'Estudar TDD');
    expect(task).toHaveProperty('completed', false);
  });

  it('deve atribuir IDs incrementais', () => {
    const task1 = createTask('Tarefa 1');
    const task2 = createTask('Tarefa 2');

    expect(task2.id).toBe(task1.id + 1);
  });

  it('deve iniciar com completed = false', () => {
    const task = createTask('Nova tarefa');

    expect(task.completed).toBe(false);
  });

  it('deve fazer trim do título', () => {
    const task = createTask('  Título com espaços  ');

    expect(task.title).toBe('Título com espaços');
  });
});

// ============================================================
// 3. addTask
// ============================================================
describe('addTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve adicionar uma tarefa a uma lista vazia', () => {
    const tasks = addTask([], 'Primeira tarefa');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Primeira tarefa');
  });

  it('deve adicionar uma tarefa a uma lista existente', () => {
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');

    expect(tasks).toHaveLength(2);
    expect(tasks[1].title).toBe('Tarefa 2');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const original = [];
    const updated = addTask(original, 'Nova tarefa');

    expect(updated).not.toBe(original);
    expect(original).toHaveLength(0);
  });

  it('deve lançar erro para título vazio', () => {
    expect(() => addTask([], '')).toThrow('Título inválido');
  });

  it('deve lançar erro para título null', () => {
    expect(() => addTask([], null)).toThrow('Título inválido');
  });

  it('deve lançar erro para título undefined', () => {
    expect(() => addTask([], undefined)).toThrow('Título inválido');
  });

  it('deve lançar erro para título com menos de 3 caracteres', () => {
    expect(() => addTask([], 'ab')).toThrow('Título inválido');
  });

  it('deve lançar erro para título numérico', () => {
    expect(() => addTask([], 42)).toThrow('Título inválido');
  });
});

// ============================================================
// 4. toggleTask
// ============================================================
describe('toggleTask', () => {
  it('Tarefa pendente (completed: false) deve virar concluída (completed: true)', () => {
    const original = { id: 1, title: 'tarefa', completed: false };
    const result = toggleTask(original);

    expect(result.completed).toBe(true);
  });

  it('Tarefa concluída deve voltar a pendente', () => {
    const original = { id: 2, title: 'tarefa2', completed: true };
    const result = toggleTask(original);

    expect(result.completed).toBe(false);
  });

  it('Deve manter id e title inalterados', () => {
    const original = { id: 3, title: 'tarefa3', completed: false };
    const result = toggleTask(original);

    expect(result.id).toBe(original.id);
    expect(result.title).toBe(original.title);
  });

  it('Deve retornar um novo objeto (imutabilidade) — o original não muda', () => {
    const original = { id: 4, title: 'tarefa4', completed: false };
    const result = toggleTask(original);

    expect(result).not.toBe(original); // novo objeto
    expect(original.completed).toBe(false); // original intacto
  });
});

// ============================================================
// 5. removeTask
// ============================================================
describe('removeTask', () => {
  it('Remove a tarefa correta pelo ID', () => {
    const tasks = [
      { id: 1, title: 'Estudar', completed: false },
      { id: 2, title: 'Treinar', completed: true }
    ];
    const result = removeTask(tasks, 1);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('Mantém as outras tarefas intactas', () => {
    const tasks = [
      { id: 1, title: 'Estudar', completed: false },
      { id: 2, title: 'Treinar', completed: true },
      { id: 3, title: 'Ler', completed: false }
    ];
    const result = removeTask(tasks, 2);

    expect(result).toHaveLength(2);
    expect(result.find(t => t.id === 1)).toBeDefined();
    expect(result.find(t => t.id === 3)).toBeDefined();
  });

  it('Retorna um novo array (imutabilidade)', () => {
    const tasks = [
      { id: 1, title: 'Estudar', completed: false }
    ];
    const result = removeTask(tasks, 1);

    expect(result).not.toBe(tasks);
    expect(tasks).toHaveLength(1); // original intacto
  });

  it('ID inexistente retorna a lista completa', () => {
    const tasks = [
      { id: 1, title: 'Estudar', completed: false }
    ];
    const result = removeTask(tasks, 99);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('Lista vazia retorna array vazio', () => {
    const tasks = [];
    const result = removeTask(tasks, 1);

    expect(result).toEqual([]);
  });
});

// ============================================================
// 6. filterTasks
// ============================================================
describe('filterTasks', () => {
  const tasks = [
    { id: 1, title: 'Estudar', completed: false },
    { id: 2, title: 'Treinar', completed: true },
    { id: 3, title: 'Ler', completed: false }
  ];

  it("Filtro 'all' retorna todas", () => {
    const result = filterTasks(tasks, 'all');
    expect(result).toHaveLength(3);
  });

  it("Filtro 'pending' retorna apenas pendentes", () => {
    const result = filterTasks(tasks, 'pending');
    expect(result).toHaveLength(2);
    expect(result.every(t => t.completed === false)).toBe(true);
  });

  it("Filtro 'completed' retorna apenas concluídas", () => {
    const result = filterTasks(tasks, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });

  it("Filtro desconhecido retorna todas (default)", () => {
    const result = filterTasks(tasks, 'qualquer');
    expect(result).toHaveLength(3);
  });

  it("Lista vazia retorna array vazio", () => {
    const result = filterTasks([], 'all');
    expect(result).toEqual([]);
  });

  it("Retorna um novo array (imutabilidade)", () => {
    const result = filterTasks(tasks, 'all');
    expect(result).not.toBe(tasks);
  });
});
