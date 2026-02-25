using WeLoveArabic.WebAPI.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddSingleton<WeLoveArabicService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactLocalhost",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") 
                   .AllowAnyMethod() // Allow any HTTP method (GET, POST, etc.)
                   .AllowAnyHeader(); // Allow any headers
        });
});

var app = builder.Build();
app.UseHttpsRedirection();
app.MapControllers();
app.UseCors("AllowReactLocalhost");
app.Run();

