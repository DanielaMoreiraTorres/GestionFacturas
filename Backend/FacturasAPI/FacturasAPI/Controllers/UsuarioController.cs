using FacturasAPI.Aplicacion.Usuario;
using FacturasAPI.Dominio;
using FacturasAPI.Dominio.Modelo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FacturasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuarioController : ControllerBase
    {
        private readonly ILogger<UsuarioController> _logger;
        private readonly IUsuarioServicio _usuarioServicio;

        public UsuarioController(ILogger<UsuarioController> logger, IUsuarioServicio usuarioServicio)
        {
            _logger = logger;
            _usuarioServicio = usuarioServicio;
        }

        [HttpPost]
        public async Task<IActionResult> Listar([FromBody] PeticionLista modelo)
        {
            return Ok(await _usuarioServicio.Listar(modelo));
        }

        [HttpPost("nuevo")]
        public async Task<IActionResult> Agregar([FromBody] Usuario modelo)
        {
            return Ok(await _usuarioServicio.Agregar(modelo));
        }

        [HttpPut("modificar/{id}")]
        public async Task<IActionResult> Modificar(int id, [FromBody] Usuario modelo)
        {
            return Ok(await _usuarioServicio.Modificar(id, modelo));
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            return Ok(await _usuarioServicio.Eliminar(id));
        }
    }
}
