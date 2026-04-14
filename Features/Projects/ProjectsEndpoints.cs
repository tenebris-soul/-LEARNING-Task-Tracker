public static class ProjectsEndpoints
{
    public static IEndpointRouteBuilder MapProjectsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users/{userId}/projects").WithTags("Projects");

        group.MapGet("/", ProjectsHandlers.GetAllById)
             .WithName("GetProjectsByUserId")
             .AddEndpointFilter<UserExistsFilter>();
        group.MapPost("/", ProjectsHandlers.Create)
             .WithName("CreateProject")
             .AddEndpointFilter<UserExistsFilter>();
        group.MapPut("/{projectId}", ProjectsHandlers.Update)
             .WithName("UpdateProject")
             .AddEndpointFilter<UserExistsFilter>();

        return app;
    }
}