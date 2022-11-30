using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    /// <summary>
    /// Documents
    /// </summary>
    /// <seealso cref="ATune.Core.Services.Domain.Entity" />
    /// <seealso cref="ATune.Core.Services.Domain.IAggregateRoot" />
    [Table("Document")]
    public class Documents 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("DocumentId")]
        public Guid DocumentId { get; set; }

        [Column("DocumentTypeId")]
        public Int16? DocumentTypeId { get; set; }

        [Column("EntityTypeId")]
        public int EntityTypeId { get; set; }

        [Column("EntityTypeValue")]
        public string EntityTypeValue { get; set; }

        [Column("Title")]
        public string Title { get; set; }

        [Column("Description")]
        public string Description { get; set; }

        [Column("VersionNumber")]
        public decimal VersionNumber { get; set; }

        [Column("CreatedDate")]
        public Nullable<System.DateTime> CreatedDate { get; set; }

        [Column("CreatedBy")]
        public Nullable<System.Guid> CreatedBy { get; set; }

        [Column("ModifyDate")]
        public Nullable<System.DateTime> ModifyDate { get; set; }

        [Column("ModifyBy")]
        public Nullable<System.Guid> ModifyBy { get; set; }

        [Column("IsArchive")]
        public bool IsArchive { get; set; }

    }
}
