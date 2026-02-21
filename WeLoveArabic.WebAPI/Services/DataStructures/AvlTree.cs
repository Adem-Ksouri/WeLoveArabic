namespace WeLoveArabic.WebAPI.Services.DataStructures
{
    public class AvlNode<T> where T : IComparable<T>
    {
        public T Value { get; set; }
        public AvlNode<T>? Left { get; set; }
        public AvlNode<T>? Right { get; set; }
        public int Height { get; set; }

        public AvlNode(T value)
        {
            Value = value;
            Left = null;
            Right = null;
            Height = 1;
        }

        public void RecalcHeight()
        {
            Height = 1 + Math.Max(GetRightHeight(), GetLeftHeight());
        }

        public int GetBalance()
        {
            return GetLeftHeight() - GetRightHeight();
        }

        private int GetLeftHeight()
        {
            return Left?.Height ?? 0;
        }

        private int GetRightHeight()
        {
            return Right?.Height ?? 0;
        }
    }

    public class AvlTree<T> where T : IComparable<T>
    {
        private AvlNode<T>? AvlRoot;

        public AvlTree(){
            AvlRoot = null;
        }

        public T? GetValue(T valueToSearch)
        {
            if (AvlRoot == null) 
                return default;
            AvlNode<T> temp = AvlRoot;
            while (temp != null)
            {
                if (temp.Value.CompareTo(valueToSearch) == 0)
                    break;
                if (temp.Value.CompareTo(valueToSearch) > 0)
                    temp = temp.Left;
                else
                    temp = temp.Right;
            }
            return temp != null ? temp.Value : default;
        }

        public void Insert(T value)
        {
            AvlRoot = DoInsert(AvlRoot, value);
        }

        public void Delete(T value)
        {
            AvlRoot = DoDelete(AvlRoot, value);
        }

        private AvlNode<T> DoInsert(AvlNode<T>? node, T valueToInsert)
        {
            if (node == null)
                return new AvlNode<T>(valueToInsert);

            if (node.Value.CompareTo(valueToInsert) > 0)
                node.Left = DoInsert(node.Left, valueToInsert);
            else if (node.Value.CompareTo(valueToInsert) < 0)
                node.Right = DoInsert(node.Right, valueToInsert);
            else
                return node;

            node.RecalcHeight();
            node = MakeBalancedAfterInsert(node, valueToInsert);

            return node;
        }

        private AvlNode<T>? DoDelete(AvlNode<T>? node, T value)
        {
            if (node == null)
                return null;
            if (node.Value.CompareTo(value) > 0)
            {
                node.Left = DoDelete(node.Left, value);
            }
            else if (node.Value.CompareTo(value) < 0)
            {
                node.Right = DoDelete(node.Right, value);
            }
            else
            {
                if (node.Right == null)
                {
                    return node.Left;
                }
                else if (node.Left == null)
                {
                    return node.Right;
                }
                else
                {
                    T minInRightSubTree = GetMinInSubtree(node.Right);
                    node.Right = DoDelete(node.Right, minInRightSubTree);
                    node.Value = minInRightSubTree;
                }
            }

            node.RecalcHeight();
            node = MakeBalancedAfterDelete(node);

            return node;
        }

        private T GetMinInSubtree(AvlNode<T> root)
        {
            AvlNode<T> temp = root;
            while (temp.Left != null)
                temp = temp.Left;
            return temp.Value;
        }

        private AvlNode<T> MakeBalancedAfterInsert(AvlNode<T> node, T valueToInsert)
        {
            int balance = node.GetBalance();
            
            if (balance > 1 && node.Left.Value.CompareTo(valueToInsert) > 0)
                return RotateRight(node);
            if (balance < -1 && node.Right.Value.CompareTo(valueToInsert) < 0)
                return RotateLeft(node);
            if (balance > 1 && node.Left.Value.CompareTo(valueToInsert) < 0)
            {
                node.Left = RotateLeft(node.Left);
                return RotateRight(node);
            }
            if (balance < -1 && node.Right.Value.CompareTo(valueToInsert) > 0)
            {
                node.Right = RotateRight(node.Right);
                return RotateLeft(node);
            }

            return node;
        }

        private AvlNode<T> MakeBalancedAfterDelete(AvlNode<T> node)
        {
            int balance = node.GetBalance();

            if (balance > 1 && node.Left.GetBalance() >= 0)
                return RotateRight(node);
            if (balance < -1 && node.Right.GetBalance() <= 0)
                return RotateLeft(node);
            if (balance > 1 && node.Left.GetBalance() < 0)
            {
                node.Left = RotateLeft(node.Left);
                return RotateRight(node);
            }
            if (balance < -1 && node.Right.GetBalance() > 0)
            {
                node.Right = RotateRight(node.Right);
                return RotateLeft(node);
            }

            return node;
        }

        private AvlNode<T> RotateRight(AvlNode<T> root)
        {
            if (root.Left == null)
                return root;
            AvlNode<T> nwRoot = root.Left;
            AvlNode<T> temp = nwRoot.Right;
            nwRoot.Right = root;
            root.Left = temp;

            root.RecalcHeight();
            nwRoot.RecalcHeight();

            return nwRoot;
        }

        private AvlNode<T> RotateLeft(AvlNode<T> root)
        {
            if (root.Right == null)
                return root;
            AvlNode<T> nwRoot = root.Right;
            AvlNode<T>? temp = nwRoot.Left;
            nwRoot.Left = root;
            root.Right = temp;

            root.RecalcHeight();
            nwRoot.RecalcHeight();

            return nwRoot;
        }
    }
}
