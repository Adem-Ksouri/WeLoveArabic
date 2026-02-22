using System.Collections.Generic;
using WeLoveArabic.WebAPI.Services.DataStructures.HashTable;
using WeLoveArabic.WebAPI.Services.DataStructures.LinkedList;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabicTests
{
    public class HashTableTests
    {
        private HashTable<DerivedWord, int> hashTable = new HashTable<DerivedWord, int>();

        private void InitializeHashTable()
        {
            DerivedWord word1 = new DerivedWord("مكتوب", "مفعول");
            DerivedWord word2 = new DerivedWord("مرسوم", "مفعول");
            DerivedWord word3 = new DerivedWord("كاتب", "فاعل");

            hashTable = new HashTable<DerivedWord, int>();

            hashTable.Insert(word1, 1);
            hashTable.Insert(word2, 3);
            hashTable.Insert(word3, 0);
        }

        [Fact]
        public void Get_NonExistingValue_ReturnsNull_Test()
        {
            DerivedWord word = new DerivedWord("مكتوب", "مفعول");

            Assert.False(hashTable.ContainsKey(word));
            Assert.Equal(default, hashTable.GetValue(word));
        }

        [Fact]
        public void Insert_Value_Test()
        {
            InitializeHashTable();
            DerivedWord word = new DerivedWord("جالس", "فاعل");
            hashTable.Insert(word, 2);

            Assert.True(hashTable.ContainsKey(word));
            Assert.Equal(2, hashTable.GetValue(word));
        }

        [Fact]
        public void Insert_ExitsingValue_ReturnsInitialValue()
        {
            InitializeHashTable();
            DerivedWord existingWord = new DerivedWord("مرسوم", "مفعول");
            hashTable.Insert(existingWord, 5);

            Assert.Equal(3, hashTable.GetValue(existingWord));
        }

        [Fact]
        public void Update_ExistingValue_Test()
        {
            InitializeHashTable();
            DerivedWord wordToUpdate = new DerivedWord("مكتوب", "مفعول");
            hashTable.Update(wordToUpdate, 5);

            Assert.True(hashTable.ContainsKey(wordToUpdate));
            Assert.Equal(5, hashTable.GetValue(wordToUpdate));
        }

        [Fact]
        public void Remove_NonExistingValue_Test()
        {
            InitializeHashTable();
            DerivedWord wordToRemove = new DerivedWord("جالس", "فاعل");
            bool isRemoved = hashTable.Remove(wordToRemove);

            Assert.False(isRemoved);
            Assert.False(hashTable.ContainsKey(wordToRemove));
        }

        [Fact]
        public void Remove_ExistingValue_Test()
        {
            InitializeHashTable();
            DerivedWord wordToRemove = new DerivedWord("مرسوم", "مفعول");
            bool isRemoved = hashTable.Remove(wordToRemove);

            Assert.True(isRemoved);
            Assert.False(hashTable.ContainsKey(wordToRemove));
        }
    }
}
