
using ATune.Media.Nuget;
using ATune.Media.Nuget.Data;
using ATune.Media.Nuget.Extension;
using ATune.Media.Nuget.Interface;
using ATune.Media.Nuget.Request;
using ATune.Media.Nuget.Response;
using component.services.loghandler;
using iot.solution.common;
using iot.solution.entity;
using iot.solution.service.AppSetting;
using iot.solution.service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace iot.solution.service.Implementation
{
    public class MediaService : IMediaService
    {
        private readonly Logger _logger;
        private readonly IImageOperation _imageOperation;


        public MediaService(Logger logger, IImageOperation imageOperation)
        {
            _logger = logger;
            _imageOperation = imageOperation;
        }

        public (bool isSuccess, string response) AddImage(Guid guid, IFormFile image, string tag, int entityTypeId, int imageTypeId, int size, string blobName)
        {
            try
            {

                RequestAddEntityImage request = new RequestAddEntityImage();
                request.EntityValue = guid.ToString();
                request.Description = "ImageUpload";
                request.Tags = new List<string>() { tag };
                request.FileName = image.FileName;
                request.OrderNumber = 0;
                request.EntityTypeId = entityTypeId;
                request.ImageType = imageTypeId;
                request.BlobContainerName = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MediaBlobContainerName.ToString());
                var ms = new MemoryStream();
                image.CopyTo(ms);
                var fileBytes = ms.ToArray();
                request.FileContent = fileBytes;
                request.File = fileBytes;
                request.Size = size;


                var result = _imageOperation.AddImage(request).Result.ToString();
                return (true, result);

            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
                if (!string.IsNullOrWhiteSpace(e.InnerException.Message))
                {
                    return (false, e.InnerException.Message);
                }
                else
                {
                    return (false, "Something went wrong please try again");
                }
            }
        }

        public bool DeleteImage(string mediaId, string entityValue, int entityTypeId, int imageType, string blobContainerName, string tags)
        {
            try
            {

                var result = _imageOperation.DeleteImage(entityValue, entityTypeId, imageType, tags).Result.ToString();
                if (!string.IsNullOrEmpty(result))
                    return true;

            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
            }
            return false;
        }

        public string GetImage(int entityTypeId, string entityValue, int ImageType, int size, string tag, string blobContainerName)
        {
            string mediaUrl = string.Empty;
            try
            {
                ResponseGetEntityImageWithTagSize result = _imageOperation.GetImage(entityTypeId, entityValue, ImageType, size, tag).Result;
                if (result != null)
                {
                    var media = result.Media;
                    if (media != null && media.Any())
                    {
                        var img = media[0].Image;
                        if (img != null && img.Any())
                        {
                            mediaUrl = img[0].Url;
                        }
                    }
                }

            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
            }
            return mediaUrl;
        }

        public (bool isSuccess, string response) UpdateImage(Guid guid, IFormFile image, string tag, int entityTypeId, int imageTypeId, int size, string blobName, string mediaId)
        {
            try
            {

                RequestUpdateEntityImage request = new RequestUpdateEntityImage();
                request.EntityValue = guid.ToString();
                request.Description = "ImageUpload";
                request.Tags = new List<string>() { tag };
                request.FileName = image.FileName;
                request.OrderNumber = 0;
                request.EntityTypeId = entityTypeId;
                request.ImageType = imageTypeId;
                request.BlobContainerName = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MediaBlobContainerName.ToString());
                var ms = new MemoryStream();
                image.CopyTo(ms);
                var fileBytes = ms.ToArray();
                request.FileContent = fileBytes;
                request.File = fileBytes;
                request.Size = size;
                request.MediaId = mediaId;

                var result = _imageOperation.UpdateImage(request).Result.ToString();
                return (true, result);

            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
                if (!string.IsNullOrWhiteSpace(e.InnerException.Message))
                {
                    return (false, e.InnerException.Message);
                }
                else
                {
                    return (false, "Something went wrong please try again");
                }
            }
        }

        public string GetImageMediaId(int entityTypeId, string entityValue, int ImageType, int size, string tag, string blobContainerName)
        {
            string mediaId = string.Empty;
            try
            {
                ResponseGetEntityImageWithTagSize result = _imageOperation.GetImage(entityTypeId, entityValue, ImageType, size, tag).Result;
                if (result != null)
                {
                    var media = result.Media;
                    if (media != null && media.Any())
                    {
                        mediaId = media[0].MediaId;
                    }
                }
            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
            }
            return mediaId;
        }

        public List<DeviceMediaFiles> GetImageList(int entityTypeId, string entityValue, int ImageType, int size, string tag, string blobContainerName)
        {
            List<DeviceMediaFiles> imageList = new List<DeviceMediaFiles>();
            try
            {
                ResponseGetEntityImageWithTagSize result = _imageOperation.GetImage(entityTypeId, entityValue, ImageType, size, tag).Result;
                if (result != null)
                {
                    var media = result.Media;
                    if (media != null && media.Any())
                    {
                        foreach (var mediaObj in media)
                        {
                            if (mediaObj != null && mediaObj.Image.Count() > 0)
                            {
                                imageList.Add(new DeviceMediaFiles()
                                {
                                    FilePath = mediaObj.Image[0].Url,
                                    Guid = Guid.Parse(mediaObj.MediaId)
                                });

                            }
                        }
                    }
                }

            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
            }
            return imageList;
        }

        public bool DeleteImageByMediaId(string mediaId, string entityValue, int entityTypeId, int imageType, string tags)
        {
            try
            {

                var result = _imageOperation.DeleteImageByMediaId(mediaId, entityValue, entityTypeId, imageType, tags).Result.ToString();
                if (!string.IsNullOrEmpty(result))
                    return true;

            }
            catch (Exception e)
            {
                _logger.ErrorLog(e);
            }
            return false;
        }

    }
}

