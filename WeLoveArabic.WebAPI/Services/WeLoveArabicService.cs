using WeLoveArabic.WebAPI.Services.DataStructures.AvlTree;
using WeLoveArabic.WebAPI.Services.DataStructures.HashTable;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabic.WebAPI.Services
{
    public class WeLoveArabicService
    {
        private readonly HashTable<WordSchema, string> _schemas = new HashTable<WordSchema, string>();
        private readonly AvlTree<WordRoot> _roots = new AvlTree<WordRoot>();


    }
}
