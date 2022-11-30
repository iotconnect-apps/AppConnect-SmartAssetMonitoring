CREATE TABLE [dbo].[MediaDetail](
	[MediaDetailId] [uniqueidentifier] NOT NULL,
	[MediaId] [uniqueidentifier] NOT NULL,
	[MediaSizeId] [int] NOT NULL,
	[BlobFile] [varchar](max) NULL,
	[Format] [varchar](150) NULL,
	[Width] [int] NULL,
	[Height] [int] NULL,
	[Size] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[MediaDetailId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[MediaDetail] ADD  DEFAULT (newid()) FOR [MediaDetailId]