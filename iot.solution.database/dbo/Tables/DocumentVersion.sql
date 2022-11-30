CREATE TABLE [dbo].[DocumentVersion](
	[DocumentVersionId] [uniqueidentifier] NOT NULL,
	[DocumentId] [uniqueidentifier] NOT NULL,
	[BlobFile] [varchar](max) NULL,
	[VersionNumber] [decimal](18, 2) NOT NULL,
	[Version] [varchar](50) NULL,
	[FileType] [varchar](50) NOT NULL,
	[FileSize] [decimal](18, 2) NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[ModifyDate] [datetime] NULL,
	[ModifyBy] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[DocumentVersionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[DocumentVersion] ADD  DEFAULT (newid()) FOR [DocumentVersionId]
GO
ALTER TABLE [dbo].[DocumentVersion] ADD  DEFAULT (getutcdate()) FOR [CreatedDate]