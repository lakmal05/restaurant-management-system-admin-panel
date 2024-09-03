import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
} from "reactstrap";
import {
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { AntDesignOutlined } from "@ant-design/icons";
import { Avatar, Tag } from "antd";
import moment from "moment";

const ViewPaymentModal = ({ isOpen, currentData, onClose }) => {
  useEffect(() => {
    console.log(currentData, "62596235+++++++++++++++");
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {
        onClose();
      }}
    >
      <ModalHeader
        toggle={() => {
          onClose();
        }}
      >
        Payment Details
      </ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <h6 className="text-muted fw-semibold">
            Name :{" "}
            {currentData?.order?.firstName + " " + currentData?.order?.lastName}
          </h6>
          <h6 className="text-muted fw-semibold">
            Email : {currentData?.order?.email}
          </h6>
          <h6 className="text-muted fw-semibold">
            Contact No :{currentData?.order?.contactNo}
          </h6>
        </Row>
        <Row className="d-flex justify-content-center">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Order Code
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  {currentData?.order?.orderCode}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Net Total
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  LKR {currentData?.order?.subTotal}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Discount Amount
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  {currentData?.order?.discountAmount
                    ? "LKR " + currentData?.order?.discountAmount
                    : " - "}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Payment Type
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  <Tag
                    color={
                      currentData?.order?.paymentType === "ONLINE_PAYMENT"
                        ? "processing"
                        : currentData?.order?.paymentType === "CASH_ON_DELIVERY"
                        ? "purple"
                        : "default"
                    }
                    key={currentData?.order?.paymentType}
                  >
                    {currentData?.order?.paymentType === "ONLINE_PAYMENT"
                      ? "ONLINE_PAYMENT"
                      : currentData?.order?.paymentType === "CASH_ON_DELIVERY"
                      ? "CASH_ON_DELIVERY"
                      : "none"}
                  </Tag>
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Payment Status
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  <Tag
                    color={
                      currentData?.status === "SUCCESS"
                        ? "success"
                        : currentData?.status === "PENDING"
                        ? "processing"
                        : currentData?.status === "FAILED"
                        ? "error"
                        : currentData?.status === "REFUNDED"
                        ? "warning"
                        : currentData?.status === "CANCELLED"
                        ? "orange"
                        : "default"
                    }
                    key={currentData?.status}
                  >
                    {currentData?.status === "SUCCESS"
                      ? "SUCCESS"
                      : currentData?.status === "PENDING"
                      ? "PENDING"
                      : currentData?.status === "FAILED"
                      ? "FAILED"
                      : currentData?.status === "REFUNDED"
                      ? "REFUNDED"
                      : currentData?.status === "CANCELLED"
                      ? "CANCELLED"
                      : "none"}
                  </Tag>
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Order Placed At
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  {moment(currentData?.order?.createdAt).format(
                    "MMMM Do YYYY, h:mm A"
                  )}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Payment Date
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  {moment(currentData?.createdAt).format(
                    "MMMM Do YYYY, h:mm A"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={() => {
            onClose();
          }}
        >
          Close
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
};

export default ViewPaymentModal;
