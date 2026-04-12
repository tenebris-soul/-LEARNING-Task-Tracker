using System.ComponentModel.DataAnnotations;

public sealed class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public static int NextId { get { return _nextId++; } }

    private static int _nextId = 1;
}