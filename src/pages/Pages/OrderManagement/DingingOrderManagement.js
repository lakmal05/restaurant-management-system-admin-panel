import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  CardBody,
  CardHeader,
  Label,
  Input,
  Button,
} from "reactstrap";
import { handleError, popUploader } from "../../../common/commonFunctions";
import { DiningOrderListTableColumns } from "../../../common/tableColumns";
import { Table } from "antd";
import { Pagination } from "antd";
import { DatePicker } from "antd";
import moment from "moment"; // Import moment
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import * as orderService from "../../../service/orderService";
import { Plus } from "react-feather";

const DingingOrderManagement = () => {
  document.title = "Dining Orders | Restaurant";

  const history = useNavigate();
  const dispatch = useDispatch();

  const [orderList, setOrderList] = useState([]);
  const [searchOrderCode, setSearchOrderCode] = useState("");
  const [searchCustomerEmail, setSearchCustomerEmail] = useState("");
  const [searchCustomerContactNo, setSearchCustomerContactNo] = useState("");
  const [searchDateRange, setSearchDateRange] = useState("");

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  const { RangePicker } = DatePicker;

  useEffect(() => {
    loadAllOrders(currentPage);
  }, []);

  const loadAllOrders = async (currentPage) => {
    let temp = [];
    clearFiltrationFields();
    popUploader(dispatch, true);
    await orderService
      .getAllOrders(currentPage)
      .then((resp) => {
        console.log(resp);
        resp?.data?.map((ord, index) => {
          if (ord?.orderType === "DINING") {
            temp.push({
              orderCode: ord?.orderCode,
              cusEmail: ord?.email,
              contactNo: ord?.contactNo,
              orderDate: moment(ord?.createdAt).format("YYYY-MM-DD"),
              total: parseFloat(ord?.subTotal).toFixed(2),
              paymentType: ord?.paymentType,
              action: (
                <>
                  <Button
                    onClick={() =>
                      history("/order-detail", {
                        state: { orderData: ord?.id },
                      })
                    }
                    color="primary"
                    outline
                    className="m-2"
                  >
                    View
                  </Button>
                </>
              ),
            });
          }
        });
        setOrderList(temp);
        setCurrentPage(resp?.data?.currentPage);
        setTotalRecodes(resp?.data?.totalRecords);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        console.log(err);
        popUploader(dispatch, false);
        handleError(err);
      })
      .finally();
  };

  const handleSearchOrderFiltration = (
    orderCode,
    email,
    Contact,
    dateRange,
    currentPage
  ) => {
    if (
      !orderCode &&
      !email &&
      !Contact &&
      (dateRange === undefined || dateRange === null || dateRange === "")
    ) {
      loadAllOrders(currentPage);
    } else {
      let startDate = "";
      let endDate = "";

      if (dateRange && dateRange.length === 2) {
        startDate = moment(dateRange[0]).format("YYYY-MM-DD");
        endDate = moment(dateRange[1]).format("YYYY-MM-DD");
      }

      setOrderList([]);
      let data = {
        orderCode: orderCode,
        email: email,
        contact: Contact,
        startDate: startDate,
        endDate: endDate,
        status: "",
        orderType: "DINING",
      };

      console.log(data);

      let temp = [];
      popUploader(dispatch, true);
      orderService
        .ordersFiltration(data, currentPage)
        .then((resp) => {
          console.log(resp);
          resp?.data?.map((ord, index) => {
            if (ord?.orderType === "DINING") {
              temp.push({
                orderCode: ord?.orderCode,
                cusEmail: ord?.email,
                contactNo: ord?.contactNo,
                orderDate: moment(ord?.createdAt).format("YYYY-MM-DD"),
                total: parseFloat(ord?.subTotal).toFixed(2),
                paymentType: ord?.paymentType,
                action: (
                  <>
                    <Button
                      onClick={() =>
                        history("/order-detail", {
                          state: { orderData: ord?.id },
                        })
                      }
                      color="primary"
                      outline
                      className="m-2"
                    >
                      View
                    </Button>
                  </>
                ),
              });
            }
          });
          setOrderList(temp);
          setCurrentPage(resp?.data?.currentPage);
          setTotalRecodes(resp?.data?.totalRecords);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          handleError(err);
          popUploader(dispatch, false);
        });
    }
  };

  const debounceHandleSearchOrderFiltration = React.useCallback(
    debounce(handleSearchOrderFiltration, 500),
    []
  );

  const onChangePagination = (page) => {
    console.log(page);
    setCurrentPage(page);

    if (
      !searchOrderCode &&
      !searchCustomerEmail &&
      !searchCustomerContactNo &&
      (searchDateRange === undefined ||
        searchDateRange === null ||
        searchDateRange === "")
    ) {
      loadAllOrders(page);
    } else {
      debounceHandleSearchOrderFiltration(
        searchOrderCode,
        searchCustomerEmail,
        searchCustomerContactNo,
        searchDateRange,
        page
      );
    }
  };

  const clearFiltrationFields = () => {
    setSearchOrderCode("");
    setSearchCustomerEmail("");
    setSearchDateRange("");
  };

  return (
    <div className="page-content">
      <Container fluid>
        <div className="row mt-3">
          <h4>Dinging Order Management</h4>
        </div>
        <Card id="orderList">
          <CardHeader className="card-header border-0">
            <Row className="align-items-center gy-3">
              <div className="col-sm">
                <h5 className="card-title mb-0">Order History</h5>
              </div>
            </Row>
          </CardHeader>

          <CardBody className="pt-0">
            <div>
              <Row className="d-flex mb-2 mx-1 justify-content-end">
                <Col
                  sm={12}
                  md={3}
                  lg={3}
                  xl={3}
                  className="d-flex justify-content-end"
                >
                  <Button
                    color="primary"
                    onClick={() => history("/place-dining-order")}
                  >
                    <Plus size={24} /> Add New Order
                  </Button>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={12} md={6} lg={3} xl={3} xxl={2}>
                  <Label>Search By Order Code</Label>
                  <Input
                    placeholder="ORD-000000"
                    value={searchOrderCode}
                    className="mb-3"
                    onChange={(e) => {
                      debounceHandleSearchOrderFiltration(
                        e.target.value,
                        searchCustomerEmail,
                        searchCustomerContactNo,
                        searchDateRange,
                        1
                      );
                      setSearchOrderCode(e.target.value);
                    }}
                  />
                </Col>

                <Col sm={12} md={6} lg={3} xl={3} xxl={3}>
                  <Label>Search By Customer Email</Label>
                  <Input
                    placeholder="Enter customer email"
                    value={searchCustomerEmail}
                    type="email"
                    onChange={(e) => {
                      debounceHandleSearchOrderFiltration(
                        searchOrderCode,
                        e.target.value,
                        searchCustomerContactNo,
                        searchDateRange,
                        1
                      );
                      setSearchCustomerEmail(e.target.value);
                    }}
                  />
                </Col>
                <Col sm={12} md={6} lg={3} xl={3} xxl={3}>
                  <Label>Search By Contact No</Label>
                  <Input
                    placeholder="Enter contact no"
                    type="number"
                    value={searchCustomerContactNo}
                    onChange={(e) => {
                      debounceHandleSearchOrderFiltration(
                        searchOrderCode,
                        searchCustomerEmail,
                        e.target.value,
                        searchDateRange,
                        1
                      );
                      setSearchCustomerContactNo(e.target.value);
                    }}
                  />
                </Col>
                <Col sm={12} md={12} lg={4} xl={4} xxl={4}>
                  <Label>Search By Order Date Range</Label>
                  <RangePicker
                    style={{ height: 40, width: "100%", borderRadius: 4 }}
                    onChange={(selectedDates) => {
                      if (selectedDates) {
                        const formattedDates = selectedDates.map((date) =>
                          date ? date.format("YYYY-MM-DD") : null
                        );
                        debounceHandleSearchOrderFiltration(
                          searchOrderCode,
                          searchCustomerEmail,
                          searchCustomerContactNo,
                          formattedDates,
                          1
                        );
                        setSearchDateRange(formattedDates);
                      } else {
                        setSearchDateRange("");
                        debounceHandleSearchOrderFiltration(
                          searchOrderCode,
                          searchCustomerEmail,
                          searchCustomerContactNo,
                          "",
                          1
                        );
                      }
                    }}
                  />
                </Col>
              </Row>

              <Row>
                <Col sm={12} lg={12}>
                  <Table
                    className="mx-3 my-4"
                    pagination={true}
                    columns={DiningOrderListTableColumns}
                    dataSource={orderList}
                    scroll={{ x: "fit-content" }}
                  />
                </Col>
              </Row>
              {/* <Row>
                <Col
                  className=" d-flex justify-content-end"
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Pagination
                    className="m-3"
                    current={currentPage}
                    onChange={onChangePagination}
                    defaultPageSize={15}
                    total={totalRecodes}
                    showSizeChanger={false}
                    showTotal={(total) => `Total ${total} items`}
                  />
                </Col>
              </Row> */}
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default DingingOrderManagement;
