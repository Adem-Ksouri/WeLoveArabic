namespace WeLoveArabic.WebAPI.Services.DataStructures.LinkedList
{
    public class TLinkedListNode<T>
    {
        public T Value { get; set; }
        public TLinkedListNode<T>? Next { get; set; }

        public TLinkedListNode(T value)
        {
            Value = value;
            Next = null;
        }
    }

    public class TLinkedList<T>
    {
        private TLinkedListNode<T>? Head;
        private TLinkedListNode<T>? Tail;
        private int Count;

        public TLinkedList()
        {
            Head = Tail = null;
            Count = 0;
        }

        public TLinkedListNode<T>? GetHead() => Head;

        public TLinkedListNode<T>? GetTail() => Tail;

        public int GetSize() => Count;

        public void AddTail(T value)
        {
            TLinkedListNode<T> node = new TLinkedListNode<T>(value);

            if (Head == null)
                Head = Tail = node;
            else
            {

                Tail!.Next = node;
                Tail = node;
            }

            Count++;
        }

        public bool Delete(Predicate<T> match)
        {
            TLinkedListNode<T>? current = Head;
            TLinkedListNode<T>? previous = null;

            while (current != null)
            {
                if (match(current.Value))
                {
                    if (previous == null)
                        Head = current.Next;
                    else
                        previous.Next = current.Next;

                    if (current == Tail)
                    {
                        Tail = previous;

                        if (Tail != null)
                            Tail.Next = null;
                    }

                    Count--;
                    return true;
                }

                previous = current;
                current = current.Next;
            }

            return false;
        }

        public TLinkedListNode<T>? Find(Predicate<T> match)
        {
            TLinkedListNode<T>? current = Head;

            while (current != null)
            {
                if (match(current.Value))
                    return current;

                current = current.Next;
            }

            return null;
        }

        public bool Exist(Predicate<T> match)
        {
            TLinkedListNode<T>? current = Head;

            while (current != null)
            {
                if (match(current.Value))
                    return true;

                current = current.Next;
            }

            return false;
        }
    }
}
