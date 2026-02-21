using WeLoveArabic.WebAPI.Services.DataStructures.HashTable;

namespace WeLoveArabic.WebAPI.Services.Models
{
    public class WordRoot : IComparable<WordRoot>
    {
        public string Root { get; set; }
        public HashTable<DerivedWord, int> DerivedWords { get; set; }

        public WordRoot(string root)
        {
            Root = root;
            DerivedWords = new HashTable<DerivedWord, int>();
        }

        public WordRoot(string root, HashTable<DerivedWord, int> derivedWords)
        {
            Root = root;
            DerivedWords = derivedWords;
        }

        public int CompareTo(WordRoot? other)
        {
            if (other == null) return 1;
            return CompareFromRight(Root, other.Root);
        }

        private int CompareFromRight(string? a, string? b)
        {
            if (a is null) return -1;
            if (b is null) return 1;

            int i = a.Length - 1;
            int j = b.Length - 1;

            while (i >= 0 && j >= 0)
            {
                char ca = a[i];
                char cb = b[j];

                if (ca != cb)
                    return ca.CompareTo(cb); 

                i--;
                j--;
            }

            return a.Length.CompareTo(b.Length);
        }
    }
}
