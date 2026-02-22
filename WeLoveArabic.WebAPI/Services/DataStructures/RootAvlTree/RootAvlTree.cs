using WeLoveArabic.WebAPI.Services.DataStructures.AvlTree;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabic.WebAPI.Services.DataStructures.RootAvlTree
{
    public class RootAvlTree
    {
        public AvlTree<WordRoot> Tree { get; set; } = new AvlTree<WordRoot>();
    }
}
