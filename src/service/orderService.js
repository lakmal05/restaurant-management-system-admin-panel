import ApiService from "./apiService";

export async function getAllOrders(currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/order/find-all?perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getOrderByOrderId(orderId) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/order/find-by-id/${orderId}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function getAllOrderStatus() {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = "api/order-status/find-all";
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function updateOrdersStatus(orderId, status) {
  const apiObject = {};
  (apiObject.method = "PATCH"),
    (apiObject.authentication = true),
    (apiObject.isWithoutPrefix = false);
  apiObject.endpoint = `api/order/update-status/${orderId}?status=${status}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function placeOrder(data) {
  const apiObject = {};
  apiObject.method = "POST";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = "api/order/create";
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function ordersFiltration(data, currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/order/find-all?orderCode=${data?.orderCode}&email=${
    data?.email
  }&contactNo=${data?.contact}&orderStartDate=${data?.startDate}&orderEndDate=${
    data?.endDate
  }&status=${data?.status}&orderType=${
    data?.orderType
  }&perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
