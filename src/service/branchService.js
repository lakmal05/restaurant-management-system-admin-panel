import ApiService from "./apiService";

export async function getAllBranches(currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/store-locator/find-all?perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function createBranch(data) {
  const apiObject = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.urlencoded = false;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = "api/store-locator/create";
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function updateBranch(storeId, data) {
  const apiObject = {};
  apiObject.method = "PUT";
  apiObject.authentication = true;
  apiObject.urlencoded = false;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/store-locator/update/${storeId}`;
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function deleteBranch(storeId) {
  const apiObject = {};
  apiObject.method = "DELETE",
  apiObject.authentication = true,
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/store-locator/delete/${storeId}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getAllBranchesFiltration(data, currentPage) {
  const apiObject = {};
  apiObject.method = "GET",
  apiObject.authentication = true,
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/store-locator/find-all?name=${data?.name}&address=${data?.address}&perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
