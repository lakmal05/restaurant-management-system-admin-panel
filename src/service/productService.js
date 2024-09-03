import ApiService from "./apiService";

export async function getAllProducts(currentPage) {
  const apiObject = {};
  (apiObject.method = "GET"),
    (apiObject.authentication = true),
    (apiObject.isWithoutPrefix = false);
  apiObject.endpoint = `api/product/find-all?perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getProductById(productId) {
  const apiObject = {};
  (apiObject.method = "GET"),
    (apiObject.authentication = true),
    (apiObject.isWithoutPrefix = false);
  apiObject.endpoint = `api/product/find-by-id/${productId}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function addNewProduct(data) {
  const apiObject = {};
  (apiObject.method = "POST"),
    (apiObject.authentication = true),
    (apiObject.isWithoutPrefix = false);
  apiObject.endpoint = `api/product/create`;
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function updateProduct(productId, data) {
  const apiObject = {};
  (apiObject.method = "PUT"),
    (apiObject.authentication = true),
    (apiObject.isWithoutPrefix = false);
  apiObject.endpoint = `api/product/update/${productId}`;
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function activeInactiveDeleteProduct(productId, status) {
  const apiObject = {};
  (apiObject.method = "PATCH"),
    (apiObject.authentication = true),
    (apiObject.isWithoutPrefix = false);
  apiObject.endpoint = `api/product/change-status/${productId}?status=${status}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function productsFiltration(data, currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/product/find-all?name=${data.name}&categoryId=${
    data.category
  }&status=${data.status}&maxPrice=${data.maxPrice}&minPrice=${
    data.minPrice
  }&perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
