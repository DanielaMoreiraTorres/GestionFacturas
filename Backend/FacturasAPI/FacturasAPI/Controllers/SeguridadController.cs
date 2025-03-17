using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FacturasAPI.Aplicacion.Usuario;
using FacturasAPI.Dominio.Modelo;

namespace FacturasAPI.Controllers
{

    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class SeguridadController : ControllerBase
    {
        private readonly ILogger<SeguridadController> _logger;
        private readonly IUsuarioServicio _usuarioServicio;

        public SeguridadController(ILogger<SeguridadController> logger, IUsuarioServicio usuarioServicio)
        {
            _logger = logger;
            _usuarioServicio = usuarioServicio;
        }

        [HttpPost("inicioSesion")]
        [AllowAnonymous]
        public async Task<IActionResult> InicioSesion([FromBody] InicioSesion datos)
        {
            return Ok(await _usuarioServicio.InicioSesion(datos));
        }
    }
}
