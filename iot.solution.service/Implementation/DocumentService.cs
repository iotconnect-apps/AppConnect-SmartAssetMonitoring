using iot.solution.service.Interface;
using ATune.Document.Nuget;
using component.services.loghandler;
using ATune.Media.Nuget.Interface;
using Microsoft.AspNetCore.Http;
using System;
using ATune.Document.Nuget.Application.Request;
using MediatR;
using System.Collections.Generic;
using System.IO;
using ATune.Media.Nuget;
using iot.solution.entity;
using ATune.Media.Nuget.Response;
using Azure;
using System.Drawing;
using ATune.Document.Nuget.Application.Response;

namespace iot.solution.service.Implementation
{
    public class DocumentService : IDocumentService
    {
        private readonly Logger _logger;
        private readonly IDocumentOprerations _documentOprerations;

        public DocumentService(Logger logger, IDocumentOprerations documentOprerations)
        {
            _logger = logger;
            _documentOprerations = documentOprerations;
        }

        public string AddDocument(Guid guid, IFormFile document, string tag, int documentTypeId)
        {
            try
            {
                RequestAddDocument requestAddDocument = new RequestAddDocument();
                requestAddDocument.EntityTypeValue = guid.ToString();
                requestAddDocument.EntityTypeId = Convert.ToInt16(documentTypeId);

                requestAddDocument.Description = "DocumentUpload";
                requestAddDocument.Tags = new List<string>() { tag };

                var ms = new MemoryStream();
                document.CopyTo(ms);
                var fileBytes = ms.ToArray();
                requestAddDocument.FileContent = fileBytes;
                requestAddDocument.FileName = document.FileName;
                requestAddDocument.Title = document.FileName;
                requestAddDocument.File = fileBytes;

                var result = _documentOprerations.AddDocument(requestAddDocument).Result.ToString();
                return result;


            }
            catch (Exception e)
            {

                _logger.ErrorLog(e);
            }

            return null;
        }

        public List<DeviceMediaFiles> GetImageList(int entityTypeId, string entityValue)
        {
            List<DeviceMediaFiles> documentList = new List<DeviceMediaFiles>();
            try
            {
                RequestGetDocumentByEntityValue request = new RequestGetDocumentByEntityValue();
                request.EntityTypeId = entityTypeId;
                request.EntityTypeValue = entityValue;

                List<ResponseGetDocumentByEntityValue> responseGetDocumentByEntityValues = new List<ResponseGetDocumentByEntityValue>();
                responseGetDocumentByEntityValues = _documentOprerations.GetDocumentByEntityValue(request).Result;

                if (responseGetDocumentByEntityValues.Count > 0)
                {
                    foreach (var fileObj in responseGetDocumentByEntityValues)
                    {
                        documentList.Add(new DeviceMediaFiles()
                        {
                            Guid = fileObj.DocumentId,
                            FilePath = fileObj.Url,
                            FileName = fileObj.Title,
                            Description = fileObj.Title
                        });
                    }
                }
            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
            }
            return documentList;


        }

        public bool DeleteDocument(int entityTypeId, string entityValue, Guid? documentId)
        {
            try
            {
                if (documentId == null)
                {
                    bool result = _documentOprerations.DeleteDocumentByEntity(entityTypeId, entityValue).Result;
                    return result;
                }
                else
                {
                    RequestDeleteDocument requestDeleteDocument = new RequestDeleteDocument();
                    requestDeleteDocument.EntityTypeValue = entityValue;
                    requestDeleteDocument.EntityTypeId = entityTypeId;
                    requestDeleteDocument.DocumentId = documentId.ToString();

                    var result = _documentOprerations.DeleteDocument(requestDeleteDocument).Result.ToString();
                    if (!string.IsNullOrEmpty(result))
                        return true;
                }



            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
            }
            return false;
        }
    }
}
