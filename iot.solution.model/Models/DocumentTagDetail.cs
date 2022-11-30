using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    /// <summary>
    /// DocumentTagDetail
    /// </summary>
    /// <seealso cref="ATune.Core.Services.Domain.Entity" />
    /// <seealso cref="ATune.Core.Services.Domain.IAggregateRoot" />
    [Table("DocumentTagDetail")]
    public class DocumentTagDetail 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("DocumentTagDetailId")]
        public System.Guid DocumentTagDetailId { get; set; }

        [Column("DocumentTagId")]
        public System.Guid DocumentTagId { get; set; }

        [Column("DocumentId")]
        public System.Guid DocumentId { get; set; }
    }
}
