using Microsoft.AspNetCore.Mvc;

namespace WeLoveArabic.WebAPI.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class WeLoveArabicController : Controller
    {
        [HttpPost("addRoot")]
        public IActionResult AddArabicRoot(string root)
        {
            return Ok("Root added!");
        }

        [HttpPost("addScheme")]
        public IActionResult AddArabicScheme(string scheme)
        {
            return Ok("Scheme added!");
        }

        [HttpPost("generateWord")]
        public IActionResult GenerateArabicWord(string root, string scheme)
        {
            return Ok("Generated word!");
        }

        [HttpGet("verifyWord")]
        public IActionResult VerifyArabicWord(string root, string word)
        {
            return Ok("Word is valid!");
        }

        [HttpGet("listRootDetails")]
        public IActionResult ListRootDetails(string root)
        {
            return Ok("Here is the root details");
        }
    }
}
