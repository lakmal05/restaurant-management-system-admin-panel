import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import {
  countDescription,
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useDispatch } from "react-redux";
import { Alert, Tag } from "antd";
import CustomImageUploader from "../upload/ImageUploader";
import { desMaxLimit } from "../../../common/util";
import { updateService } from "../../../service/serviceService";
import { MessageBox } from "react-chat-elements";
import { sendInquiryResponse } from "../../../service/inquiryService";
import chatBg from "../../../assets/images/inquiryChatBg.jpg";
import "react-chat-elements/dist/main.css";
import moment from "moment";

const InquiryModal = ({ isOpen, currentData, onClose }) => {
  const [customerInquiry, setCustomerInquiry] = useState("");
  const [userObject, setUserObject] = useState("");

  let dispatch = useDispatch();

  useEffect(() => {
    console.log(JSON.parse(sessionStorage.getItem("authUser")));
    setUserObject(JSON.parse(sessionStorage.getItem("authUser")));
  }, [isOpen]);

  // const setDataToInputs = () => {
  //   setCustomerInquiry(currentData.name);
  // };

  const handleUpdateService = () => {
    let isValidated = false;
    if (customerInquiry === "") {
      customToastMsg("Inquiry response cannot be empty");
    } else {
      isValidated = true;
    }

    const data = {
      message: customerInquiry,
    };

    if (isValidated) {
      popUploader(dispatch, true);
      sendInquiryResponse(currentData.id, data)
        .then((resp) => {
          onClose();
          clearFields();
          popUploader(dispatch, false);
          customToastMsg("Inquiry response send successfully", 1);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const clearFields = () => {
    setCustomerInquiry("");
  };

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      toggle={() => {
        onClose();
        clearFields();
      }}
    >
      <ModalHeader
        toggle={() => {
          onClose();
          clearFields();
        }}
      >
        Customer Inquiry
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Label for="customerName">
              Customer Email : {currentData?.email}
            </Label>
            <Label for="customerName" className="fw-semibold"></Label>
            <Label for="customerName">
              Inquiry Send Date :{" "}
              {moment(currentData?.createdAt).format("YYYY-MM-DD")}
            </Label>
            <div>
              <Label for="customerName">Inquiry Status : </Label>
              <Tag
                color={
                  currentData?.status === "PENDING"
                    ? "warning"
                    : currentData?.status === "REPLIED"
                    ? "success"
                    : "default"
                }
                key={currentData?.status}
              >
                {currentData?.status === "PENDING"
                  ? "PENDING"
                  : currentData?.status === "REPLIED"
                  ? "REPLIED"
                  : "none"}
              </Tag>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Label for="inquiryMessage" className="fw-semibold">
              Inquiry
            </Label>
            <div
              style={{
                backgroundColor: "#fffaee",
                height: 300,
                borderRadius: 20,
                padding: 10,
                overflowY: "auto",
              }}
            >
              <MessageBox
                position="left"
                title={currentData?.email}
                type="text"
                text={currentData?.message}
                date={new Date(currentData?.createdAt)}
              />
              {currentData?.replyMessage && (
                <MessageBox
                  position="right"
                  title={userObject?.email}
                  type="text"
                  text={currentData?.replyMessage}
                  // date={new Date()}
                />
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
            {currentData?.replyMessage === null && (
              <Form className="mt-2">
                <Row>
                  <Col>
                    {" "}
                    <FormGroup>
                      <Label for="customerInquiry">Response</Label>
                      <Input
                        type="textarea"
                        name="customerInquiry"
                        id="customerInquiry"
                        placeholder="Enter your response"
                        value={customerInquiry}
                        onChange={(e) => setCustomerInquiry(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            )}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={() => {
            onClose();
            clearFields();
          }}
        >
          Close
        </Button>{" "}
        {currentData?.replyMessage === null && (
          <Button color="primary" onClick={handleUpdateService}>
            Send Inquiry Response
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default InquiryModal;
