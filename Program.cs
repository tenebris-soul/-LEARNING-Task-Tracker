var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("NeuroPage", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("NeuroPage");

app.MapGet("/", () => "Hello World!");

app.MapUsersEndpoints();
app.MapProjectsEndpoints();
app.MapTasksEndpoints();

app.Run();
