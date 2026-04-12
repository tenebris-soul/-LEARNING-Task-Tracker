public static class UsersHandlers
{
    public static IResult GetAll() => Results.Ok(AppData.Users);
    public static IResult Create(CreateUserRequest request)
    {
        if(string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest("Name is required.");
        }

        var user = new User
        {
            Id = User.NextId,
            Name = request.Name
        };

        AppData.Users.Add(user);

        return Results.CreatedAtRoute("GetUserById", new { id = user.Id }, user);
    }
    public static IResult GetById(int id)
    {
        var user = AppData.Users.FirstOrDefault(u => u.Id == id);

        return user is not null ? Results.Ok(user) : Results.NotFound();
    }
    public static IResult Update(int id, UpdateUserRequest request)
    {
        var user = AppData.Users.FirstOrDefault(u => u.Id == id);

        if (user is null)
        {
            return Results.NotFound();
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest("Name is required.");
        }

        user.Name = request.Name;
        return Results.NoContent();
    }
}