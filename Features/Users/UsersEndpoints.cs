public static class UsersEndpoints
{
    public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users").WithTags("Users");

        group.MapGet("/", UsersHandlers.GetAll).WithName("GetAllUsers");

        group.MapPost("/", UsersHandlers.Create).WithName("CreateUser");
        group.MapGet("/{id}", UsersHandlers.GetById).WithName("GetUserById");
        group.MapPut("/{id}", UsersHandlers.Update).WithName("UpdateUser");

        return app;
    }
}