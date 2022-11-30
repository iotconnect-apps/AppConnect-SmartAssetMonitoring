using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iot.solution.model.Models
{
    /// <summary>
    /// DocumentShare
    /// </summary>
    /// <seealso cref="ATune.Core.Services.Domain.Entity" />
    /// <seealso cref="ATune.Core.Services.Domain.IAggregateRoot" />
    [Table("DocumentShare")]
    public class DocumentShare 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("DocumentShareId")]
        public Guid DocumentShareId { get; set; }

        [Column("DocumentId")]
        public Guid DocumentId { get; set; }

        [Column("UserTypeId")]
        public Nullable<int> UserTypeId { get; set; }

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
