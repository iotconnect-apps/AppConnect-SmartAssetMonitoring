CREATE TABLE [dbo].[MediaTagDetail](
	[MediaTagDetailId] [uniqueidentifier] NOT NULL,
	[MediaTagId] [uniqueidentifier] NOT NULL,
	[MediaId] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MediaTagDetailId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[MediaTagDetail] ADD  DEFAULT (newid()) FOR [MediaTagDetailId]
GO