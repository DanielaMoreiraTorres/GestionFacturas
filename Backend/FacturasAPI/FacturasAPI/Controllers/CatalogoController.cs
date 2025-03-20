using FacturasAPI.Aplicacion.Catalogo;
using FacturasAPI.Aplicacion.Usuario;
using FacturasAPI.Dominio.Modelo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FacturasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CatalogoController : ControllerBase
    {
        private readonly ILogger<CatalogoController> _logger;
        private readonly ICatalogoServicio _catalogoServicio;

        public CatalogoController(ILogger<CatalogoController> logger, ICatalogoServicio catalogoServicio)
        {
            _logger = logger;
            _catalogoServicio = catalogoServicio;
        }

        [HttpGet("tipoIdentificacion")]
        public async Task<IActionResult> CatalogoTipoIdentificacion()
        {
            return Ok(await _catalogoServicio.CatalogoTipoIdentificacion());
        }
    }
}
