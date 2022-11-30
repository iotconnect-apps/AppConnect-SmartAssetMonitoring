CREATE TABLE [dbo].[MediaSize](
	[MediaSizeId] [int] IDENTITY(1,1) NOT NULL,
	[MediaSizeName] [varchar](20) NOT NULL,
	[MediaSizeValue] [int] NOT NULL,
	[MediaSizeRatio] [varchar](20) NOT NULL,
	[IsDeleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[MediaSizeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[MediaSize] ADD  DEFAULT ((0)) FOR [IsDeleted]