CREATE TABLE [dbo].[Media](
	[MediaId] [uniqueidentifier] NOT NULL,
	[EntityTypeId] [int] NOT NULL,
	[EntityTypeValue] [varchar](150) NOT NULL,
	[Type] [int] NOT NULL,
	[Tag] [varchar](150) NULL,
	[Title] [varchar](250) NULL,
	[Description] [varchar](max) NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[ModifyDate] [datetime] NULL,
	[ModifyBy] [uniqueidentifier] NULL,
	[OrderNumber] INT NOT NULL DEFAULT 0, 
    PRIMARY KEY CLUSTERED 
(
	[MediaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Media] ADD  DEFAULT (newid()) FOR [MediaId]
GO
ALTER TABLE [dbo].[Media] ADD  DEFAULT (getutcdate()) FOR [CreatedDate]