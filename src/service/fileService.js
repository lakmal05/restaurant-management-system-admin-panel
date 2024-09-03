import ApiService from "./apiService";

export async function upload(data) {
  const apiObject = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = "api/files/upload";
  apiObject.multipart = true;
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}
