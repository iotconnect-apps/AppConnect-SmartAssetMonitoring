using iot.solution.entity;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iot.solution.service.Interface
{
    public interface IDocumentService
    {
        string AddDocument(Guid guid, IFormFile image, string tag, int documentTypeId);

        List<DeviceMediaFiles> GetImageList(int entityTypeId, string entityValue);

        bool DeleteDocument(int entityTypeId, string entityValue, Guid? documentId);
    }
}
