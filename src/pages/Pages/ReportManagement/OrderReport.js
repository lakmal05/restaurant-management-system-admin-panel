import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Label,
  Input,
  Button,
} from "reactstrap";
import Select from "react-select";
import {
  checkPermission,
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import {
  DeliveryOrderListTableColumns,
  OrderReportListTableColumns,
} from "../../../common/tableColumns";
import classnames from "classnames";
import { Table } from "antd";
import { Pagination } from "antd";
import { DatePicker, Space } from "antd";
import moment from "moment"; // Import moment
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import * as orderService from "../../../service/orderService";
import { FileText } from "react-feather";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const OrderReport = () => {
  document.title = "Orders Report | Restaurant";

  const history = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("1");
  const [orderList, setOrderList] = useState([]);
  const [searchOrderCode, setSearchOrderCode] = useState("");
  const [searchCustomerEmail, setSearchCustomerEmail] = useState("");
  const [searchCustomerContactNo, setSearchCustomerContactNo] = useState("");
  const [searchDateRange, setSearchDateRange] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [orderTypeList, setOrderTypeList] = useState([]);

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  const { RangePicker } = DatePicker;

  useEffect(() => {
    loadAllOrders(currentPage);
    setOrderTypeList([
      { value: "DELIVERY", label: "Delivery" },
      { value: "DINING", label: "Dining" },
    ]);
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
          temp.push({
            orderCode: ord?.orderCode,
            cusEmail: ord?.email,
            orderType: ord?.orderType,
            contactNo: ord?.contactNo,
            orderDate: moment(ord?.createdAt).format("YYYY-MM-DD"),
            total: parseFloat(ord?.subTotal).toFixed(2),
            paymentType: ord?.paymentType,
            status: ord?.status,
          });
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

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      history("/report-management");
      setSelectedStatus(type);
      debounceHandleSearchOrderFiltration(
        searchOrderCode,
        searchCustomerEmail,
        searchCustomerContactNo,
        searchDateRange,
        type,
        selectedOrderType,
        1
      );
    }
  };

  const handleSearchOrderFiltration = (
    orderCode,
    email,
    Contact,
    dateRange,
    Status,
    orderType,
    currentPage
  ) => {
    if (
      !orderCode &&
      !email &&
      !Contact &&
      (dateRange === undefined || dateRange === null || dateRange === "") &&
      (Status === undefined || Status === null || Status === "") &&
      (orderType === undefined || orderType === null || orderType === "")
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
        status: Status === undefined ? "" : Status === null ? "" : Status,
        orderType: orderType,
      };

      console.log(data);

      let temp = [];
      popUploader(dispatch, true);
      orderService
        .ordersFiltration(data, currentPage)
        .then((resp) => {
          console.log(resp);
          resp?.data?.map((ord, index) => {
            temp.push({
              orderCode: ord?.orderCode,
              cusEmail: ord?.email,
              orderType: ord?.orderType,
              contactNo: ord?.contactNo,
              orderDate: moment(ord?.createdAt).format("YYYY-MM-DD"),
              total: parseFloat(ord?.subTotal).toFixed(2),
              paymentType: ord?.paymentType,
              status: ord?.status,
            });
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

  const downloadReservationDataExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(orderList);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      data,
      `order_detail_report_${moment().format("YYYYMMDD")}.xlsx`
    );
  };

  const clearFiltrationFields = () => {
    setActiveTab("1");
    setSearchOrderCode("");
    setSearchCustomerEmail("");
    setSearchDateRange("");
    setSelectedStatus("");
    setSelectedOrderType("");
  };

  return (
    <div>
      <div className="row mt-3 mx-3">
        <h4>Order Report</h4>
      </div>
      <Row className="d-flex mt-3 mb-4 mx-1 justify-content-between">
        <Col sm={12} md={3} lg={3} xl={3}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            placeholder="Select Order Type"
            isSearchable={true}
            isClearable
            value={
              orderTypeList.find(
                (option) => option.value === selectedOrderType
              ) || null
            }
            onChange={(e) => {
              setSelectedOrderType(
                e?.value === undefined ? "" : e === null ? "" : e.value
              );
              debounceHandleSearchOrderFiltration(
                searchOrderCode,
                searchCustomerEmail,
                searchCustomerContactNo,
                searchDateRange,
                "",
                e?.value === undefined ? "" : e === null ? "" : e.value,
                1
              );
            }}
            options={orderTypeList}
          />
        </Col>
        <Col sm={12} md={3} lg={3} xl={3}>
          <Button
            color="primary"
            className="w-100"
            onClick={downloadReservationDataExcel}
          >
            <FileText size={24} /> Download Excel Report
          </Button>
        </Col>
      </Row>
      <div className="mx-3">
        {selectedOrderType !== "DINING" && (
          <Nav className="nav-tabs nav-tabs-custom nav-primary" role="tablist">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => {
                  toggleTab("1", "");
                }}
                href="#"
              >
                <i className="ri-store-2-fill me-1 align-bottom"></i> All Orders
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  toggleTab("2", "PENDING");
                }}
                href="#"
              >
                <i className="ri-restart-line me-1 align-bottom"></i>
                Pending
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => {
                  toggleTab("3", "PROCESSING");
                }}
                href="#"
              >
                <i className="ri-luggage-cart-line me-1 align-bottom"></i>{" "}
                Processing
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "4" })}
                onClick={() => {
                  toggleTab("4", "SHIPPED");
                }}
                href="#"
              >
                <i className="ri-truck-fill me-1 align-bottom"></i>
                Shipped
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "5" })}
                onClick={() => {
                  toggleTab("5", "DELIVERED");
                }}
                href="#"
              >
                <i className="ri-checkbox-circle-fill me-1 align-bottom"></i>{" "}
                Delivered
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "6" })}
                onClick={() => {
                  toggleTab("6", "CANCELLED");
                }}
                href="#"
              >
                <i className="ri-close-circle-fill me-1 align-bottom"></i>{" "}
                Canceled
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "7" })}
                onClick={() => {
                  toggleTab("7", "REJECTED");
                }}
                href="#"
              >
                <i className="ri-error-warning-fill me-1 align-bottom"></i>{" "}
                Rejected
              </NavLink>
            </NavItem>
          </Nav>
        )}

        <Row className="mt-4">
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
                  selectedStatus,
                  selectedOrderType,
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
                  selectedStatus,
                  selectedOrderType,
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
                  selectedStatus,
                  selectedOrderType,
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
                    selectedStatus,
                    selectedOrderType,
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
                    selectedStatus,
                    selectedOrderType,
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
              pagination={false}
              columns={OrderReportListTableColumns}
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
    </div>
  );
};

export default OrderReport;
