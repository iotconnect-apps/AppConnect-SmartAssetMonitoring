CREATE TABLE [dbo].[MediaTag](
	[MediaTagId] [uniqueidentifier] NOT NULL,
	[MediaTag] [varchar](100) NOT NULL,
	[IsDeleted] [bit] NULL,
 CONSTRAINT [PK__Media__960CE415519E60CB] PRIMARY KEY CLUSTERED 
(
	[MediaTagId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[MediaTag] ADD  CONSTRAINT [DF__MediaT__Docum__239E4DCF]  DEFAULT (newid()) FOR [MediaTagId]
GO

ALTER TABLE [dbo].[MediaTag] ADD  CONSTRAINT [DF__MediaT__IsDel__24927208]  DEFAULT ((0)) FOR [IsDeleted]
GO