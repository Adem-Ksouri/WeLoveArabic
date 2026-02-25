using WeLoveArabic.WebAPI.Services.DataStructures.AvlTree;
using WeLoveArabic.WebAPI.Services.DataStructures.HashTable;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabic.WebAPI.Services
{
    public class WeLoveArabicService
    {
        private readonly AvlTree<WordRoot> _roots = new AvlTree<WordRoot>();
        private readonly HashTable<WordSchema, string> _schemes = new HashTable<WordSchema, string>();

        public List<WordRoot> GetAllRootsSorted()
        {
            return _roots.GetAllValuesSorted();
        }

        public List<WordSchema> GetAllSchemas()
        {
            return _schemes.GetStoredKeys().Select(kvp => kvp.Key).ToList();
        }

        public void AddArabicRoots(List<string> roots)
        {
            foreach (var root in roots)
            {
                if (root.Length != 3)
                    continue;
                _roots.Insert(new WordRoot(root));
            }
        }

        public void DeleteArabicRoot(string root)
        {
            if (string.IsNullOrEmpty(root) || !_roots.Contains(new WordRoot(root)))
                return;
            _roots.Delete(new WordRoot(root));
        }

        public void AddArabicSchemes(List<string> schemes)
        {
            foreach (var scheme in schemes)
            {
                _schemes.Insert(new WordSchema(scheme), scheme);
            }
        }

        public void UpdateArabicScheme(string oldScheme, string newScheme)
        {
            if (string.IsNullOrEmpty(oldScheme) || string.IsNullOrEmpty(newScheme) || !_schemes.ContainsKey(new WordSchema(oldScheme)))
                return;
            _schemes.Remove(new WordSchema(oldScheme));
            _schemes.Insert(new WordSchema(newScheme), newScheme);
        }

        public void RemoveArabicScheme(string scheme)
        {
            if (string.IsNullOrEmpty(scheme) || !_schemes.ContainsKey(new WordSchema(scheme)))
                return;
            _schemes.Remove(new WordSchema(scheme));
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
                UpdateDerivedWordCountForRoot(root: root, scheme: scheme, derivedWord: derivedWord, valueToAdd: 1);
                derivedWords.Add(new DerivedWord(word: derivedWord, scheme: scheme));
            }
            return derivedWords;
        }

        public string? VerifyArabicWord(string root, string word)
        {
            if (string.IsNullOrEmpty(root) || string.IsNullOrEmpty(word))
                return null;
            if (!_roots.Contains(new WordRoot(root)))
                return null;
            List<string> storedSchemes = _schemes.GetStoredKeys().Select(s => s.Key.Schema).ToList();
            foreach (var scheme in storedSchemes)
            {
                string derivedWord = ApplySchemeToRoot(root: root, scheme: scheme);
                if (derivedWord == word)
                {
                    UpdateDerivedWordCountForRoot(root: root, scheme: scheme, derivedWord: derivedWord, valueToAdd: 1);
                    return scheme;
                }
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

        public List<KeyValuePair<DerivedWord, int>> ListAllRootsDetails()
        {
            List<WordRoot> rootList = _roots.GetAllValuesSorted();

            List<KeyValuePair<DerivedWord, int>> result = new List<KeyValuePair<DerivedWord, int>>();
            foreach (WordRoot root in rootList)
            {
                result.AddRange(root.DerivedWords.GetStoredKeys());
            }

            return result;
        }

        private string ApplySchemeToRoot(string root, string scheme)
        {
            string result = "";
            foreach (char c in scheme)
            {
                if (c == 'ف')
                {
                    result += root[0];
                }
                else if (c == 'ع')
                {
                    result += root[1];
                }
                else if (c == 'ل')
                {
                    result += root[2];
                }
                else
                {
                    result += c;
                }
            }
            return result;
        }

        private void UpdateDerivedWordCountForRoot(string root, string scheme, string derivedWord, int valueToAdd)
        {
            WordRoot? rootValue = _roots.GetValue(new WordRoot(root));
            if (rootValue != null)
            {
                rootValue.UpdateDerivedWordCount(derivedWord: derivedWord, scheme: scheme, valueToAdd: 1);
            }
        }
    }
}
