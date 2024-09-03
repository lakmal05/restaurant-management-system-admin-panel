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
import { Alert } from "antd";
import { Switch } from "antd";
import CustomImageUploader from "../upload/ImageUploader";
import { desMaxLimit } from "../../../common/util";
import { updateCategory } from "../../../service/categoryService";

const UpdateCategoryModal = ({ isOpen, currentData, onClose }) => {
  const [categoryName, setCategoryName] = useState("");

  const [categoryDes, setCategoryDes] = useState("");

  const [categoryStatus, setCategoryStatus] = useState("");

  //--------------------image uploader----------------------

  const [mainImage, setMainImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mainImagesLoader, setMainImagesLoader] = useState(false);
  const [showImageError, setShowImageError] = useState(false);
  const [currentMain, setCurrentMain] = useState([]);

  let dispatch = useDispatch();

  useEffect(() => {
    setDataToInputs();
  }, [isOpen]);

  const setDataToInputs = () => {
    setCategoryName(currentData.name);
    setCategoryDes(
      currentData.description != null ? currentData.description : ""
    );
    setCurrentMain([currentData.file]);
    setCategoryStatus(currentData.status);
  };

  const handleUpdateCategory = () => {
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
      status: categoryStatus,
      description: categoryDes,
      fileId: mainImage?.id,
    };

    // console.log(data);

    if (isValidated) {
      popUploader(dispatch, true);
      updateCategory(currentData.id, data)
        .then((resp) => {
          onClose();
          clearFields();
          popUploader(dispatch, false);
          customToastMsg("Category updated successfully", 1);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const changeStatusProduct = () => {
    customSweetAlert(
      categoryStatus === 1
        ? "Do you want to deactivate this category?"
        : "Do you want to active this category?",
      2,

      () => {
        const newStatus = categoryStatus === 1 ? 2 : 1;
        setCategoryStatus(newStatus);
      }
    );
  };

  const clearFields = () => {
    setCategoryName("");
    setCategoryStatus("");
    setCategoryDes("");
    setMainImages([]);
  };

  const getMainIdValues = async (data) => {
    let temp = {};
    data.map((mediaFile, index) => {
      temp = {
        id:
          mediaFile?.customId === undefined && mediaFile.originFileObj
            ? mediaFile?.response?.data?.id
            : mediaFile?.customId,
        isDefault: true,
      };
    });
    await setMainImages(temp);
    await setIsUploading(true);
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
        Update Category
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col sm="12">
            <Form className="mt-2">
              <FormGroup>
                <Label for="categoryStatus">Category Status</Label>
                <Switch
                  className="ms-4"
                  checked={
                    categoryStatus === 1
                      ? true
                      : categoryStatus === 2
                      ? false
                      : false
                  }
                  onChange={(e) => {
                    changeStatusProduct();
                  }}
                  handleBg={categoryStatus === 1 ? "#60b24c" : "#bababa"}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  style={{
                    backgroundColor:
                      categoryStatus === 1 ? "#60b24c" : "#bababa",
                  }}
                />
              </FormGroup>

              <Row>
                <Col>
                  {" "}
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
                    <h5 className="fs-15 mb-1"> Update Category Images</h5>
                    <p className="text-muted">
                      Update category image.{" "}
                      <small className="text-primary">
                        <b>(Add a PNG image for best view in customer page)</b>{" "}
                      </small>
                    </p>

                    <CustomImageUploader
                      getIds={(data, ids) => getMainIdValues(data, ids)}
                      isMainImage={true}
                      initialData={currentMain}
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
            onClose();
            clearFields();
          }}
        >
          Cancel
        </Button>{" "}
        <Button color="primary" onClick={handleUpdateCategory}>
          Update Category
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateCategoryModal;
