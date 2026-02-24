using Microsoft.AspNetCore.Mvc;
using WeLoveArabic.WebAPI.Models;
using WeLoveArabic.WebAPI.Services;

namespace WeLoveArabic.WebAPI.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class WeLoveArabicController : Controller
    {
        private readonly WeLoveArabicService _service;

        public WeLoveArabicController(WeLoveArabicService service)
        {
            _service = service;
        }

        [HttpGet("getRootsSorted")]
        public IActionResult GetRootsSorted() {
            var result = _service.GetAllRootsSorted();
            return Json(new GetRootsSortedResponse
            {
                Roots = result.Select(r => r.Root).ToList(),
            });
        }

        [HttpGet("getSchemas")]
        public IActionResult GetSchemas() {
            var result = _service.GetAllSchemas();
            return Json(new GetSchemasResponse
            {
                Schemas = result.Select(s => s.Schema).ToList(),
            });
        }

        [HttpPost("addRoots")]
        public IActionResult AddArabicRoots(List<string> roots)
        {
            if (roots == null)
                return BadRequest("Roots list cannot be null.");
            
            _service.AddArabicRoots(roots);
        
            return Ok("Roots added!");
        }

        [HttpPost("addSchemes")]
        public IActionResult AddArabicSchemas([FromBody] List<string> schemes)
        {
            if (schemes == null)
                return BadRequest("Schemes list cannot be null.");

            _service.AddArabicSchemes(schemes);

            return Ok("Schemes added!");
        }

        [HttpPost("generateWords")]
        public IActionResult GenerateArabicWords(string root, List<string> schemes)
        {
            var result = _service.GenerateArabicWords(root, schemes);
            
            return Json(new GenerateWordsResponse
            {
                DerivedWords = result,
            });
        }

        [HttpGet("verifyWord")]
        public IActionResult VerifyArabicWord(string root, string word)
        {
            string? result = _service.VerifyArabicWord(root, word);
           
            return Json(new VerifyArabicWordResponse
            {
                Success = result != null,
                Scheme = result,
            });
        }

        [HttpGet("listRootDetails")]
        public IActionResult ListRootDetails(string root)
        {
            var result = _service.ListRootDetails(root);

            return Json(new ListRootDetailsResponse
            {
                Success = result != null,
                DerivedWordsWithCount = result,
            });
        }

        [HttpGet("listAllRootsDetails")]
        public IActionResult ListAllRootsDetails()
        {
            var result = _service.ListAllRootsDetails();

            return Json(new ListRootDetailsResponse
            {
                Success = result != null,
                DerivedWordsWithCount = result
            });
        }
    }
}
