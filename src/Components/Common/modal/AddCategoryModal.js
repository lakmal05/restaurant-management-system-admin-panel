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
import { createCategory } from "../../../service/categoryService";
import { desMaxLimit } from "../../../common/util";

const AddCategoryModal = ({ isOpen, toggle }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDes, setCategoryDes] = useState("");

  //--------------------image uploader----------------------

  const [mainImage, setMainImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mainImagesLoader, setMainImagesLoader] = useState(false);
  const [showImageError, setShowImageError] = useState(false);

  let dispatch = useDispatch();

  const handleAddCategory = () => {
    let isValidated = false;
    if (categoryName === "") {
      customToastMsg("Category name cannot be empty");
    } else if (categoryDes === "") {
      customToastMsg("Category description cannot be empty");
    } else if (countDescription(categoryDes) > desMaxLimit) {
      customToastMsg("Category description limit exceed", 2);
    } else if (mainImage.length === 0) {
      customToastMsg("Select category image first", 2);
    } else {
      isValidated = true;
    }

    const data = {
      name: categoryName,
      description: categoryDes,
      fileId: mainImage?.id,
    };

    if (isValidated) {
      popUploader(dispatch, true);
      createCategory(data)
        .then((response) => {
          toggle();
          clearFields();
          popUploader(dispatch, false);
          customToastMsg("Category added successfully", 1);
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
      temp={
        id: mediaFile?.response?.data?.id,
        isDefault: true,
      }
    });
    await setMainImages(temp);
    await setIsUploading(true);
  };

  const clearFields = () => {
    setCategoryName("");
    setCategoryDes("");
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
        Add New Category
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col sm="12">
            <Form className="mt-2">
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="categoryName">Category Name</Label>
                    <Input
                      type="text"
                      name="categoryName"
                      id="categoryName"
                      placeholder="Eg: Vegetable"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <div>
                  <div className="d-flex justify-content-between">
                    {" "}
                    <Label>Category Description</Label>
                    {countDescription(categoryDes) > desMaxLimit ? (
                      <span class="text-count  text-danger">
                        {countDescription(categoryDes)} of {desMaxLimit}{" "}
                        Characters
                      </span>
                    ) : (
                      <span class="text-count text-muted">
                        {countDescription(categoryDes)} of {desMaxLimit}{" "}
                        Characters
                      </span>
                    )}
                  </div>
                  <CKEditor
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setCategoryDes(data);
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
                    data={categoryDes}
                    onReady={(editor) => {}}
                  />
                </div>
              </FormGroup>
              <Row>
                <Col sm={12} md={12} lg={6}>
                  <Row>
                    <h5 className="fs-15 mb-1"> Add Category Image</h5>
                    <p className="text-muted">
                      Add category image.{" "}
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
          onClick={handleAddCategory}
          disabled={!isUploading}
        >
          Add Category
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddCategoryModal;
