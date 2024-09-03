import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Row,
  Input,
  Label,
  Form,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ArrowLeft } from "react-feather";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  countDescription,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
// import "../../../assets/scss/components/productAddStyle.scss";
import { useLocation } from "react-router-dom";
import CustomImageUploader from "../../../Components/Common/upload/ImageUploader";
import { getProductById, updateProduct } from "../../../service/productService";
import { getAllCategoriesToDropDown } from "../../../service/categoryService";
import { desMaxLimit } from "../../../common/util";

const UpdateProduct = () => {
  document.title = "Update Product | Restaurant";
  const location = useLocation();
  const { productData } = location.state;

  const history = useNavigate();
  const dispatch = useDispatch();
  //-------------product--------------------------------
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  //--------------------image uploader----------------------
  const [subImage, setSubImages] = useState([]);
  const [mainImage, setMainImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mainImagesLoader, setMainImagesLoader] = useState(false);
  const [otherImagesLoader, setOtherImagesLoader] = useState(false);
  const [showImageError, setShowImageError] = useState(false);
  const [currentMain, setCurrentMain] = useState([]);
  const [currentSub, setCurrentSub] = useState([]);

  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    loadAllCategories();
    getProductDetails();
  }, []);

  useEffect(() => {
    setDataFieldInProduct();
  }, [productDetails]);

  const setDataFieldInProduct = () => {
    let temp = [];
    productDetails.files?.map(async (f, index) => {
      if (f.isDefault) {
        await setCurrentMain([f?.file]);
      } else {
        temp.push(f?.file);
      }
    });
    setCurrentSub(temp);

    if (productDetails) {
      setProductName(productDetails.name);
      setProductPrice(productDetails.price);
      setProductDesc(
        productDetails.description != null ? productDetails.description : ""
      );
      setSelectedCategory(
        productDetails?.category ? productDetails?.category?.id : ""
      );
    }
  };

  const getProductDetails = () => {
    popUploader(dispatch, true);
    getProductById(productData)
      .then((res) => {
        const response = res?.data;
        let temp = {
          id: response?.id,
          name: response?.name,
          price: response?.price,
          description: response?.description,
          category: response?.category,
          files: response?.productFile,
        };
        setProductDetails(temp);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const loadAllCategories = () => {
    popUploader(dispatch, true);
    setCategoryList([]);
    getAllCategoriesToDropDown()
      .then((res) => {
        let temp = [];
        res?.data?.records.map((cat, index) => {
          temp.push({ value: cat?.id, label: cat?.name });
        });

        setCategoryList(temp);
        popUploader(dispatch, false);
      })
      .catch((c) => {
        popUploader(dispatch, false);
        handleError(c);
      });
  };

  //----------------------product Update ----------------------------------------------

  const getMainIdValues = async (data) => {
    let temp = [];
    data.map((mediaFile, index) => {
      temp.push({
        id:
          mediaFile?.customId === undefined && mediaFile.originFileObj
            ? mediaFile?.response?.data?.id
            : mediaFile?.customId,
        isDefault: true,
      });
    });
    await setMainImages(temp);
    await setIsUploading(true);
  };

  const getSubIdValues = async (data) => {
    let temp = [];
    data.map((mediaFile, index) => {
      temp.push({
        id:
          mediaFile?.customId === undefined && mediaFile.originFileObj
            ? mediaFile?.response?.data?.id
            : mediaFile?.customId,
        isDefault: false,
      });
    });

    await setSubImages(temp);
    await setIsUploading(true);
  };

  const handleUpdateProduct = () => {
    productName === ""
      ? customToastMsg("Product name cannot be empty", 2)
      : selectedCategory === ""
      ? customToastMsg("Select category", 2)
      : productPrice === ""
      ? customToastMsg("Product price cannot be empty", 2)
      : productDesc === ""
      ? customToastMsg("Product description cannot be empty", 2)
      : countDescription(productDesc) > desMaxLimit
      ? customToastMsg("Product description limit exceed", 2)
      : mainImage.length === 0
      ? customToastMsg("Select product main image", 2)
      : subImage.length === 0
      ? customToastMsg(" Select some images for this product", 2)
      : updateFinalProduct();
  };

  const updateFinalProduct = () => {
    let saveData = {
      name: productName,
      price: parseFloat(productPrice),
      description: productDesc,
      categoryId: selectedCategory,
      files: subImage.concat(mainImage),
    };

    updateProduct(productDetails.id, saveData)
      .then(async (res) => {
        popUploader(dispatch, false);
        customToastMsg("Product updated successfully", 1);
        clearProductFields();
        history("/product-management");
      })
      .catch((c) => {
        popUploader(dispatch, false);
        handleError(c);
      });
  };

  const clearProductFields = () => {
    setProductName("");
    setProductDesc("");
    setSelectedCategory("");
    setProductPrice("");
    setMainImages([]);
    setSubImages([]);
  };

  return (
    <div className="page-content">
      <Container fluid className="d-flex flex-row align-baseline mt-4">
        <ArrowLeft
          style={{ cursor: "pointer" }}
          size={18}
          onClick={() => {
            history("/product-management");
          }}
        />{" "}
        <h4 className="mx-2">Update Products</h4>
      </Container>

      <Container className="mt-3" fluid>
        <Row>
          <Form>
            <Card>
              <CardBody>
                <Row>
                  <Col md={4} lg={4} xl={4}>
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="product-name-input"
                      >
                        Product Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="product-name-input"
                        placeholder="Enter product name"
                        name="name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col md={4} lg={4} xl={4}>
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="product-price-input"
                      >
                        Product Price
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="product-price-input"
                        placeholder="Enter product price"
                        name="price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col md={4} lg={4} xl={4}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="product-unit-type">
                        Select Category
                      </Label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isSearchable={true}
                        isClearable
                        value={
                          categoryList.find(
                            (option) => option.value === selectedCategory
                          ) || null
                        }
                        onChange={(e) => {
                          setSelectedCategory(
                            e?.value === undefined
                              ? ""
                              : e === null
                              ? ""
                              : e.value
                          );
                        }}
                        options={categoryList}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    {" "}
                    <Label>Product Description</Label>
                    {countDescription(productDesc) > desMaxLimit ? (
                      <span class="text-count  text-danger">
                        {countDescription(productDesc)} of {desMaxLimit}{" "}
                        Characters
                      </span>
                    ) : (
                      <span class="text-count text-muted">
                        {countDescription(productDesc)} of {desMaxLimit}{" "}
                        Characters
                      </span>
                    )}
                  </div>
                  <CKEditor
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setProductDesc(data);
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
                    data={
                      productDesc != null || productDesc != undefined
                        ? productDesc
                        : ""
                    }
                    onReady={(editor) => {}}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Product Image</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <div className="mb-4">
                    <p className="text-muted">
                      Update Product Image{" "}
                      <small className="text-primary">
                        <b>(Add a PNG image for best view in customer page)</b>{" "}
                      </small>
                    </p>
                    <div className="d-flex">
                      <div className="me-5">
                        <p>Main Image</p>

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
                      </div>

                      <div>
                        <p>Other Images</p>

                        <CustomImageUploader
                          getIds={(data, ids) => getSubIdValues(data, ids)}
                          isMainImage={false}
                          initialData={currentSub}
                        />
                        {otherImagesLoader && (
                          <Alert message="Uploading..." type="info" />
                        )}
                        {!otherImagesLoader && showImageError && (
                          <Alert
                            message="Change Images and Try Again"
                            type="error"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Row>
              </CardBody>
            </Card>

            <div className="d-flex justify-content-end">
              <div className="text-end mb-3" style={{ width: 500 }}>
                <button
                  disabled={!isUploading}
                  type="button"
                  onClick={() => handleUpdateProduct()}
                  className="w-100 btn btn-primary w-sm"
                >
                  Update Product
                </button>
              </div>
            </div>
          </Form>
        </Row>
      </Container>
    </div>
  );
};

export default UpdateProduct;
