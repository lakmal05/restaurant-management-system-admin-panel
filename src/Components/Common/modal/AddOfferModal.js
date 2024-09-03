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
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import classnames from "classnames";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useDispatch } from "react-redux";
import { Alert } from "antd";

import CustomImageUploader from "../upload/ImageUploader";
import { values } from "lodash";
import { desMaxLimit } from "../../../common/util";
import { createOffer } from "../../../service/offersService";

const AddOfferModal = ({ isOpen, toggle }) => {
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDes, setOfferDes] = useState("");
  const [offerValue, setOfferValue] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");

  //--------------------image uploader----------------------

  const [mainImage, setMainImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mainImagesLoader, setMainImagesLoader] = useState(false);
  const [showImageError, setShowImageError] = useState(false);

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  let dispatch = useDispatch();

  const handleAddOffer = () => {
    let isValidated = false;
    if (offerTitle === "") {
      customToastMsg("Offer title cannot be empty");
    } else if (offerDes === "") {
      customToastMsg("Offer description cannot be empty");
    } else if (countDescription(offerDes) > desMaxLimit) {
      customToastMsg("Offer description limit exceed", 2);
    }
    if (offerValue === "") {
      customToastMsg("Offer value cannot be empty");
    }
    if (offerStartDate === "") {
      customToastMsg("Offer start date cannot be empty");
    }
    if (offerEndDate === "") {
      customToastMsg("Offer end date cannot be empty");
    } else if (mainImage.length === 0) {
      customToastMsg("Select offer image first", 2);
    } else {
      isValidated = true;
    }

    const data = {
      title: offerTitle,
      description: offerDes,
      value: parseFloat(offerValue),
      startAt: offerStartDate,
      endAt: offerEndDate,
      fileId: mainImage?.id,
    };

    if (isValidated) {
      popUploader(dispatch, true);
      createOffer(data)
        .then((response) => {
          toggle();
          clearFields();
          popUploader(dispatch, false);
          customToastMsg("Offer added successfully", 1);
        })
        .catch((error) => {
          handleError(error);
          popUploader(dispatch, false);
        });
    }
  };

  const getMainIdValues = async (data) => {
    let temp = {};
    data.map((mediaFile, index) => {
      temp = {
        id: mediaFile?.response?.data?.id,
        isDefault: true,
      };
    });
    await setMainImages(temp);
    await setIsUploading(true);
  };

  const clearFields = () => {
    setOfferTitle("");
    setOfferDes("");
    setOfferValue("");
    setOfferStartDate("");
    setOfferEndDate("");
    setMainImages([]);
  };

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      toggle={() => {
        toggle();
        clearFields();
      }}
    >
      <ModalHeader
        toggle={() => {
          toggle();
          clearFields();
        }}
      >
        Add New Offer
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col sm="12">
            <Form className="mt-2">
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="offerTitle">Offer Title</Label>
                    <Input
                      type="text"
                      name="offerTitle"
                      id="offerTitle"
                      placeholder="Enter offer title"
                      value={offerTitle}
                      onChange={(e) => setOfferTitle(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <div>
                  <div className="d-flex justify-content-between">
                    {" "}
                    <Label>Offer Description</Label>
                    {countDescription(offerDes) > desMaxLimit ? (
                      <span class="text-count  text-danger">
                        {countDescription(offerDes)} of {desMaxLimit} Characters
                      </span>
                    ) : (
                      <span class="text-count text-muted">
                        {countDescription(offerDes)} of {desMaxLimit} Characters
                      </span>
                    )}
                  </div>
                  <CKEditor
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setOfferDes(data);
                    }}
                    config={{
                      toolbar: {
                        items: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "|",
                          "bulletedList",
                          "numberedList",
                          "|",
                          "alignment",
                          "|",
                          "indent",
                          "outdent",
                          "|",
                          "fontColor",
                          "fontSize",
                          "fontBackgroundColor",
                          "|",
                          "undo",
                          "redo",
                          "|",
                          "cut",
                          "copy",
                          "paste",
                          "|",
                          "removeFormat",
                          "|",
                          "blockQuote",
                          "horizontalLine",
                          "|",
                          "code",
                          "|",
                          "specialCharacters",
                          "|",
                        ],
                      },
                    }}
                    editor={ClassicEditor}
                    data={offerDes}
                    onReady={(editor) => {}}
                  />
                </div>
              </FormGroup>

              <Row>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="offerValue">Offer Value (%)</Label>
                    <Input
                      type="text"
                      name="offerValue"
                      id="offerValue"
                      placeholder="Enter offer value"
                      value={offerValue}
                      onChange={(e) => setOfferValue(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="offerStartDate">Offer Start Date</Label>
                    <Input
                      type="date"
                      min={today}
                      name="offerStartDate"
                      id="offerStartDate"
                      placeholder="Select"
                      value={offerStartDate}
                      onChange={(e) => setOfferStartDate(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="offerEndDate">Offer End Date</Label>
                    <Input
                      type="date"
                      min={today}
                      name="offerEndDate"
                      id="offerEndDate"
                      placeholder="Select"
                      value={offerEndDate}
                      onChange={(e) => setOfferEndDate(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={12} lg={6}>
                  <Row>
                    <h5 className="fs-15 mb-1"> Add Offer Image</h5>
                    <p className="text-muted">
                      Add offer image.{" "}
                      <small className="text-primary">
                        <b>(Add a PNG image for best view in customer page)</b>{" "}
                      </small>
                    </p>

                    <CustomImageUploader
                      getIds={(data, ids) => getMainIdValues(data, ids)}
                      isMainImage={true}
                    />

                    {mainImagesLoader && (
                      <Alert message="Uploading..." type="info" />
                    )}
                    {!mainImagesLoader && showImageError && (
                      <Alert
                        message="Change Images and Try Again"
                        type="error"
                      />
                    )}
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={() => {
            toggle();
            clearFields();
          }}
        >
          Cancel
        </Button>{" "}
        <Button
          color="primary"
          onClick={handleAddOffer}
          disabled={!isUploading}
        >
          Add Offer
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddOfferModal;
