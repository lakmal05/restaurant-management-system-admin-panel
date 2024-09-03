import ApiService from "./apiService";

export async function makeAdvancePayment(data) {
  const apiObject = {};
  (apiObject.method = "POST"),
    (apiObject.authentication = true),
    (apiObject.isWithoutPrefix = false);
  apiObject.endpoint = `api/payment/advance-payment/create`;
  apiObject.body = data;
  return await ApiService.callApi(apiObject);
}

export async function getAllPayments(currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/admin/payment/find-all?perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function paymentsFiltration(data, currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/admin/payment/find-all?orderCode=${
    data?.orderCode
  }&email=${data?.email}&paymentStartDate=${data?.startDate}&paymentEndDate=${
    data?.endDate
  }&paymentStatus=${data?.PaymentStatus}&perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
