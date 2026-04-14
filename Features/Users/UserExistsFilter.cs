public class UserExistsFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next
    )
    {
        var userId = context.GetArgument<int>(0);

        if(!UserHelpers.UserExists(userId))
        {
            return Results.NotFound("User not found.");
        }

        return await next(context);
    }
}