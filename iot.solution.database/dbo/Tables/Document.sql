CREATE TABLE [dbo].[Document](
	[DocumentId] [uniqueidentifier] NOT NULL,
	[DocumentTypeId] [smallint] NULL,
	[EntityTypeId] [int] NOT NULL,
	[EntityTypeValue] [varchar](200) NULL,
	[Title] [varchar](250) NOT NULL,
	[Description] [varchar](max) NULL,
	[VersionNumber] [decimal](18, 2) NOT NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[ModifyDate] [datetime] NULL,
	[ModifyBy] [uniqueidentifier] NULL,
	[IsArchive] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[DocumentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Document] ADD  DEFAULT (newid()) FOR [DocumentId]
GO
ALTER TABLE [dbo].[Document] ADD  DEFAULT (getutcdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Document] ADD  DEFAULT ((0)) FOR [IsArchive]