using FacturasAPI.Aplicacion.Usuario;
using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Dominio;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FacturasAPI.Aplicacion.Cliente;

namespace FacturasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClienteController : ControllerBase
    {
        private readonly ILogger<ClienteController> _logger;
        private readonly IClienteServicio _clienteServicio;

        public ClienteController(ILogger<ClienteController> logger, IClienteServicio clienteServicio)
        {
            _logger = logger;
            _clienteServicio = clienteServicio;
        }

        [HttpPost]
        public async Task<IActionResult> Listar([FromBody] PeticionLista modelo)
        {
            return Ok(await _clienteServicio.Listar(modelo));
        }

        [HttpPost("nuevo")]
        public async Task<IActionResult> Agregar([FromBody] Cliente modelo)
        {
            return Ok(await _clienteServicio.Agregar(modelo));
        }

        [HttpPut("modificar/{id}")]
        public async Task<IActionResult> Modificar(int id, [FromBody] Cliente modelo)
        {
            return Ok(await _clienteServicio.Modificar(id, modelo));
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            return Ok(await _clienteServicio.Eliminar(id));
        }
    }
}
