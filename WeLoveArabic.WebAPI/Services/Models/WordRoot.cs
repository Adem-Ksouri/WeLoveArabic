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
            return Root.CompareTo(other.Root);
        }

        public void UpdateDerivedWordCount(string derivedWord, string scheme, int valueToAdd)
        {
            if (string.IsNullOrEmpty(derivedWord))
                return;
            var key = new DerivedWord(derivedWord, scheme);
            // If the derived word doesn't exist, insert it with the initial count. Otherwise, update the existing count.
            if (!DerivedWords.ContainsKey(key))
            {
                DerivedWords.Insert(key, valueToAdd);
                return;
            }
            int currentCount = DerivedWords.GetValue(key);
            DerivedWords.Update(key, currentCount + valueToAdd);
        }
    }
}
