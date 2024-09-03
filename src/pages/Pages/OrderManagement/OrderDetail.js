import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  CardHeader,
  Collapse,
  Button,
  Input,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { ArrowLeft } from "react-feather";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Tag } from "antd";
import OrderItems from "./OrderItems";
import {
  getOrderByOrderId,
  updateOrdersStatus,
} from "../../../service/orderService";

const OrderDetail = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useNavigate();
  const [col1, setcol1] = useState(true);
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const { state } = location;
    const { orderData } = state;
    // loadAllOrderStatus();
    // console.log(orderData);
    // setOrderDetails(orderData);
  }, [orderDetails]);

  useEffect(() => {
    const { state } = location;
    if (state && state.orderData) {
      const { orderData } = state;
      console.log(orderData, "1010101010101011");
      setOrderId(orderData?.id);
      getOrderDetails(orderData);
    }
  }, [location]);

  const getOrderDetails = (orderId) => {
    popUploader(dispatch, true);
    setOrderDetails([]);
    getOrderByOrderId(orderId)
      .then((res) => {
        console.log(res);
        let response = res?.data;
        setOrderDetails(response);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        console.log(err);
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const updateStatusOfOrder = () => {
    let selectedStatus = "";
    {
      orderDetails?.orderType === "DELIVERY"
        ? orderDetails?.status === "PENDING"
          ? (selectedStatus = "PROCESSING")
          : orderDetails?.status === "PROCESSING"
          ? (selectedStatus = "SHIPPED")
          : orderDetails?.status === "SHIPPED"
          ? (selectedStatus = "DELIVERED")
          : ""
        : orderDetails?.orderType === "DINING"
        ? orderDetails?.status === "PENDING"
          ? (selectedStatus = "DELIVERED")
          : ""
        : "";
    }

    customSweetAlert(
      `Do you want to update this order status ${orderDetails?.status} to  ${
        orderDetails?.orderType === "DELIVERY"
          ? orderDetails?.status === "PENDING"
            ? "PROCESSING"
            : orderDetails?.status === "PROCESSING"
            ? "SHIPPED"
            : orderDetails?.status === "SHIPPED"
            ? "DELIVERED"
            : ""
          : orderDetails?.orderType === "DINING"
          ? orderDetails?.status === "PENDING"
            ? "DELIVERED"
            : ""
          : ""
      } status?`,

      2,
      () => {
        popUploader(dispatch, true);
        updateOrdersStatus(orderDetails?.id, selectedStatus)
          .then((res) => {
            popUploader(dispatch, false);
            customToastMsg("Order status updated successfully", 1);
            // getOrderDetails(orderId);
          })
          .catch((c) => {
            popUploader(dispatch, false);
            handleError(c);
          });
      }
    );
  };

  const updateStatusOfOrderToReject = () => {
    let selectedStatus = "REJECTED";

    customSweetAlert(`Do you want to reject this order?`, 0, () => {
      popUploader(dispatch, true);
      updateOrdersStatus(orderDetails?.id, selectedStatus)
        .then((res) => {
          popUploader(dispatch, false);
          customToastMsg("Order rejected successfully", 1);
          // getOrderDetails(orderId);
        })
        .catch((c) => {
          popUploader(dispatch, false);
          handleError(c);
        });
    });
  };

  function togglecol1() {
    setcol1(!col1);
  }

  // const handleChange = (e) => {
  //   console.log(e);
  //   let status = e?.label;
  //   console.log(status);
  //   setSelectedStatus(e);
  //   setIsBtnDisable(false);
  // };

  document.title = "Order Details | Easy Kitchen";
  return (
    <div className="page-content">
      <Container fluid className="d-flex flex-row align-baseline mt-4">
        <ArrowLeft
          style={{ cursor: "pointer" }}
          size={18}
          onClick={() => {
            orderDetails.orderType === "DINING"
              ? history("/dinging-order-management")
              : orderDetails.orderType === "DELIVERY"
              ? history("/delivery-order-management")
              : history("/delivery-order-management");
          }}
        />{" "}
        <h4 className="mx-2">{orderDetails.orderCode}</h4>
      </Container>
      <Container fluid>
        <Row>
          <Col xl={9}>
            <Card>
              <CardHeader>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title  mb-0">
                    Order Number : {orderDetails.orderCode}
                  </h5>
                  <h5 className="card-title  mb-0">
                    Order Status :{" "}
                    <Tag
                      color={
                        orderDetails?.status === "PENDING"
                          ? "warning"
                          : orderDetails?.status === "PROCESSING"
                          ? "processing"
                          : orderDetails?.status === "SHIPPED"
                          ? "purple"
                          : orderDetails?.status === "DELIVERED"
                          ? "success"
                          : orderDetails?.status === "CANCELLED"
                          ? "error"
                          : orderDetails?.status === "REJECTED"
                          ? "magenta"
                          : "default"
                      }
                      key={orderDetails?.status}
                    >
                      {orderDetails?.status === "PENDING"
                        ? "PENDING"
                        : orderDetails?.status === "PROCESSING"
                        ? "PROCESSING"
                        : orderDetails?.status === "SHIPPED"
                        ? "SHIPPED"
                        : orderDetails?.status === "DELIVERED"
                        ? "DELIVERED"
                        : orderDetails?.status === "CANCELLED"
                        ? "CANCELLED"
                        : orderDetails?.status === "REJECTED"
                        ? "REJECTED"
                        : "none"}
                    </Tag>
                  </h5>
                </div>
              </CardHeader>

              <CardBody>
                <div className="table-responsive table-card">
                  <table className="table table-nowrap align-middle table-borderless mb-0">
                    <thead className="table-light text-muted">
                      <tr>
                        <th scope="col-2">Product Details</th>
                        <th className="text-center" scope="col">
                          Quantity
                        </th>
                        <th className="text-center" scope="col">
                          Item Price
                        </th>
                        <th className="text-center" scope="col">
                          Item Price (with discount)
                        </th>
                        <th className="text-center" scope="col">
                          Total Amount{" "}
                        </th>
                        <th className="text-end" scope="col">
                          Total Amount (with discount)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <OrderSubProduct data={orderDetails?.packs} /> */}
                      <OrderItems data={orderDetails?.orderItem} />

                      <tr className="border-top border-top-dashed">
                        <td colSpan="4"></td>
                        <td colSpan="2" className="fw-medium p-0">
                          <table className="table table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td>Sub Total : </td>
                                <td className="text-end">
                                  LKR{" "}
                                  {parseFloat(orderDetails?.subTotal).toFixed(
                                    2
                                  )}
                                </td>
                              </tr>
                              {/*<tr>*/}
                              {/*    <td>*/}
                              {/*        Discount{" "}:*/}
                              {/*    </td>*/}
                              {/*    <td className="text-end">-$53.99</td>*/}
                              {/*</tr>*/}
                              {/*<tr>*/}
                              {/*    <td>Shipping Charge :</td>*/}
                              {/*    <td className="text-end">$65.00</td>*/}
                              {/*</tr>*/}
                              {/*<tr>*/}
                              {/*    <td>Estimated Tax :</td>*/}
                              {/*    <td className="text-end">$44.99</td>*/}
                              {/*</tr>*/}
                              <tr className="border-top border-top-dashed">
                                <th scope="row">Total :</th>
                                <th className="text-end">
                                  LKR{" "}
                                  {parseFloat(orderDetails.subTotal).toFixed(2)}
                                </th>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="d-sm-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">Order Status</h5>

                  {orderDetails?.orderType === "DINING" ? (
                    <Button
                      color={"primary"}
                      onClick={() => {
                        updateStatusOfOrder();
                      }}
                    >
                      Update Order Status{" "}
                      {orderDetails?.status === "PENDING" ? "To Delivered" : ""}
                    </Button>
                  ) : orderDetails?.orderType === "DELIVERY" ? (
                    orderDetails?.status != "DELIVERED" &&
                    orderDetails?.status != "CANCELLED" &&
                    orderDetails?.status != "REJECTED" && (
                      <Button
                        color={"primary"}
                        onClick={() => {
                          updateStatusOfOrder();
                        }}
                      >
                        Update Order Status{" "}
                        {orderDetails?.status === "PENDING"
                          ? "To Processing"
                          : orderDetails?.status === "PROCESSING"
                          ? "To Shipped"
                          : orderDetails?.status === "SHIPPED"
                          ? "To Delivered"
                          : ""}
                      </Button>
                    )
                  ) : (
                    ""
                  )}

                  {/* <div className="flex-shrink-0 mt-2 mt-sm-0">*/}
                  {/*        <span*/}
                  {/*            className={`btn */}
                  {/*            ${orderDetails?.order_status === 'PAYMENT PENDING' ? 'btn-soft-warning'*/}
                  {/*                : 'btn-soft-primary'} btn-sm mt-2 mt-sm-0`}*/}
                  {/*        >*/}
                  {/*            {orderDetails?.order_status}*/}
                  {/*        </span>{" "}*/}
                  {/*</div> */}
                </div>
              </CardHeader>
              <CardBody>
                <div className="profile-timeline">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    {orderDetails?.timelines?.map((timeline, index) => (
                      <div key={index}>
                        <div
                          className="accordion-item border-0"
                          onClick={togglecol1}
                        >
                          <div className="accordion-header" id="headingOne">
                            <Link
                              to="#"
                              className={classnames(
                                "accordion-button",
                                "p-2",
                                "shadow-none",
                                { collapsed: !col1 }
                              )}
                            >
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar-xs">
                                  <div className="avatar-title bg-primary rounded-circle">
                                    <i className="ri-shopping-bag-line"></i>
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="fs-15 mb-0 fw-semibold">
                                    {timeline?.orderStatus?.name}
                                  </h6>
                                </div>
                              </div>
                            </Link>
                          </div>
                          <Collapse
                            id="collapseOne"
                            className="accordion-collapse"
                            isOpen={col1}
                          >
                            <div className="accordion-body ms-2 ps-5 pt-0">
                              <h6 className="mb-1">
                                This order has reached{" "}
                                {timeline?.orderStatus?.name} status on
                              </h6>
                              <p className="text-muted">
                                {moment(timeline?.createdAt).format(
                                  "ddd, DD MMM YYYY - h:mmA"
                                )}
                              </p>
                            </div>
                          </Collapse>
                        </div>
                      </div>
                    ))}{" "}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl={3}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title  mb-0">
                    <i className="mdi mdi-truck-fast-outline align-middle me-1 text-muted"></i>
                    Order Details
                  </h5>

                  {/* {checkPermission(UPDATE_ORDER_STATUS) && ( */}
                  <>
                    {orderDetails?.orderType === "DELIVERY" &&
                      orderDetails?.status !== "REJECTED" && (
                        <Button
                          className=""
                          color="danger"
                          onClick={() => {
                            updateStatusOfOrderToReject();
                          }}
                        >
                          Reject Order
                        </Button>
                      )}
                  </>
                  {/* )} */}
                </div>
              </CardHeader>
              <CardBody>
                <div>
                  <p className=" mb-2">
                    Order Id :{" "}
                    <span className="fw-semibold">
                      {orderDetails?.orderCode}
                    </span>
                  </p>

                  {/* <p className="text-muted mb-2 mx-3">
                    Order Description : {orderDetails?.description}
                  </p> */}

                  <p className="mb-2">
                    Order Placed Date :{" "}
                    <span className="fw-semibold">
                      {moment(orderDetails?.createdAt).format(
                        "ddd, DD MMM YYYY - h:mmA"
                      )}
                    </span>
                  </p>

                  {/* <p className="mb-2">
                    Payment Status :{" "}
                    {orderDetails?.payment.map((pay) => {
                      return <Tag color="blue">{pay?.status}</Tag>;
                    })}
                  </p> */}
                  <p className="mb-2">
                    Payment Mode :{" "}
                    <Tag color="blue">{orderDetails?.paymentType}</Tag>
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between">
                  <h5 className="card-title mb-0">
                    <i className="ri-map-pin-line align-middle me-1 text-muted"></i>{" "}
                    Billing Details
                  </h5>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
                  <li className="fw-medium fs-14">
                    {orderDetails?.firstName} {orderDetails?.lastName}
                  </li>
                  <li>
                    <span className="text-muted mb-0">Contact No :</span>
                    {orderDetails?.contactNo}
                  </li>
                  <li>
                    {" "}
                    <span className="text-muted mb-0">Email :</span>
                    {orderDetails?.email}
                  </li>
                  <li>
                    {" "}
                    <span className="text-muted mb-0">Address :</span>
                    {orderDetails?.addressLine}
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between">
                  <h5 className="card-title mb-0">
                    <i className="ri-map-pin-line align-middle me-1 text-muted"></i>{" "}
                    Shipping Details
                  </h5>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
                  <li className="fw-medium fs-14">
                    {orderDetails?.firstName} {orderDetails?.lastName}
                  </li>
                  <li>
                    <span className="text-muted mb-0">Contact No :</span>
                    {orderDetails?.contactNo}
                  </li>
                  <li>
                    {" "}
                    <span className="text-muted mb-0">Email :</span>
                    {orderDetails?.email}
                  </li>
                  <li>
                    {" "}
                    <span className="text-muted mb-0">Address :</span>
                    {orderDetails?.addressLine}
                  </li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderDetail;
