using WeLoveArabic.WebAPI.Services.DataStructures.HashTable;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabic.WebAPI.Services.DataStructures.SchemaHashTable
{
    public class SchemaHashTable
    {
        public HashTable<WordSchema, string> Table { get; set; } = new HashTable<WordSchema, string>();
    }
}
