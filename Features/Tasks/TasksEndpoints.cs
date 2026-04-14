public static class TasksEndpoints
{
    public static IEndpointRouteBuilder MapTasksEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("users/{userId}/projects/{projectId}/").WithTags("Tasks");

        group.MapGet("/", TasksHandlers.GetAllById)
             .WithName("GetTasksByProjectId")
             .AddEndpointFilter<UserExistsFilter>()
             .AddEndpointFilter<ProjectExistsFilter>();
        group.MapGet("/{taskId}", TasksHandlers.GetById)
             .WithName("GetTaskById")
             .AddEndpointFilter<UserExistsFilter>()
             .AddEndpointFilter<ProjectExistsFilter>();
        group.MapPost("/", TasksHandlers.Create)
             .WithName("CreateTask")
             .AddEndpointFilter<UserExistsFilter>()
             .AddEndpointFilter<ProjectExistsFilter>();
        group.MapPut("/{taskId}/", TasksHandlers.UpdateTaskCompletion)
             .WithName("UpdateTaskCompletion")
             .AddEndpointFilter<UserExistsFilter>()
             .AddEndpointFilter<ProjectExistsFilter>();
        return app;
    }
}