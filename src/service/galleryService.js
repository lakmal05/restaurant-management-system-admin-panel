import ApiService from "./apiService";

export async function getAllGalleryImages(currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/gallery/find-all?perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function addGalleryImages(data) {
  const apiObject = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.urlencoded = false;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = "api/gallery/upload";
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function deleteGalleryImages(imageId) {
  const apiObject = {};
  apiObject.method = "DELETE",
  apiObject.authentication = true,
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/gallery/delete/${imageId}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

