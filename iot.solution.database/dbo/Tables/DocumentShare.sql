CREATE TABLE [dbo].[DocumentShare](
	[DocumentShareId] [uniqueidentifier] NOT NULL,
	[DocumentId] [uniqueidentifier] NOT NULL,
	[UserTypeId] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[ModifyDate] [datetime] NULL,
	[ModifyBy] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[DocumentShareId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[DocumentShare] ADD  DEFAULT (newid()) FOR [DocumentShareId]
GO
ALTER TABLE [dbo].[DocumentShare] ADD  DEFAULT (getutcdate()) FOR [CreatedDate]