public static class ProjectsHelpers
{
    public static bool SameNameExists(int userId, string projectName)
    {
        return AppData.Projects.Any(
            p => p.UserId == userId && 
            p.Name.Equals(projectName, StringComparison.OrdinalIgnoreCase)
        );
    }

    public static Project? GetProjectById(int userId, int projectId)
    {
        return AppData.Projects.FirstOrDefault(p => p.Id == projectId && p.UserId == userId);
    }

    public static bool ProjectExists(int userId, int projectId)
    {
        return AppData.Projects.Any(p => p.Id == projectId && p.UserId == userId);
    }
}