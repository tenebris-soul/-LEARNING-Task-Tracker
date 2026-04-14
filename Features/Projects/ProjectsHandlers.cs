public static class ProjectsHandlers
{
    public static IResult GetAllById(int userId)
    {
        var projects = AppData.Projects.Where(p => p.UserId == userId).ToList();
        return Results.Ok(projects);
    }
    public static IResult Create(int userId, CreateProjectRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest("Name is required.");
        }

        if (ProjectsHelpers.SameNameExists(userId, request.Name))
        {
            return Results.BadRequest("A project with the same name already exists for this user.");
        }

        var project = new Project
        {
            Id = Project.NextId,
            Name = request.Name,
            Description = request.Description,
            UserId = userId
        };

        AppData.Projects.Add(project);

        return Results.Created($"/users/{userId}/projects", project);
    }
    public static IResult Update(int userId, int projectId, UpdateProjectRequest request)
    {
        var project = ProjectsHelpers.GetProjectById(userId, projectId);
        if (project == null)
        {
            return Results.NotFound("Project not found.");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest("Name is required.");
        }

        if (ProjectsHelpers.SameNameExists(userId, request.Name))
        {
            return Results.BadRequest("A project with the same name already exists for this user.");
        }

        project.Name = request.Name ?? project.Name;
        project.Description = request.Description ?? project.Description;

        return Results.Ok(project);
    }
}