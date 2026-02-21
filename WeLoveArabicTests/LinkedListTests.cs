using WeLoveArabic.WebAPI.Services.DataStructures.LinkedList;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabicTests
{
    public class LinkedListTests
    {
        private TLinkedList<DerivedWord> linkedList = new TLinkedList<DerivedWord>();

        private void InitializeLinkedList()
        {
            DerivedWord word1 = new DerivedWord("مكتوب", "مفعول");
            DerivedWord word2 = new DerivedWord("مرسوم", "مفعول");
            DerivedWord word3 = new DerivedWord("كاتب", "فاعل");

            linkedList = new TLinkedList<DerivedWord>();

            linkedList.AddTail(word1);
            linkedList.AddTail(word2);
            linkedList.AddTail(word3);
        }

        [Fact]
        public void Add_ToEmptyList_Test()
        {
            DerivedWord word = new DerivedWord("مكتوب", "مفعول");
            linkedList.AddTail(word);

            Assert.NotNull(linkedList.GetHead());
            Assert.NotNull(linkedList.GetTail());
            Assert.Equal(word, linkedList.GetHead()!.Value);
            Assert.Equal(word, linkedList.GetTail()!.Value);
        }

        [Fact]
        public void Add_ToTail_Test()
        {
            InitializeLinkedList();
            DerivedWord word = new DerivedWord("جالس", "فاعل");
            linkedList.AddTail(word);

            Assert.Equal(word, linkedList.GetTail()!.Value);
            Assert.Equal(4, linkedList.GetSize());
        }

        [Fact]
        public void Delete_NonExistingValue_Test()
        {
            InitializeLinkedList();
            DerivedWord wordToDelete = new DerivedWord("موجود", "مفعول");
            bool isDeleted = linkedList.Delete(x => x.Equals(wordToDelete));

            Assert.False(isDeleted);
            Assert.Equal(3, linkedList.GetSize());
            Assert.NotEqual(wordToDelete, linkedList.GetTail()!.Value);
        }

        [Fact]
        public void Delete_ExistingValue_ReturnsEmptList_Test()
        {
            DerivedWord word = new DerivedWord("حذف", "فعل");
            linkedList.AddTail(word);
            bool isDeleted = linkedList.Delete(x => x.Equals(word));

            Assert.True(isDeleted);
            Assert.Null(linkedList.GetHead());
            Assert.Null(linkedList.GetTail());
            Assert.Equal(0, linkedList.GetSize());
        }

        [Fact]
        public void Delete_ExistingValueTail_Test()
        {
            InitializeLinkedList();
            DerivedWord word = new DerivedWord("كاتب", "فاعل");
            bool isDeleted = linkedList.Delete(x => x.Equals(word));

            Assert.True(isDeleted);
            Assert.NotEqual(word, linkedList.GetTail()!.Value);
            Assert.Equal(2, linkedList.GetSize());
        }

        [Fact]
        public void Delete_ExistingValueHead_Test()
        {
            InitializeLinkedList();
            DerivedWord word = new DerivedWord("مكتوب", "مفعول");
            bool isDeleted = linkedList.Delete(x => x.Equals(word));

            Assert.True(isDeleted);
            Assert.NotEqual(word, linkedList.GetHead()!.Value);
            Assert.Equal(2, linkedList.GetSize());
        }

        [Fact]
        public void Delete_ExistingValueMiddle_Test()
        {
            InitializeLinkedList();
            DerivedWord word = new DerivedWord("مرسوم", "مفعول");
            bool isDeleted = linkedList.Delete(x => x.Equals(word));

            Assert.True(isDeleted);
            Assert.Equal(2, linkedList.GetSize());
            Assert.Equal(linkedList.GetHead()!.Next!.Value, linkedList.GetTail()!.Value);
        }

        [Fact]
        public void Find_NonExistingValue_Test()
        {
            InitializeLinkedList();
            DerivedWord wordToFind = new DerivedWord("موجود", "مفعول");
            TLinkedListNode<DerivedWord>? nodeFound = linkedList.Find(x => x.Equals(wordToFind));
            bool isFound = linkedList.Exist(x => x.Equals(wordToFind));

            Assert.Null(nodeFound);
            Assert.False(isFound);
        }

        [Fact]
        public void Find_ExistingValue_Test()
        {
            InitializeLinkedList();
            DerivedWord wordToFind = new DerivedWord("مرسوم", "مفعول");
            TLinkedListNode<DerivedWord>? nodeFound = linkedList.Find(x => x.Equals(wordToFind));
            bool isFound = linkedList.Exist(x => x.Equals(wordToFind));

            Assert.NotNull(nodeFound);
            Assert.True(isFound);
            Assert.Equal(wordToFind, nodeFound!.Value);
        }
    }
}
