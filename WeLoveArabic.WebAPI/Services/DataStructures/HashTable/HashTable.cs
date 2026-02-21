using WeLoveArabic.WebAPI.Services.DataStructures.LinkedList;
using WeLoveArabic.WebAPI.Services.Interfaces;

namespace WeLoveArabic.WebAPI.Services.DataStructures.HashTable
{
    public class HashTable<TKey, TValue> where TKey : ICustomHahsable
    {
        private const int Capacity = 1000003;
        private const int Mod = 1000003;
        private const int Base = 9973;

        private TLinkedList<KeyValuePair<TKey, TValue>>[] _buckets;

        public HashTable()
        {
            _buckets = new TLinkedList<KeyValuePair<TKey, TValue>>[Capacity];
        }

        static private int GetBucketIndex(TKey key)
        {
            if (key == null)
                return -1;

            return key.CustomHash(Base, Mod);
        }

        public TValue GetValue(TKey searchKey)
        {
            if (searchKey == null)
                return default!;

            int index = GetBucketIndex(searchKey);

            InitializeList(index);

            TLinkedListNode<KeyValuePair<TKey, TValue>>? node = index >= 0
                ? _buckets[index].Find(x => x.Key.Equals(searchKey))
                : null;

            return node == null ? default! : node.Value.Value;
        }

        public bool ContainsKey(TKey searchKey)
        {
            if (searchKey == null)
                return false;

            int index = GetBucketIndex(searchKey);

            InitializeList(index);

            return index >= 0 && _buckets[index].Exist(x => x.Key.Equals(searchKey));
        }

        public void Insert(TKey key, TValue value) =>
            DoInsert(key, value);

        public void Update(TKey key, TValue value) =>
            DoUpdate(key, value);

        public bool Remove(TKey key) =>
            DoRemove(key);

        private void InitializeList(int index)
        {
            if (index == -1)
                return;

            if (_buckets[index] == null)
                _buckets[index] = new TLinkedList<KeyValuePair<TKey, TValue>>();
        }

        private void DoInsert(TKey key, TValue value)
        {
            int index = GetBucketIndex(key);
            if (index == -1)
                return;

            InitializeList(index);

            if (!ContainsKey(key))
                _buckets[index].AddTail(KeyValuePair.Create(key, value));
        }

        private void DoUpdate(TKey key, TValue value)
        {
            int index = GetBucketIndex(key);
            if (index == -1)
                return;

            InitializeList(index);

            TLinkedListNode<KeyValuePair<TKey, TValue>>? node = _buckets[index].Find(x => x.Key.Equals(key));

            if (node != null)
                node.Value = KeyValuePair.Create(key, value);
        }

        private bool DoRemove(TKey key)
        {
            int index = GetBucketIndex(key);
            if (index == -1)
                return false;

            InitializeList(index);

            return _buckets[index].Delete(x => x.Key.Equals(key));
        }
    }
}
