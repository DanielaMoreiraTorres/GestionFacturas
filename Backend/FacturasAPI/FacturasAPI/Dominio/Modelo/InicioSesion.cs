using System.ComponentModel.DataAnnotations;

namespace FacturasAPI.Dominio.Modelo
{
    public class InicioSesion
    {
        [Required]
        [StringLength(75)]
        public string Usuario { get; set; } = string.Empty;

        [Required]
        [StringLength(500, MinimumLength = 5)]
        public string Contrasena { get; set; } = string.Empty;
    }
}
