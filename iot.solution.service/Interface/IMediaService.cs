using iot.solution.entity;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iot.solution.service.Interface
{
    public interface IMediaService
    {
        (bool isSuccess, string response) AddImage(Guid guid, IFormFile image, string tag, int entityTypeId, int imageTypeId, int size, string blobName);

        bool DeleteImage(string mediaId, string entityValue, int entityTypeId, int imageType, string blobContainerName, string tags);

        (bool isSuccess, string response) UpdateImage(Guid guid, IFormFile image, string tag, int entityTypeId, int imageTypeId, int size, string blobName, string mediaId);
        string GetImage(int entityTypeId, string entityValue, int ImageType, int size, string tag, string blobContainerName);

        string GetImageMediaId(int entityTypeId, string entityValue, int ImageType, int size, string tag, string blobContainerName);

        List<DeviceMediaFiles> GetImageList(int entityTypeId, string entityValue, int ImageType, int size, string tag, string blobContainerName);

        public bool DeleteImageByMediaId(string mediaId, string entityValue, int entityTypeId, int imageType, string tags);

    }
}
