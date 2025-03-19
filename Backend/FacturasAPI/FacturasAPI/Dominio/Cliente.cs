using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacturasAPI.Dominio
{
    [Table("cliente")]
    public class Cliente
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int? Id { get; set; }

        [Required]
        [StringLength(500)]
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [Column("tipoIdentificacion")]
        public int TipoIdentificacion { get; set; }

        [Required]
        [StringLength(15)]
        [Column("identificacion")]
        public string Identificacion { get; set; } = string.Empty;

        [StringLength(15)]
        [Column("telefono")]
        public string? Telefono { get; set; }

        [StringLength(100)]
        [Column("correo")]
        public string? Correo { get; set; }

        [Column("direccion")]
        public string? Direccion { get; set; }

        [Required]
        [Column("activo")]
        public bool Activo { get; set; } = true;

        [Column("fechaCreacion")]
        public DateTime? FechaCreacion { get; set; }

        [Column("fechaActualizacion")]
        public DateTime? FechaActualizacion { get; set; }

        [Column("usuarioCreacion")]
        public int? UsuarioCreacion { get; set; }

        [Column("usuarioActualizacion")]
        public int? UsuarioActualizacion { get; set; }

        [ForeignKey("UsuarioCreacion")]
        public Usuario? UsuarioObj { get; set; }

        [ForeignKey("TipoIdentificacion")]
        public TipoIdentificacion? TipoIdentificacionObj { get; set; }
    }
}
