using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    /// <summary>
    /// DocumentVersion
    /// </summary>
    /// <seealso cref="ATune.Core.Services.Domain.Entity" />
    /// <seealso cref="ATune.Core.Services.Domain.IAggregateRoot" />
    [Table("DocumentVersion")]
    public class DocumentVersion 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("DocumentVersionId")]
        public System.Guid DocumentVersionId { get; set; }

        [Column("DocumentId")]
        public System.Guid DocumentId { get; set; }

        [Column("BlobFile")]
        public string BlobFile { get; set; }

        [Column("VersionNumber")]
        public decimal VersionNumber { get; set; }

        [Column("Version")]
        public string Version { get; set; }

        [Column("FileType")]
        public string FileType { get; set; }

        [Column("FileSize")]
        public Nullable<decimal> FileSize { get; set; }

        [Column("CreatedDate")]
        public Nullable<System.DateTime> CreatedDate { get; set; }

        [Column("CreatedBy")]
        public Nullable<System.Guid> CreatedBy { get; set; }

        [Column("ModifyDate")]
        public Nullable<System.DateTime> ModifyDate { get; set; }

        [Column("ModifyBy")]
        public Nullable<System.Guid> ModifyBy { get; set; }
    }
}
