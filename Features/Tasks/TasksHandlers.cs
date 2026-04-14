public static class TasksHandlers
{
    public static IResult GetAllById(int userId, int projectId)
    {
        var tasks = AppData.Tasks.Where(t => t.ProjectId == projectId).ToList();
        return Results.Ok(tasks);
    }

    public static IResult GetById(int userId, int projectId, int taskId)
    {
        var task = AppData.Tasks.FirstOrDefault(t => t.Id == taskId && t.ProjectId == projectId);
        if (task == null)
        {
            return Results.NotFound();
        }
        return Results.Ok(task);
    }

    public static IResult Create(int userId, int projectId, CreateTaskRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Description))
        {
            return Results.BadRequest("Description is required.");
        }

        var newTask = new Task
        {
            Id = Task.NextId,
            Description = request.Description,
            ProjectId = projectId
        };

        AppData.Tasks.Add(newTask);
        return Results.CreatedAtRoute("GetTaskById", new { userId, projectId, taskId = newTask.Id }, newTask);
    }

    public static IResult UpdateTaskCompletion(int userId, int projectId, int taskId, UpdateTaskCompletionRequest request)
    {
        var task = AppData.Tasks.FirstOrDefault(t => t.Id == taskId && t.ProjectId == projectId);
        if (task == null)
        {
            return Results.NotFound();
        }

        task.IsCompleted = request.IsCompleted;
        return Results.NoContent();
    }
}
