using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabic.WebAPI.Models;

public class ListRootDetailsResponse
{
    public bool Success { get; set; }
    public List<KeyValuePair<DerivedWord, int>>? DerivedWordsWithCount { get; set; }
}