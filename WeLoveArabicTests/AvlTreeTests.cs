using WeLoveArabic.WebAPI.Services.DataStructures.AvlTree;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabicTests
{
    public class AvlTreeTests
    {
        private AvlTree<WordRoot> _avlTree = new AvlTree<WordRoot>();

        private void InitializeAvlTree()
        {
            WordRoot root1 = new WordRoot("كتب");
            WordRoot root2 = new WordRoot("رفع");
            WordRoot root3 = new WordRoot("رسم");

            // Manually build the tree structure
            //        root2
            //       /     \
            //    root3   root1
            AvlNode<WordRoot> node2 = new AvlNode<WordRoot>(root2);
            AvlNode<WordRoot> node1 = new AvlNode<WordRoot>(root1);
            AvlNode<WordRoot> node3 = new AvlNode<WordRoot>(root3);

            node2.Left = node3;
            node2.Right = node1;
            node2.Height = 2;
            node1.Height = 1;
            node3.Height = 1;

            _avlTree = new AvlTree<WordRoot>(node2);
        }

        [Fact]
        public void GetValue_NonExistentValue_ReturnsNull_Test()
        {
            InitializeAvlTree();
            string nonExistentValueStr = "جلس";
            WordRoot nonExistentValueWordRoot = new WordRoot(nonExistentValueStr);
            Assert.Null(_avlTree.GetValue(nonExistentValueWordRoot));
        }

        [Fact]
        public void GetValue_ExistingValue_ReturnsValue_Test()
        {
            string existingValueStr = "كتب";
            WordRoot existingValueWordRoot = new WordRoot(existingValueStr);
            _avlTree.Insert(existingValueWordRoot);
            Assert.Equal(existingValueWordRoot, _avlTree.GetValue(existingValueWordRoot));
        }

        [Fact]
        public void GetAllValuesSorted_Test()
        {
            InitializeAvlTree();
            List<WordRoot> sortedValues = _avlTree.GetAllValuesSorted();
            Assert.NotNull(sortedValues);
            Assert.Equal(3, sortedValues.Count);
            Assert.Equal("رسم", sortedValues[0].Root);
            Assert.Equal("رفع", sortedValues[1].Root);
            Assert.Equal("كتب", sortedValues[2].Root);
        }

        [Fact]
        public void Insert_ValidValues_Test()
        {
            WordRoot root1 = new WordRoot("كتب");
            WordRoot root2 = new WordRoot("رفع");
            _avlTree.Insert(root1);
            _avlTree.Insert(root2);

            Assert.Equal(root1, _avlTree.GetValue(root1));
            Assert.Equal(root2, _avlTree.GetValue(root2));
        }

        [Fact]
        public void Insert_DuplicateValues_Test()
        {
            WordRoot root = new WordRoot("تكرار");
            _avlTree.Insert(root);
            _avlTree.Insert(root);
            Assert.Equal(root, _avlTree.GetValue(root));
        }

        [Fact]
        public void Delete_ExistingValue_Test()
        {
            WordRoot rootToDelete = new WordRoot("حذف");
            _avlTree.Insert(rootToDelete);
            _avlTree.Delete(rootToDelete);
            Assert.Null(_avlTree.GetValue(rootToDelete));
        }

        [Fact]
        public void Delete_NonExistentValue_Test()
        {
            WordRoot nonExistentWordRoot = new WordRoot("وجد");
            _avlTree.Delete(nonExistentWordRoot);
            Assert.Null(_avlTree.GetValue(nonExistentWordRoot));
        }

        [Fact]
        public void Delete_AvlTree_RootNode_Test()
        {
            InitializeAvlTree();
            WordRoot rootToDelete = new WordRoot("رفع");
            _avlTree.Delete(rootToDelete);
            Assert.Null(_avlTree.GetValue(rootToDelete));
        }

        [Fact]
        public void Delete_AvlTree_LeafNode_Test()
        {
            InitializeAvlTree();
            WordRoot leafNodeToDelete = new WordRoot("كتب");
            _avlTree.Delete(leafNodeToDelete);
            Assert.Null(_avlTree.GetValue(leafNodeToDelete));
        }

        [Fact]
        public void Delete_AvlTree_NodeWithOneChild_Test()
        {
            InitializeAvlTree();
            WordRoot nodeToInsert = new WordRoot("دفع");
            _avlTree.Insert(nodeToInsert);
            Assert.Equal(nodeToInsert, _avlTree.GetValue(nodeToInsert));
            WordRoot nodeToDelete = new WordRoot("رفع");
            _avlTree.Delete(nodeToDelete);
            Assert.Null(_avlTree.GetValue(nodeToDelete));
        }
    }
}
