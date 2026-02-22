using WeLoveArabic.WebAPI.Services.DataStructures.AvlTree;
using WeLoveArabic.WebAPI.Services.DataStructures.HashTable;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabic.WebAPI.Services
{
    public class WeLoveArabicService
    {
        private readonly AvlTree<WordRoot> _roots = new AvlTree<WordRoot>();
        private readonly HashTable<WordSchema, string> _schemes = new HashTable<WordSchema, string>();

        public void AddArabicRoots(List<string> roots)
        {
            foreach (var root in roots)
            {
                if (root.Length != 3)
                    continue;
                _roots.Insert(new WordRoot(root));
            }
        }

        public void AddArabicSchemes(List<string> schemes)
        {
            foreach (var scheme in schemes)
            {
                _schemes.Insert(new WordSchema(scheme), scheme);
            }
        }

        public List<DerivedWord> GenerateArabicWords(string root, List<string> schemes)
        {
            if (string.IsNullOrEmpty(root) || schemes == null || schemes.Count == 0)
                return new List<DerivedWord>();
            if (!_roots.Contains(new WordRoot(root)))
                return new List<DerivedWord>();
            foreach (var scheme in schemes)
            {
                if (!_schemes.ContainsKey(new WordSchema(scheme)))
                    return new List<DerivedWord>();
            }

            List<DerivedWord> derivedWords = new List<DerivedWord>();
            foreach (var scheme in schemes)
            {
                string derivedWord = ApplySchemeToRoot(root, scheme);
                derivedWords.Add(new DerivedWord(derivedWord, scheme));
            }
            return derivedWords;
        }

        public string? VerifyArabicWord(string root, string word)
        {
            if (string.IsNullOrEmpty(root) || string.IsNullOrEmpty(word))
                return null;
            if (!_roots.Contains(new WordRoot(root)))
                return null;
            List<KeyValuePair<WordSchema, string>> storedSchemes = _schemes.GetStoredKeys();
            foreach (var scheme in storedSchemes)
            {
                string derivedWord = ApplySchemeToRoot(root, scheme.Key.Schema);
                if (derivedWord == word)
                    return scheme.Key.Schema;
            }
            return null;
        }

        public List<KeyValuePair<DerivedWord, int>>? ListRootDetails(string root)
        {
            if (string.IsNullOrEmpty(root))
                return null;
            if (!_roots.Contains(new WordRoot(root)))
                return null;

            var rootValue = _roots.GetValue(new WordRoot(root));
            if (rootValue != null)
            {
                return rootValue.DerivedWords.GetStoredKeys();
            }
            return null;
        }

        private string ApplySchemeToRoot(string root, string scheme)
        {
            string result = "";
            for (int i = scheme.Length - 1; i >= 0; i--)
            {
                if (scheme[i] == 'ف')
                {
                    result.Append(root[2]);
                }
                else if (scheme[i] == 'ع')
                {
                    result.Append(root[1]);
                }
                else if (scheme[i] == 'ل')
                {
                    result.Append(root[0]);
                }
                else
                {
                    result.Append(scheme[i]);
                }
            }
            result.Reverse();
            return result;
        }
    }
}
