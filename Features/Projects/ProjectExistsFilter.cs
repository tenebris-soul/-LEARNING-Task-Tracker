public class ProjectExistsFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next
    )
    {
        var userId = context.GetArgument<int>(0);
        var projectId = context.GetArgument<int>(1);

        if(!ProjectsHelpers.ProjectExists(userId, projectId))
        {
            return Results.NotFound("Project not found.");
        }

        return await next(context);
    }
}