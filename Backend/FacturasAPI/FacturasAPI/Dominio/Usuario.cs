using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FacturasAPI.Dominio
{
    [Table("usuario")]
    public class Usuario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int? Id { get; set; }

        [Required]
        [StringLength(100)]
        [Column("nombres")]
        public string Nombres { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [Column("apellidos")]
        public string Apellidos { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        [Column("usuario")]
        public string NombreUsuario { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [Column("correo")]
        public string Correo { get; set; } = string.Empty;

        [StringLength(500, MinimumLength = 5)]
        //[JsonIgnore]
        [Column("contrasena")]
        public string? Contrasena { get; set; }

        [Required]
        [Column("activo")]
        public bool Activo { get; set; } = true;

        [Column("fechaCreacion")]
        public DateTime? FechaCreacion { get; set; }

        [Column("fechaActualizacion")]
        public DateTime? FechaActualizacion { get; set; }

        [Column("token")]
        public string? Token { get; set; }

        [Column("refreshToken")]
        public string? RefreshToken { get; set; }

        [Column("expiracionToken")]
        public DateTime? ExpiracionToken { get; set; }
    }
}
