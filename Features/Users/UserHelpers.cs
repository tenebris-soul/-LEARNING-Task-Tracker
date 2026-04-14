public static class UserHelpers
{
    public static bool UserExists(int userId)
    {
        return AppData.Users.Any(u => u.Id == userId);
    }
} 