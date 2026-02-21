using WeLoveArabic.WebAPI.Services.DataStructures;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabicTests
{
    public class AvlTreeTests
    {
        private AvlTree<string> _avlTreeStr = new AvlTree<string>();
        private AvlTree<Root> _avlTree = new AvlTree<Root>();

        [Fact]
        public void GetValue_NonExistentValue_ReturnsNull()
        {
            string nonExistentValueStr = "NonExistent";
            Root nonExistentValueRoot = new Root("NonExistentRoot", new HashTable<string, int>());
            Assert.Null(_avlTreeStr.GetValue(nonExistentValueStr));
            Assert.Null(_avlTree.GetValue(nonExistentValueRoot));
        }

        [Fact]
        public void GetValue_ExistingValue_ReturnsValue()
        {
            string existingValueStr = "Existing";
            Root existingValueRoot = new Root("ExistingRoot", new HashTable<string, int>());
            _avlTreeStr.Insert(existingValueStr);
            _avlTree.Insert(existingValueRoot);
            Assert.Equal(existingValueStr, _avlTreeStr.GetValue(existingValueStr));
            Assert.Equal(existingValueRoot, _avlTree.GetValue(existingValueRoot));
        }

        [Fact]
        public void Insert_ValidValues_UnitTest()
        {
            string valueToInsert1 = "Azdg";
            string valueToInsert2 = "jFvd";

            _avlTreeStr.Insert(valueToInsert1);
            _avlTreeStr.Insert(valueToInsert2);

            Assert.Equal(valueToInsert1, _avlTreeStr.GetValue(valueToInsert1));
            Assert.Equal(valueToInsert2, _avlTreeStr.GetValue(valueToInsert2));

            Root root1 = new Root("root1", new HashTable<string, int>());
            Root root2 = new Root("root2", new HashTable<string, int>());
            _avlTree.Insert(root1);
            _avlTree.Insert(root2);

            Assert.Equal(root1, _avlTree.GetValue(root1));
            Assert.Equal(root2, _avlTree.GetValue(root2));
        }
    }
}
