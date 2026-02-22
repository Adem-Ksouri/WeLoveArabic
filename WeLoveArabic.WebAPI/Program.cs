using WeLoveArabic.WebAPI.Services.DataStructures.RootAvlTree;
using WeLoveArabic.WebAPI.Services.DataStructures.SchemaHashTable;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddSingleton<SchemaHashTable>();
builder.Services.AddSingleton<RootAvlTree>();

var app = builder.Build();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();

