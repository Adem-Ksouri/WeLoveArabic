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
            Assert.True(word.IsEqual(linkedList.GetHead()!.Value));
            Assert.True(word.IsEqual(linkedList.GetTail()!.Value));
        }

        [Fact]
        public void Add_ToTail_Test()
        {
            InitializeLinkedList();
            DerivedWord word = new DerivedWord("جالس", "فاعل");
            linkedList.AddTail(word);

            Assert.True(word.IsEqual(linkedList.GetTail()!.Value));
            Assert.Equal(4, linkedList.GetSize());
        }

        [Fact]
        public void Delete_NonExistingValue_Test()
        {
            InitializeLinkedList();
            DerivedWord wordToDelete = new DerivedWord("موجود", "مفعول");
            bool isDeleted = linkedList.Delete(x => x.IsEqual(wordToDelete));

            Assert.False(isDeleted);
            Assert.Equal(3, linkedList.GetSize());
            Assert.False(wordToDelete.IsEqual(linkedList.GetTail()!.Value));
        }

        [Fact]
        public void Delete_ExistingValue_ReturnsEmptyList_Test()
        {
            DerivedWord word = new DerivedWord("حذف", "فعل");
            linkedList.AddTail(word);
            bool isDeleted = linkedList.Delete(x => x.IsEqual(word));

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
            bool isDeleted = linkedList.Delete(x => x.IsEqual(word));

            Assert.True(isDeleted);
            Assert.False(word.IsEqual(linkedList.GetTail()!.Value));
            Assert.Equal(2, linkedList.GetSize());
        }

        [Fact]
        public void Delete_ExistingValueHead_Test()
        {
            InitializeLinkedList();
            DerivedWord word = new DerivedWord("مكتوب", "مفعول");
            bool isDeleted = linkedList.Delete(x => x.IsEqual(word));

            Assert.True(isDeleted);
            Assert.False(word.IsEqual(linkedList.GetHead()!.Value));
            Assert.Equal(2, linkedList.GetSize());
        }

        [Fact]
        public void Delete_ExistingValueMiddle_Test()
        {
            InitializeLinkedList();
            DerivedWord word = new DerivedWord("مرسوم", "مفعول");
            bool isDeleted = linkedList.Delete(x => x.IsEqual(word));

            Assert.True(isDeleted);
            Assert.Equal(2, linkedList.GetSize());
            Assert.True(linkedList.GetHead()!.Next!.Value.IsEqual(linkedList.GetTail()!.Value));
        }

        [Fact]
        public void Find_NonExistingValue_Test()
        {
            InitializeLinkedList();
            DerivedWord wordToFind = new DerivedWord("موجود", "مفعول");
            TLinkedListNode<DerivedWord>? nodeFound = linkedList.Find(x => x.IsEqual(wordToFind));
            bool isFound = linkedList.Exist(x => x.IsEqual(wordToFind));

            Assert.Null(nodeFound);
            Assert.False(isFound);
        }

        [Fact]
        public void Find_ExistingValue_Test()
        {
            InitializeLinkedList();
            DerivedWord wordToFind = new DerivedWord("مرسوم", "مفعول");
            TLinkedListNode<DerivedWord>? nodeFound = linkedList.Find(x => x.IsEqual(wordToFind));
            bool isFound = linkedList.Exist(x => x.IsEqual(wordToFind));

            Assert.NotNull(nodeFound);
            Assert.True(isFound);
            Assert.True(wordToFind.IsEqual(nodeFound!.Value));
        }

        [Fact]
        public void GetAll_Test()
        {
            InitializeLinkedList();
            List<DerivedWord> allWords = (List<DerivedWord>)linkedList.GetAll();

            Assert.NotNull(allWords);
            Assert.Equal(3, allWords.Count);
        }
    }
}
