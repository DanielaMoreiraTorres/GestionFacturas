using FacturasAPI.Aplicacion.Cliente;
using FacturasAPI.Aplicacion.Producto;
using FacturasAPI.Aplicacion.Usuario;
using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Dominio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FacturasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductoController : ControllerBase
    {
        private readonly ILogger<ProductoController> _logger;
        private readonly IProductoServicio _productoServicio;

        public ProductoController(ILogger<ProductoController> logger, IProductoServicio productoServicio)
        {
            _logger = logger;
            _productoServicio = productoServicio;
        }

        [HttpPost]
        public async Task<IActionResult> Listar([FromBody] PeticionLista modelo)
        {
            return Ok(await _productoServicio.Listar(modelo));
        }

        [HttpPost("nuevo")]
        public async Task<IActionResult> Agregar([FromBody] Producto modelo)
        {
            return Ok(await _productoServicio.Agregar(modelo));
        }

        [HttpPut("modificar/{id}")]
        public async Task<IActionResult> Modificar(int id, [FromBody] Producto modelo)
        {
            return Ok(await _productoServicio.Modificar(id, modelo));
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            return Ok(await _productoServicio.Eliminar(id));
        }
    }
}
