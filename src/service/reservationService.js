import ApiService from "./apiService";

export async function getAllReservations(currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/reservation/find-all?perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function updateReservationsStatus(reservationId, status) {
  const apiObject = {};
  (apiObject.method = "PATCH"),
    (apiObject.authentication = true),
    (apiObject.isWithoutPrefix = false);
  apiObject.endpoint = `api/reservation/accept-or-reject/${reservationId}?status=${status}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}

export async function reservationsFiltration(data, currentPage) {
  const apiObject = {};
  apiObject.method = "GET";
  apiObject.authentication = true;
  apiObject.isWithoutPrefix = false;
  apiObject.endpoint = `api/reservation/find-all?contactNo=${
    data?.contact
  }&email=${data?.email}&orderStartDate=${data?.startDate}&orderEndDate=${
    data?.endDate
  }&status=${data?.status}&perPage=${15}&page=${currentPage}`;
  apiObject.body = null;
  return await ApiService.callApi(apiObject);
}
