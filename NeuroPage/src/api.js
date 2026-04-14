const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5260";

function toJsonIfPossible(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path, options = {}) {
  const hasBody = options.body !== undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    },
    body: hasBody ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const payload = toJsonIfPossible(text);

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message ?? `Request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return payload;
}

export const api = {
  getUsers() {
    return request("/users/");
  },

  createUser(name) {
    return request("/users/", {
      method: "POST",
      body: { name }
    });
  },

  getProjects(userId) {
    return request(`/users/${userId}/projects/`);
  },

  createProject(userId, payload) {
    return request(`/users/${userId}/projects/`, {
      method: "POST",
      body: payload
    });
  },

  getTasks(userId, projectId) {
    return request(`/users/${userId}/projects/${projectId}/tasks/`);
  },

  createTask(userId, projectId, description) {
    return request(`/users/${userId}/projects/${projectId}/tasks/`, {
      method: "POST",
      body: { description }
    });
  },

  updateTaskCompletion(userId, projectId, taskId, isCompleted) {
    return request(`/users/${userId}/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      body: { isCompleted }
    });
  }
};

export { API_BASE_URL };
