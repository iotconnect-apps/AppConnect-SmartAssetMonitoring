using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    /// <summary>
    /// DocumentTags
    /// </summary>
    /// <seealso cref="ATune.Core.Services.Domain.Entity" />
    /// <seealso cref="ATune.Core.Services.Domain.IAggregateRoot" />
    [Table("DocumentTag")]
    public class DocumentTags 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("DocumentTagId")]
        public System.Guid DocumentTagId { get; set; }

        [Column("DocumentTag")]
        public string DocumentTag { get; set; }

        [Column("IsDeleted")]
        public bool IsDeleted { get; set; }
    }
}
