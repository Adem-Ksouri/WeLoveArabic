using WeLoveArabic.WebAPI.Services.DataStructures;

namespace WeLoveArabic.WebAPI.Services.Models
{
    public class Root : IComparable<Root>
    {
        public string root { get; set; }
        public HashTable<string, int> derivedWords { get; set; }
        public Root(string root, HashTable<string, int> derivedWords)
        {
            this.root = root;
            this.derivedWords = derivedWords;
        }

        public int CompareTo(Root? other)
        {
            if (other == null) return 1;
            return root.CompareTo(other.root);
        }
    }
}
