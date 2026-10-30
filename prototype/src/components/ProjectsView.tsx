import React, { useState } from 'react';
import { Project } from '../types';
import { mockProjects } from '../data/mockData';
import { ProjectsList } from './ProjectsList';
import { ExecutiveSearchProjectDetail } from './ExecutiveSearchProjectDetail';
import { useRouter } from '../context/RouterContext';

export function ProjectsView() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  
  const selectedProjectId = router.projectId;
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  const handleAddProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    router.setProjectId(newProject.id);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  if (selectedProject) {
    return (
      <ExecutiveSearchProjectDetail 
        project={selectedProject} 
        onBack={() => router.setProjectId(null)}
        onUpdateProject={handleUpdateProject}
      />
    );
  }

  return (
    <ProjectsList 
      projects={projects} 
      onSelectProject={(p) => router.setProjectId(p.id)}
      onAddProject={handleAddProject}
    />
  );
}
