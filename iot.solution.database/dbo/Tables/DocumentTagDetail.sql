CREATE TABLE [dbo].[DocumentTagDetail](
	[DocumentTagDetailId] [uniqueidentifier] NOT NULL,
	[DocumentTagId] [uniqueidentifier] NOT NULL,
	[DocumentId] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DocumentTagDetailId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[DocumentTagDetail] ADD  DEFAULT (newid()) FOR [DocumentTagDetailId]