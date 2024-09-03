import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classnames from "classnames";
import moment from "moment";
import Select from "react-select";
import { PaymentTableColumns } from "../../../common/tableColumns";
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
import { handleError, popUploader } from "../../../common/commonFunctions";
import { DatePicker, Table, Pagination } from "antd";
import debounce from "lodash/debounce";
import ViewPaymentModal from "../../../Components/Common/modal/ViewPaymentModal";
import {
  getAllPayments,
  paymentsFiltration,
} from "../../../service/paymentService";

export default function PaymentManagement() {
  document.title = "Order Payments | Restaurant";

  const dispatch = useDispatch();
  const history = useNavigate();
  const { RangePicker } = DatePicker;

  const [activeTab, setActiveTab] = useState("1");
  const [paymentTableList, setPaymentTableList] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [searchOrderCode, setSearchOrderCode] = useState("");
  const [searchCustomerEmail, setSearchCustomerEmail] = useState("");
  const [searchDateRange, setSearchDateRange] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isOpenViewPaymentModal, setIsOpenViewPaymentModal] = useState(false);

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  useEffect(() => {
    loadAllPayments(currentPage);
  }, []);

  const loadAllPayments = async (currentPage) => {
    let temp = [];
    setPaymentTableList([]);
    clearFiltrationFields();
    popUploader(dispatch, true);
    getAllPayments(currentPage)
      .then((resp) => {
        resp?.data?.map((payment, index) => {
          if (payment?.order !== null) {
            temp.push({
              orderCode: payment?.order?.orderCode,
              cusEmail: payment?.order?.email,
              payment_status: payment?.status,
              payment_date: moment(payment?.createdAt).format("YYYY-MM-DD"),
              orderDate: moment(payment?.order?.createdAt).format("YYYY-MM-DD"),
              status: payment?.order?.status,
              total: parseFloat(payment?.amount).toFixed(2),
              paymentType: payment?.order?.paymentType,
              action: (
                <>
                  <Button
                    onClick={() => toggleViewPaymentModal(payment)}
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
        setPaymentTableList(temp);
        setCurrentPage(resp?.data?.currentPage);
        setTotalRecodes(resp?.data?.totalCount);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      history("/payment-management");
      setSelectedPaymentStatus(type);
      debounceHandleSearchPaymentFiltration(
        searchOrderCode,
        searchCustomerEmail,
        searchDateRange,
        type,
        1
      );
    }
  };

  const handleSearchPaymentFiltration = (
    orderCode,
    email,
    dateRange,
    PaymentStatus,
    currentPage
  ) => {
    if (
      !orderCode &&
      !email &&
      (dateRange === undefined || dateRange === null || dateRange === "") &&
      (PaymentStatus === undefined ||
        PaymentStatus === null ||
        PaymentStatus === "")
    ) {
      loadAllPayments(currentPage);
    } else {
      let startDate = "";
      let endDate = "";

      if (dateRange && dateRange.length === 2) {
        startDate = moment(dateRange[0]).format("YYYY-MM-DD");
        endDate = moment(dateRange[1]).format("YYYY-MM-DD");
      }

      setPaymentTableList([]);
      let data = {
        orderCode: orderCode,
        email: email,
        startDate: startDate,
        endDate: endDate,
        PaymentStatus:
          PaymentStatus === undefined
            ? ""
            : PaymentStatus === null
            ? ""
            : PaymentStatus,
      };

      let temp = [];
      popUploader(dispatch, true);
      paymentsFiltration(data, currentPage)
        .then((resp) => {
          resp?.data?.map((payment, index) => {
            if (payment?.order !== null) {
              temp.push({
                orderCode: payment?.order?.orderCode,
                cusEmail: payment?.order?.email,
                payment_status: payment?.status,
                payment_date: moment(payment?.createdAt).format("YYYY-MM-DD"),
                orderDate: moment(payment?.order?.createdAt).format(
                  "YYYY-MM-DD"
                ),
                status: payment?.order?.status,
                total: parseFloat(payment?.amount).toFixed(2),
                paymentType: payment?.order?.paymentType,
                action: (
                  <>
                    <Button
                      onClick={() => toggleViewPaymentModal(payment)}
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
          setPaymentTableList(temp);
          setCurrentPage(resp?.data?.currentPage);
          setTotalRecodes(resp?.data?.totalCount);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          handleError(err);
          popUploader(dispatch, false);
        });
    }
  };

  const debounceHandleSearchPaymentFiltration = React.useCallback(
    debounce(handleSearchPaymentFiltration, 500),
    []
  );

  const onChangePagination = (page) => {
    setCurrentPage(page);
    if (
      !searchOrderCode &&
      !searchCustomerEmail &&
      (searchDateRange === undefined ||
        searchDateRange === null ||
        searchDateRange === "") &&
      (selectedPaymentStatus === undefined ||
        selectedPaymentStatus === null ||
        selectedPaymentStatus === "")
    ) {
      loadAllPayments(page);
    } else {
      debounceHandleSearchPaymentFiltration(
        searchOrderCode,
        searchCustomerEmail,
        searchDateRange,
        selectedPaymentStatus,
        page
      );
    }
  };

  const clearFiltrationFields = () => {
    setActiveTab("1");
    setSelectedPaymentStatus("");
    setSearchOrderCode("");
    setSearchCustomerEmail("");
    setSearchDateRange(null);
  };

  const toggleViewPaymentModal = (selectedPayment) => {
    setSelectedPayment(selectedPayment);
    setIsOpenViewPaymentModal(!isOpenViewPaymentModal);
    clearFiltrationFields();
  };

  return (
    <>
      <div className="page-content">
        <ViewPaymentModal
          currentData={selectedPayment}
          isOpen={isOpenViewPaymentModal}
          onClose={(e) => {
            setIsOpenViewPaymentModal(!isOpenViewPaymentModal);
          }}
        />
        <Container fluid>
          <div className="row mt-3">
            <h4>Order Payment Management</h4>
          </div>
          <Card id="paymentList">
            <CardHeader className="card-header border-0">
              <Row className="align-items-center gy-3">
                <div className="col-sm">
                  <h5 className="card-title mb-0">Payment History</h5>
                </div>
              </Row>
            </CardHeader>

            <CardBody className="pt-0">
              <div>
                <Nav
                  className="nav-tabs nav-tabs-custom nav-primary"
                  role="tablist"
                >
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        toggleTab("1", "");
                      }}
                      href="#"
                    >
                      <i className="ri-apps-fill me-1 align-bottom"></i>
                      All Payments
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => toggleTab("2", "SUCCESS")}
                      href="#"
                    >
                      <i className="ri-checkbox-circle-fill me-1 align-bottom"></i>
                      Success
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => toggleTab("3", "PENDING")}
                      href="#"
                    >
                      <i className="ri-restart-line me-1 align-bottom"></i>
                      Pending
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "4" })}
                      onClick={() => toggleTab("4", "CANCELLED")}
                      href="#"
                    >
                      <i className="ri-close-circle-fill me-1 align-bottom"></i>
                      Cancelled
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "5" })}
                      onClick={() => toggleTab("5", "REFUNDED")}
                      href="#"
                    >
                      <i className="ri-refund-fill me-1 align-bottom"></i>
                      Refund
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "6" })}
                      onClick={() => toggleTab("6", "FAILED")}
                      href="#"
                    >
                      <i className="ri-error-warning-fill me-1 align-bottom"></i>
                      Fail
                    </NavLink>
                  </NavItem>
                </Nav>

                <Row className="mt-3">
                  <Col sm={12} md={6} lg={3} className="mb-3">
                    <Label>Search By Order Code</Label>
                    <Input
                      placeholder="Search order by order ID"
                      value={searchOrderCode}
                      onChange={(e) => {
                        setSearchOrderCode(e.target.value);
                        debounceHandleSearchPaymentFiltration(
                          e.target.value,
                          searchCustomerEmail,
                          searchDateRange,
                          selectedPaymentStatus,
                          1
                        );
                      }}
                    />
                  </Col>
                  <Col sm={12} md={6} lg={3}>
                    <Label>Search By Customer Email</Label>
                    <Input
                      placeholder="Search order by customer email"
                      value={searchCustomerEmail}
                      type="email"
                      onChange={(e) => {
                        setSearchCustomerEmail(e.target.value);
                        debounceHandleSearchPaymentFiltration(
                          searchOrderCode,
                          e.target.value,
                          searchDateRange,
                          selectedPaymentStatus,
                          1
                        );
                      }}
                    />
                  </Col>

                  <Col sm={12} md={12} lg={4}>
                    <Label>Search By Payment Date </Label>
                    <RangePicker
                      style={{ height: 40, width: "100%", borderRadius: 4 }}
                      onChange={(selectedDates) => {
                        if (selectedDates) {
                          const formattedDates = selectedDates.map((date) =>
                            date ? date.format("YYYY-MM-DD") : null
                          );
                          debounceHandleSearchPaymentFiltration(
                            searchOrderCode,
                            searchCustomerEmail,
                            formattedDates,
                            selectedPaymentStatus,
                            1
                          );
                          setSearchDateRange(formattedDates);
                        } else {
                          setSearchDateRange(null);
                          debounceHandleSearchPaymentFiltration(
                            searchOrderCode,
                            searchCustomerEmail,
                            "",
                            selectedPaymentStatus,
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
                      columns={PaymentTableColumns}
                      dataSource={paymentTableList}
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
    </>
  );
}
