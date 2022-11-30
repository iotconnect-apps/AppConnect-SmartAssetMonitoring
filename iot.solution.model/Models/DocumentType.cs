using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    /// <summary>
    /// DocumentTypes
    /// </summary>
    /// <seealso cref="ATune.Core.Services.Domain.Entity" />
    /// <seealso cref="ATune.Core.Services.Domain.IAggregateRoot" />
    [Table("DocumentType")]
    public class DocumentTypes 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("DocumentTypeId")]
        public int DocumentTypeId { get; set; }

        [Column("DocumentType")]
        public string DocumentType { get; set; }

        [Column("IsDeleted")]
        public bool IsDeleted { get; set; }
    }
}
