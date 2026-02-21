using WeLoveArabic.WebAPI.Services.Interfaces;

namespace WeLoveArabic.WebAPI.Services.Models
{
    public class DerivedWord : ICustomHahsable
    {
        public string Word { get; set; }
        public string Scheme {  get; set; }

        public DerivedWord(string word, string scheme)
        {
            Word = word;
            Scheme = scheme;
        }

        public int CustomHash(int cbase, int mod)
        {
            int hash = 0, pow = 1;
            for (int i = 0; i < Word.Length; i++)
            {
                hash = (hash + pow * Word[i] % mod) % mod;
                pow = pow * cbase % mod;
            }

            return hash;
        }

        public override bool Equals(object? obj)
        {
            if (obj == null || obj.GetType() != typeof(DerivedWord))
                return false;

            DerivedWord other = (DerivedWord)obj;

            return Word == other.Word;
        }
    }
}
