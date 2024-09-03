import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Label,
  Input,
  FormGroup,
} from "reactstrap";
import Select from "react-select";
import { Plus } from "react-feather";
import {
  checkPermission,
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import ProductCard from "../../../Components/Common/cards/ProductCard";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { Pagination, Slider } from "antd";
import { getAllCategoriesToDropDown } from "../../../service/categoryService";
import {
  getAllProducts,
  productsFiltration,
} from "../../../service/productService";

const ProductManagement = () => {
  document.title = "Product | Restaurant";

  const history = useNavigate();
  const dispatch = useDispatch();

  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [range, setRange] = useState([0, 0]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  useEffect(() => {
    loadAllProductView(currentPage);
    setStatusList([
      { value: 1, label: "Active" },
      { value: 2, label: "Inactive" },
    ]);
    loadAllCategories();
  }, []);

  useEffect(() => {
    loadAllProductView(currentPage);
  }, [isRefresh]);

  const loadAllCategories = () => {
    setCategoryList([]);
    popUploader(dispatch, true);
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

  const loadAllProductView = (currentPage) => {
    popUploader(dispatch, true);
    setProducts([]);
    clearFiltrationFields();
    let temp = [];
    getAllProducts(currentPage)
      .then((res) => {
        res.data?.records.map((product, index) => {
          temp.push({
            id: product?.id,
            name: product?.name,
            status: product?.status,
            price: product?.price,
            files: product?.productFile,
            description: product?.description,
            category: product?.category,
          });
        });
        setProducts(temp);
        setCurrentPage(res?.data?.currentPage);
        setTotalRecodes(res?.data?.totalCount);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const handleSearchProductFiltration = (
    productName,
    category,
    status,
    range,
    currentPage
  ) => {
    let max = "";
    let min = "";

    if (range[0] === 0 && range[1] === 0) {
      max = "";
      min = "";
    } else {
      min = range[0];
      max = range[1];
    }

    if (
      productName === "" &&
      category === "" &&
      status === "" &&
      max === "" &&
      min === ""
    ) {
      loadAllProductView(currentPage);
    } else {
      setProducts([]);
      popUploader(dispatch, true);

      let data = {
        name: productName,
        category:
          category === undefined ? "" : category === null ? "" : category,
        status: status === undefined ? "" : status === null ? "" : status,
        maxPrice: max,
        minPrice: min,
      };
      let temp = [];
      productsFiltration(data, currentPage)
        .then((res) => {
          res.data?.records.map((product, index) => {
            temp.push({
              id: product?.id,
              name: product?.name,
              status: product?.status,
              price: product?.price,
              files: product?.productFile,
              description: product?.description,
              category: product?.category,
            });
          });
          setProducts(temp);
          setCurrentPage(res?.data?.currentPage);
          setTotalRecodes(res?.data?.totalCount);
          popUploader(dispatch, false);
        })
        .catch((c) => {
          popUploader(dispatch, false);
          handleError(c);
        });
    }
  };

  const debounceHandleSearchProductFiltration = React.useCallback(
    debounce(handleSearchProductFiltration, 500),
    []
  );

  const handleChangePrice = (value) => {
    const sanitizedValue = value.map((v) => (isNaN(v) ? 0 : v));
    setRange(sanitizedValue);
    setMinPrice(sanitizedValue[0]);
    setMaxPrice(sanitizedValue[1]);
    debounceHandleSearchProductFiltration(
      productName,
      selectedCategory,
      selectedStatus,
      sanitizedValue,
      1
    );
  };

  const onChangePagination = (page) => {
    setCurrentPage(page);
    if (productName === "" && selectedStatus === "") {
      loadAllProductView(page);
    } else {
      debounceHandleSearchProductFiltration(
        productName,
        selectedCategory,
        selectedStatus,
        range,
        page
      );
    }
  };

  const clearFiltrationFields = () => {
    setProductName("");
    setSelectedStatus("");
    setSelectedCategory("");
    setRange([0, 0]);
    setMinPrice(0);
    setMaxPrice(0);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <div className="row mt-3">
          <h4>Product Management</h4>
        </div>
        <Card>
          <Row className="d-flex my-4 mx-1 justify-content-between  flex-column-reverse flex-xl-row flex-lg-row flex-md-row">
            <Col sm={12} md={9} lg={7} xl={7}>
              <FormGroup className="ms-3">
                <Label for="exampleEmail">
                  Search by Product Selling Price
                </Label>
                <Row>
                  <Col sm={12} md={8} lg={8} xl={8}>
                    <Slider
                      range
                      min={0}
                      max={10000}
                      value={range}
                      onChange={handleChangePrice}
                    />
                  </Col>
                  <Col sm={12} md={4} lg={4} xl={4}>
                    <Row className="align-items-center justify-content-center">
                      <Input
                        style={{ width: "40%" }}
                        value={minPrice}
                        type="number"
                        onChange={(e) => {
                          setMinPrice(parseFloat(e.target.value));
                          handleChangePrice([
                            parseFloat(e.target.value),
                            maxPrice,
                          ]);
                        }}
                      />
                      <Label
                        style={{
                          width: "min-content",
                          margin: 0,
                          padding: 6,
                        }}
                      >
                        -
                      </Label>
                      <Input
                        style={{ width: "40%" }}
                        value={maxPrice}
                        type="number"
                        onChange={(e) => {
                          setMaxPrice(parseFloat(e.target.value));
                          handleChangePrice([
                            minPrice,
                            parseFloat(e.target.value),
                          ]);
                        }}
                      />
                    </Row>
                  </Col>
                </Row>
              </FormGroup>
            </Col>
            {/* {checkPermission(CREATE_PRODUCT) && ( */}

            <Col sm={12} md={3} lg={3} xl={2}>
              <Button
                color="primary"
                className="w-100"
                onClick={() => {
                  history("/add-new-product");
                }}
              >
                <Plus size={24} /> Add New
              </Button>
            </Col>
            {/* )} */}
          </Row>
          <Row className="mx-2" style={{ zIndex: 10 }}>
            <Col sm={12} md={4} lg={4} xl={4}>
              <FormGroup>
                <Label>Search by Product Name</Label>
                <Input
                  value={productName}
                  placeholder="Search by product name"
                  type="text"
                  onChange={(e) => {
                    setProductName(e.target.value);

                    debounceHandleSearchProductFiltration(
                      e?.target.value,
                      selectedCategory,
                      selectedStatus,
                      range,
                      1
                    );
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={4} lg={4} xl={4}>
              <FormGroup className="ms-3">
                <Label for="exampleEmail">Search by Category</Label>
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
                      e?.value === undefined ? "" : e === null ? "" : e.value
                    );
                    debounceHandleSearchProductFiltration(
                      productName,
                      e?.value === undefined ? "" : e === null ? "" : e.value,
                      selectedStatus,
                      range,
                      1
                    );
                  }}
                  options={categoryList}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={4} lg={4} xl={4}>
              <FormGroup>
                <Label for="exampleEmail">Search by Status</Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable={true}
                  isClearable
                  value={
                    statusList.find(
                      (option) => option.value === selectedStatus
                    ) || null
                  }
                  onChange={(e) => {
                    setSelectedStatus(
                      e?.value === undefined ? "" : e === null ? "" : e.value
                    );

                    debounceHandleSearchProductFiltration(
                      productName,
                      selectedCategory,
                      e?.value === undefined ? "" : e === null ? "" : e.value,
                      range,
                      1
                    );
                  }}
                  options={statusList}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className="mx-2 mb-3">
            {products.map((product, index) => (
              <ProductCard
                reload={async () => {
                  setIsRefresh(true);
                  await loadAllProductView(currentPage);
                }}
                productData={product}
              />
            ))}
          </Row>
          <Row>
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
                defaultPageSize={24}
                total={totalRecodes}
                showTotal={(total) => `Total ${total} items`}
              />
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default ProductManagement;
