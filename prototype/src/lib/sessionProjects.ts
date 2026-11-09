import type { Project } from '../types';

/**
 * Projects created during this session (from Projects or from Roles & Succession).
 * The Projects view reads these on mount so a project created elsewhere is there when you land on it.
 */
let created: Project[] = [];

export const addSessionProject = (project: Project) => {
  created = [project, ...created.filter(p => p.id !== project.id)];
};

export const getSessionProjects = (): Project[] => created;
