using WeLoveArabic.WebAPI.Services;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabicTests
{
    public class WeLoveArabicServiceTests
    {
        private readonly WeLoveArabicService _service = new WeLoveArabicService();

        [Fact]
        public void AddArabicRoots_Test()
        {
            List<string> roots = new List<string> { "كتب", "رفع", "رسم" };
            _service.AddArabicRoots(roots);
            List<WordRoot> addedRoots = _service.GetAllRootsSorted();
            Assert.NotNull(addedRoots);
            Assert.Equal(3, addedRoots.Count);
            Assert.Equal("رسم", addedRoots[0].Root);
            Assert.Equal("رفع", addedRoots[1].Root);
            Assert.Equal("كتب", addedRoots[2].Root);
        }

        [Fact]
        public void DeleteArabicRoot_Test()
        {
            List<string> roots = new List<string> { "كتب", "رفع", "رسم" };
            _service.AddArabicRoots(roots);
            _service.DeleteArabicRoot("رفع");
            List<WordRoot> addedRoots = _service.GetAllRootsSorted();
            
            Assert.NotNull(addedRoots);
            Assert.Equal(2, addedRoots.Count);
            Assert.Equal("رسم", addedRoots[0].Root);
            Assert.Equal("كتب", addedRoots[1].Root);
        }

        [Fact]
        public void AddArabicSchemes_Test()
        {
            List<string> schemes = new List<string> { "فاعل", "مفعول", "فعول" };
            _service.AddArabicSchemes(schemes);
            List<string> addedSchemes = _service.GetAllSchemas().Select(s => s.Schema).ToList();

            Assert.NotNull(addedSchemes);
            Assert.Equal(3, addedSchemes.Count);
            Assert.True(addedSchemes.Contains("فاعل"));
            Assert.True(addedSchemes.Contains("مفعول"));
            Assert.True(addedSchemes.Contains("فعول"));
        }

        [Fact]
        public void UpdateArabicScheme_Test()
        {
            List<string> schemes = new List<string> { "فاعل", "مفعول", "فعول" };
            _service.AddArabicSchemes(schemes);
            _service.UpdateArabicScheme("مفعول", "مفعول به");
            List<string> addedSchemes = _service.GetAllSchemas().Select(s => s.Schema).ToList();

            Assert.NotNull(addedSchemes);
            Assert.Equal(3, addedSchemes.Count);
            Assert.Contains("فاعل", addedSchemes);
            Assert.Contains("مفعول به", addedSchemes);
            Assert.Contains("فعول", addedSchemes);
            Assert.DoesNotContain("مفعول", addedSchemes);
        }

        [Fact]
        public void RemoveArabicScheme_Test()
        {
            List<string> schemes = new List<string> { "فاعل", "مفعول", "فعول" };
            _service.AddArabicSchemes(schemes);
            _service.RemoveArabicScheme("مفعول");
            List<string> addedSchemes = _service.GetAllSchemas().Select(s => s.Schema).ToList();

            Assert.NotNull(addedSchemes);
            Assert.Equal(2, addedSchemes.Count);
            Assert.True(addedSchemes.Contains("فاعل"));
            Assert.True(addedSchemes.Contains("فعول"));
            Assert.False(addedSchemes.Contains("مفعول"));
        }

        [Fact]
        public void GenerateArabicWords_Test()
        {
            List<string> roots = new List<string> { "كتب" };
            List<string> schemes = new List<string> { "فاعل", "مفعول" };
            _service.AddArabicRoots(roots);
            _service.AddArabicSchemes(schemes);
            List<string> generatedWords = _service.GenerateArabicWords("كتب", schemes).Select(s => s.Word).ToList();
            Assert.NotNull(generatedWords);
            Assert.Equal(2, generatedWords.Count);
            Assert.Contains("كاتب", generatedWords);
            Assert.Contains("مكتوب", generatedWords);
        }

        [Fact]
        public void VerifyArabicWord_Test()
        {
            List<string> roots = new List<string> { "كتب" };
            List<string> schemes = new List<string> { "فاعل", "مفعول" };
            _service.AddArabicRoots(roots);
            _service.AddArabicSchemes(schemes);
            string? result1 = _service.VerifyArabicWord("كتب", "كاتب");
            string? result2 = _service.VerifyArabicWord("كتب", "مكتوب");
            string? result3 = _service.VerifyArabicWord("كتب", "كتاب");

            Assert.NotNull(result1);
            Assert.Equal("فاعل", result1);

            Assert.NotNull(result2);
            Assert.Equal("مفعول", result2);

            Assert.Null(result3);
        }

        [Fact]
        public void ListRootDetails_Test()
        {
            List<string> roots = new List<string> { "كتب" };
            List<string> schemes = new List<string> { "فاعل", "مفعول" };
            _service.AddArabicRoots(roots);
            _service.AddArabicSchemes(schemes);

            _service.GenerateArabicWords("كتب", schemes);
            var fsResult = _service.ListRootDetails("كتب");

            Assert.NotNull(fsResult);
            Assert.Equal(2, fsResult.Count);
            Assert.Contains(fsResult, kvp => kvp.Key.Word == "كاتب" && kvp.Key.Scheme == "فاعل" && kvp.Value == 1);
            Assert.Contains(fsResult, kvp => kvp.Key.Word == "مكتوب" && kvp.Key.Scheme == "مفعول" && kvp.Value == 1);

            _service.GenerateArabicWords("كتب", schemes);
            var scResult = _service.ListRootDetails("كتب");

            Assert.NotNull(scResult);
            Assert.Equal(2, scResult.Count);
            Assert.Contains(scResult, kvp => kvp.Key.Word == "كاتب" && kvp.Key.Scheme == "فاعل" && kvp.Value == 2);
            Assert.Contains(scResult, kvp => kvp.Key.Word == "مكتوب" && kvp.Key.Scheme == "مفعول" && kvp.Value == 2);
            Assert.DoesNotContain(scResult, kvp => kvp.Key.Word == "كاتب" && kvp.Key.Scheme == "فاعل" && kvp.Value == 1);
            Assert.DoesNotContain(scResult, kvp => kvp.Key.Word == "مكتوب" && kvp.Key.Scheme == "مفعول" && kvp.Value == 1);
        }
    }
}
