using System.ComponentModel.DataAnnotations;

public sealed class Task
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Description { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }

    public int ProjectId { get; set; }

    public static int NextId { get { return _nextId++; } }
    private static int _nextId = 1;
}