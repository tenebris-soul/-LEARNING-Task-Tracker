import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { API_BASE_URL, api } from "./api";

function App() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [userName, setUserName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskSearch, setTaskSearch] = useState("");

  const [usersLoading, setUsersLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [submittingProject, setSubmittingProject] = useState(false);
  const [submittingTask, setSubmittingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [notice, setNotice] = useState(null);

  const deferredTaskSearch = useDeferredValue(taskSearch.trim().toLowerCase());
  const visibleTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(deferredTaskSearch)
  );

  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const openTasks = tasks.length - completedTasks;
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId === null) {
      setProjects([]);
      setSelectedProjectId(null);
      setTasks([]);
      return;
    }

    setSelectedProjectId(null);
    setTasks([]);
    loadProjects(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId === null || selectedProjectId === null) {
      setTasks([]);
      return;
    }

    setTasks([]);
    loadTasks(selectedUserId, selectedProjectId);
  }, [selectedUserId, selectedProjectId]);

  async function loadUsers(preferredUserId = null) {
    setUsersLoading(true);

    try {
      const nextUsers = await api.getUsers();
      setUsers(nextUsers);
      clearNotice();

      startTransition(() => {
        const currentUserStillExists = nextUsers.some((user) => user.id === selectedUserId);
        const nextSelectedUserId =
          preferredUserId ??
          (currentUserStillExists ? selectedUserId : nextUsers[0]?.id ?? null);

        setSelectedUserId(nextSelectedUserId);
      });
    } catch (error) {
      showError(error.message);
    } finally {
      setUsersLoading(false);
    }
  }

  async function loadProjects(userId, preferredProjectId = null) {
    setProjectsLoading(true);

    try {
      const nextProjects = await api.getProjects(userId);
      setProjects(nextProjects);
      clearNotice();

      startTransition(() => {
        const currentProjectStillExists = nextProjects.some(
          (project) => project.id === selectedProjectId
        );
        const nextSelectedProjectId =
          preferredProjectId ??
          (currentProjectStillExists ? selectedProjectId : nextProjects[0]?.id ?? null);

        setSelectedProjectId(nextSelectedProjectId);
      });
    } catch (error) {
      showError(error.message);
    } finally {
      setProjectsLoading(false);
    }
  }

  async function loadTasks(userId, projectId) {
    setTasksLoading(true);

    try {
      const nextTasks = await api.getTasks(userId, projectId);
      setTasks(nextTasks);
      clearNotice();
    } catch (error) {
      showError(error.message);
    } finally {
      setTasksLoading(false);
    }
  }

  async function handleCreateUser(event) {
    event.preventDefault();

    if (!userName.trim()) {
      showError("User name is required.");
      return;
    }

    setSubmittingUser(true);

    try {
      const createdUser = await api.createUser(userName.trim());
      setUserName("");
      await loadUsers(createdUser.id);
      showSuccess("User created.");
    } catch (error) {
      showError(error.message);
    } finally {
      setSubmittingUser(false);
    }
  }

  async function handleCreateProject(event) {
    event.preventDefault();

    if (selectedUserId === null) {
      showError("Select a user before creating a project.");
      return;
    }

    if (!projectName.trim()) {
      showError("Project name is required.");
      return;
    }

    setSubmittingProject(true);

    try {
      const createdProject = await api.createProject(selectedUserId, {
        name: projectName.trim(),
        description: projectDescription.trim()
      });

      setProjectName("");
      setProjectDescription("");
      await loadProjects(selectedUserId, createdProject.id);
      showSuccess("Project created.");
    } catch (error) {
      showError(error.message);
    } finally {
      setSubmittingProject(false);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();

    if (selectedUserId === null || selectedProjectId === null) {
      showError("Select a project before creating a task.");
      return;
    }

    if (!taskDescription.trim()) {
      showError("Task description is required.");
      return;
    }

    setSubmittingTask(true);

    try {
      await api.createTask(selectedUserId, selectedProjectId, taskDescription.trim());
      setTaskDescription("");
      await loadTasks(selectedUserId, selectedProjectId);
      showSuccess("Task created.");
    } catch (error) {
      showError(error.message);
    } finally {
      setSubmittingTask(false);
    }
  }

  async function handleToggleTask(task) {
    if (selectedUserId === null || selectedProjectId === null) {
      return;
    }

    setUpdatingTaskId(task.id);

    try {
      await api.updateTaskCompletion(
        selectedUserId,
        selectedProjectId,
        task.id,
        !task.isCompleted
      );

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? { ...currentTask, isCompleted: !currentTask.isCompleted }
            : currentTask
        )
      );

      clearNotice();
    } catch (error) {
      showError(error.message);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  function showError(message) {
    setNotice({ type: "error", message });
  }

  function showSuccess(message) {
    setNotice({ type: "success", message });
  }

  function clearNotice() {
    setNotice(null);
  }

  return (
    <div className="app-shell">
      <div className="backdrop" />

      <main className="app">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">NeuroPage</p>
            <h1>Control room for users, projects, and tasks.</h1>
            <p className="hero-text">
              React frontend for your ASP.NET task tracker. Pick a user, jump into a
              project, and manage tasks without Postman.
            </p>
          </div>

          <div className="hero-meta">
            <div className="metric-card accent">
              <span className="metric-label">API</span>
              <strong>{API_BASE_URL}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Users</span>
              <strong>{users.length}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Projects</span>
              <strong>{projects.length}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Open Tasks</span>
              <strong>{openTasks}</strong>
            </div>
          </div>
        </section>

        {notice && (
          <section className={`notice notice-${notice.type}`}>
            <span>{notice.message}</span>
          </section>
        )}

        <section className="workspace-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Step 1</p>
                <h2>Users</h2>
              </div>
              <span className="panel-count">{users.length}</span>
            </div>

            <form className="stack-form" onSubmit={handleCreateUser}>
              <label>
                <span>New user</span>
                <input
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  placeholder="Maria Petrova"
                />
              </label>
              <button type="submit" disabled={submittingUser}>
                {submittingUser ? "Creating..." : "Create User"}
              </button>
            </form>

            <div className="list-wrap">
              {usersLoading ? (
                <p className="empty-state">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="empty-state">No users yet. Create the first one to start.</p>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={user.id === selectedUserId ? "entity-card active" : "entity-card"}
                    onClick={() =>
                      startTransition(() => {
                        setSelectedUserId(user.id);
                      })
                    }
                  >
                    <strong>{user.name}</strong>
                    <span>ID {user.id}</span>
                  </button>
                ))
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Step 2</p>
                <h2>Projects</h2>
              </div>
              <span className="panel-count">{projects.length}</span>
            </div>

            <div className="context-banner">
              <span>Selected user</span>
              <strong>{selectedUser?.name ?? "Not selected"}</strong>
            </div>

            <form className="stack-form" onSubmit={handleCreateProject}>
              <label>
                <span>Project name</span>
                <input
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Launch dashboard"
                  disabled={selectedUserId === null}
                />
              </label>
              <label>
                <span>Description</span>
                <textarea
                  value={projectDescription}
                  onChange={(event) => setProjectDescription(event.target.value)}
                  placeholder="Short context for the project"
                  disabled={selectedUserId === null}
                  rows="3"
                />
              </label>
              <button type="submit" disabled={submittingProject || selectedUserId === null}>
                {submittingProject ? "Creating..." : "Create Project"}
              </button>
            </form>

            <div className="list-wrap">
              {selectedUserId === null ? (
                <p className="empty-state">Pick a user to load projects.</p>
              ) : projectsLoading ? (
                <p className="empty-state">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="empty-state">No projects for this user yet.</p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className={
                      project.id === selectedProjectId ? "entity-card active" : "entity-card"
                    }
                    onClick={() =>
                      startTransition(() => {
                        setSelectedProjectId(project.id);
                      })
                    }
                  >
                    <strong>{project.name}</strong>
                    <span>{project.description || "No description yet"}</span>
                  </button>
                ))
              )}
            </div>
          </article>

          <article className="panel panel-wide">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Step 3</p>
                <h2>Tasks</h2>
              </div>
              <span className="panel-count">{tasks.length}</span>
            </div>

            <div className="task-toolbar">
              <div className="context-banner">
                <span>Project focus</span>
                <strong>{selectedProject?.name ?? "Not selected"}</strong>
              </div>

              <label className="search-box">
                <span>Search</span>
                <input
                  value={taskSearch}
                  onChange={(event) => setTaskSearch(event.target.value)}
                  placeholder="Filter tasks"
                  disabled={selectedProjectId === null}
                />
              </label>
            </div>

            <div className="task-overview">
              <div className="task-stat">
                <span>Completed</span>
                <strong>{completedTasks}</strong>
              </div>
              <div className="task-stat">
                <span>Still open</span>
                <strong>{openTasks}</strong>
              </div>
              <div className="task-stat">
                <span>Visible now</span>
                <strong>{visibleTasks.length}</strong>
              </div>
            </div>

            <form className="task-form" onSubmit={handleCreateTask}>
              <label>
                <span>New task</span>
                <input
                  value={taskDescription}
                  onChange={(event) => setTaskDescription(event.target.value)}
                  placeholder="Write copy for landing page"
                  disabled={selectedProjectId === null}
                />
              </label>
              <button type="submit" disabled={submittingTask || selectedProjectId === null}>
                {submittingTask ? "Adding..." : "Add Task"}
              </button>
            </form>

            <div className="task-list">
              {selectedProjectId === null ? (
                <p className="empty-state">Pick a project to load its tasks.</p>
              ) : tasksLoading ? (
                <p className="empty-state">Loading tasks...</p>
              ) : visibleTasks.length === 0 ? (
                <p className="empty-state">
                  {tasks.length === 0
                    ? "This project has no tasks yet."
                    : "No tasks match the current search."}
                </p>
              ) : (
                visibleTasks.map((task) => (
                  <label
                    key={task.id}
                    className={task.isCompleted ? "task-card is-complete" : "task-card"}
                  >
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      disabled={updatingTaskId === task.id}
                      onChange={() => handleToggleTask(task)}
                    />
                    <div>
                      <strong>{task.description}</strong>
                      <span>
                        Task #{task.id} {task.isCompleted ? "completed" : "in progress"}
                      </span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
