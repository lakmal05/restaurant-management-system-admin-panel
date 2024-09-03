import ApiService from "./apiService";

export async function getAllCategories(currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/admin/category/find-all?perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getAllCategoriesToDropDown() {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/admin/category/find-all`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function createCategory(data) {
  const apiObject = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.urlencoded = false;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/category/create`;
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function updateCategory(id, data) {
  const apiObject = {};
  apiObject.method = "PUT";
  apiObject.authentication = true;
  apiObject.urlencoded = false;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/category/update/${id}`;
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function deleteCategory(catId) {
  const apiObject = {};
  apiObject.method = "PATCH",
  apiObject.authentication = true,
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/category/change-status/${catId}?status=${0}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function categoryFiltration(data, currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/admin/category/find-all?name=${data.name}&status=${data.selectedStatus}&perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
