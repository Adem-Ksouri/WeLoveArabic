using WeLoveArabic.WebAPI.Services.DataStructures.RootAvlTree;
using WeLoveArabic.WebAPI.Services.DataStructures.SchemaHashTable;

namespace WeLoveArabic.WebAPI.Services
{
    public class WeLoveArabicService
    {
        private readonly SchemaHashTable _schemas;
        private readonly RootAvlTree _roots;

        public WeLoveArabicService(
            SchemaHashTable schemaHashTable,
            RootAvlTree rootAvlTree)
        {
            _schemas = schemaHashTable;
            _roots = rootAvlTree;
        }
    }
}
