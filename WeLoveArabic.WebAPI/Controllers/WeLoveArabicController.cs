using Microsoft.AspNetCore.Mvc;
using WeLoveArabic.WebAPI.Models;
using WeLoveArabic.WebAPI.Services;
using WeLoveArabic.WebAPI.Services.Models;

namespace WeLoveArabic.WebAPI.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class WeLoveArabicController : Controller
    {
        private readonly WeLoveArabicService _service;
        
        [HttpPost("addRoots")]
        public IActionResult AddArabicRoot(List<string> roots)
        {
            return Ok("Roots added!");
        }

        [HttpPost("addSchemes")]
        public IActionResult AddArabicScheme(List<string> schemes)
        {
            return Ok("Scheme added!");
        }

        [HttpPost("generateWord")]
        public IActionResult GenerateArabicWords(string root, List<string> schemes)
        {
            var result = new GenerateWordsResponse
            {
                DerivedWords = new List<DerivedWord>()
            };
            return Json(result);
        }

        [HttpGet("verifyWord")]
        public IActionResult VerifyArabicWord(string root, string word)
        {
            var result = new VerifyArabicWordResponse
            {
                Success = true,
                Scheme = "",
            };
            return Json(result);
        }

        [HttpGet("listRootDetails")]
        public IActionResult ListRootDetails(string root)
        {
            var result = new ListRootDetailsResponse
            {   
                Success = true,
                DerivedWordsWithCount = new List<(DerivedWord, int)>(),
            };
            return Json(result);
        }
    }
}
