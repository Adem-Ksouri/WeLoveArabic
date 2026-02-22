using WeLoveArabic.WebAPI.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddSingleton<WeLoveArabicService>();

var app = builder.Build();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();

