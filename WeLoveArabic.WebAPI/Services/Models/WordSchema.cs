using WeLoveArabic.WebAPI.Services.Interfaces;

namespace WeLoveArabic.WebAPI.Services.Models
{
    public class WordSchema : ICustomHashable
    {
        public string Schema { get; set; }

        public WordSchema(string schema)
        {
            Schema = schema;
        }

        public int CustomHash(int cbase, int mod)
        {
            long hash = 0, pow = 1;
            for (int i = 0; i < Schema.Length; i++)
            {
                hash = (hash + pow * Schema[i] % mod) % mod;
                pow = pow * cbase % mod;
            }

            return (int)hash;
        }

        public bool IsEqual(object? obj)
        {
            if (obj == null || obj.GetType() != typeof(WordSchema))
                return false;

            WordSchema other = (WordSchema)obj;

            return Schema == other.Schema;
        }
    }
}
