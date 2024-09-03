import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  CardBody,
  CardHeader,
  Label,
  FormGroup,
  Input,
} from "reactstrap";
import {
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { Divider, Pagination } from "antd";
import debounce from "lodash/debounce";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  getAllProducts,
  productsFiltration,
} from "../../../service/productService";
import { useDispatch } from "react-redux";
import { getAllCategoriesToDropDown } from "../../../service/categoryService";
import { placeOrder } from "../../../service/orderService";
import OrderProductCard from "../../../Components/Common/cards/OrderProductCard";
import ProductTableRow from "../../../Components/Common/formRepeaters/ProductTableRow";
import { getAllStaff } from "../../../service/staffService";
import { makeAdvancePayment } from "../../../service/paymentService";

const CreateDiningOrder = () => {
  document.title = "Place Dining Order | Restaurant";

  const history = useNavigate();

  const [productCardList, setProductCardList] = useState([]);
  const [totalSub, setTotalSub] = useState(0);
  const [productsList, setProductsList] = useState([]);
  const [selectedProductsList, setSelectedProductsList] = useState([]);

  const [superAdminObject, setSuperAdminObject] = useState({});

  const [paymentId, setPaymentId] = useState("");

  //-------------product filtration --------------------
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryList, setCategoryList] = useState("");
  const [productName, setProductName] = useState("");

  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expireDate, setExpireDate] = useState("");

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    loadAllProducts(currentPage);
    loadAllCategories();
    loadAllStaff();
    setPaymentTypeList([
      { value: "CASH_ON_DELIVERY", label: "CASH_ON_DELIVERY" },
      { value: "ONLINE_PAYMENT", label: "ONLINE_PAYMENT" },
    ]);
  }, []);

  const loadAllProducts = async (currentPage) => {
    popUploader(dispatch, true);
    setProductCardList([]);
    let temp = [];
    await getAllProducts(currentPage)
      .then((res) => {
        res.data?.records.map((product, index) => {
          if (product?.status === 1) {
            temp.push({
              id: product?.id,
              name: product?.name,
              status: product?.status,
              price: product?.price,
              files: product?.productFile,
              description: product?.description,
              category: product?.category,
            });
          }
        });
        setProductCardList(temp);
        setCurrentPage(res?.data?.currentPage);
        setTotalRecodes(res?.data?.totalRecords);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const loadAllCategories = () => {
    popUploader(dispatch, true);
    getAllCategoriesToDropDown()
      .then((res) => {
        let temp = [];
        res?.data?.records.map((cat, index) => {
          if (cat?.status === 1) {
            temp.push({ value: cat?.id, label: cat?.name });
          }
        });
        setCategoryList(temp);
        popUploader(dispatch, false);
      })
      .catch((c) => {
        popUploader(dispatch, false);
        handleError(c);
      });
  };

  const loadAllStaff = () => {
    popUploader(dispatch, true);
    setSuperAdminObject({});
    getAllStaff()
      .then((res) => {
        let formattedData = {};
        res.data.records.map((record) => {
          if (record?.user?.role?.name === "SUPER_ADMIN") {
            formattedData = {
              id: record?.user?.id,
              firstName: record?.user?.firstName,
              lastName: record?.user?.lastName,
              email: record?.user?.email,
              contactNo: record?.user?.staff?.contactNo
                ? record?.user?.staff?.contactNo
                : "empty",
            };
          }
        });

        setSuperAdminObject(formattedData);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        console.log(err);
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const handleProductSelection = async (product, isSelected) => {
    if (isSelected) {
      setSelectedProductsList((prevList) => [...prevList, product]);
    } else {
      setSelectedProductsList((prevList) =>
        prevList.filter((item) => {
          if (item.id === product.id) {
            item.quantity = undefined;
            item.total = undefined;
          }
          return item.id !== product.id;
        })
      );
      setTotalSub((prevTotal) => prevTotal - product.total);
    }
  };

  const calculateTotal = (total, qty, product) => {
    appendQtyAndTotalToObject(total, qty, product);
  };

  const appendQtyAndTotalToObject = (total, qty, product) => {
    const selectedProduct = selectedProductsList.find(
      (item) => item.id === product.id
    );
    if (selectedProduct) {
      selectedProduct.total = total;
      selectedProduct.quantity = qty;
      setSelectedProductsList((prevList) =>
        prevList.map((item) =>
          item.id === selectedProduct.id ? selectedProduct : item
        )
      );
    }
    calculateAllTotal(product);
  };

  const calculateAllTotal = (product) => {
    let total = 0;
    selectedProductsList.forEach((product) => {
      total += product.total || 0;
    });
    setTotalSub(total.toFixed(2));
  };

  const removeProductFromOrder = (total, productToRemove) => {
    setSelectedProductsList((prevList) =>
      prevList.filter((item) => item.id !== productToRemove.id)
    );

    productToRemove.quantity = "";
    productToRemove.total = 0.0;

    setTotalSub((prevTotal) => (prevTotal - total).toFixed(2));
  };

  const createOrder = () => {
    const hasEmptyValues = selectedProductsList.some(
      (item) => item.quantity === ""
    );
    selectedProductsList.length === 0
      ? customToastMsg("Select products to order", 2)
      : hasEmptyValues
      ? customToastMsg("Enter order quantity of products you selected", 2)
      : selectedPaymentType === ""
      ? customToastMsg("Select payment type", 2)
      : selectedPaymentType === "ONLINE_PAYMENT" && cardName.trim() === ""
      ? customToastMsg("Card name cannot be empty", 2)
      : selectedPaymentType === "ONLINE_PAYMENT" && cardNumber.trim() === ""
      ? customToastMsg("Card number cannot be empty", 2)
      : selectedPaymentType === "ONLINE_PAYMENT" && cvv.trim() === ""
      ? customToastMsg("Card cvv cannot be empty", 2)
      : selectedPaymentType === "ONLINE_PAYMENT" && expireDate === ""
      ? customToastMsg("Card ExpireDate cannot be empty", 2)
      : saveOrder();
  };

  const saveOrder = () => {
    popUploader(dispatch, true);
    if (selectedPaymentType === "ONLINE_PAYMENT") {
      makePayment();
    }
    setProductsList([]);
    let temp = [];
    selectedProductsList.map((item, index) => {
      temp.push({
        id: item.id,
        qty: parseFloat(item?.quantity),
      });
    });

    setProductsList(temp);
    let saveData = {};
    selectedPaymentType === "ONLINE_PAYMENT"
      ? (saveData = {
          paymentType: selectedPaymentType,
          subTotal: parseFloat(totalSub),
          description: "",
          userId: superAdminObject?.id,
          orderItems: temp,
          firstName: superAdminObject?.firstName,
          lastName: superAdminObject?.lastName,
          contactNo: superAdminObject?.contactNo,
          email: superAdminObject?.email,
          addressLine: "In Shop",
          orderType: "DINING",
          paymentId: paymentId,
        })
      : selectedPaymentType === "CASH_ON_DELIVERY"
      ? (saveData = {
          paymentType: selectedPaymentType,
          subTotal: parseFloat(totalSub),
          description: "",
          userId: superAdminObject?.id,
          orderItems: temp,
          firstName: superAdminObject?.firstName,
          lastName: superAdminObject?.lastName,
          contactNo: superAdminObject?.contactNo,
          email: superAdminObject?.email,
          addressLine: "In Shop",
          orderType: "DINING",
          paymentId: "",
        })
      : "";

    console.log(saveData);

    placeOrder(saveData)
      .then(async (res) => {
        customToastMsg("Order placed successfully", 1);
        clearPackageFields();
        popUploader(dispatch, false);
        history("/dinging-order-management");
      })
      .catch((c) => {
        console.log(c);
        popUploader(dispatch, false);
        handleError(c);
      });
  };

  const makePayment = () => {
    const data = {
      amount: parseFloat(totalSub),
      cardDetails: {
        name: cardName,
        cardNo: cardNumber,
        cvv: cvv,
        expDate: expireDate,
      },
    };

    makeAdvancePayment(data)
      .then((response) => {
        // popUploader(dispatch, false);
        customToastMsg("Payment added successfully", 1);
        setPaymentId(paymentId);
      })
      .catch((error) => {
        // popUploader(dispatch, false);
        handleError(error);
      });
  };

  const clearPackageFields = () => {
    setSelectedCategory("");
    setProductName("");
    setCardName("");
    setCardNumber("");
    setCvv("");
    setExpireDate("");
    setSelectedPaymentType("");
  };

  const handleSearchProductFiltration = (
    productName,
    category,
    currentPage
  ) => {
    if (productName === "" && category === "") {
      loadAllProducts(currentPage);
    } else {
      popUploader(dispatch, true);
      let temp = [];

      let data = {
        name: productName,
        category:
          category === undefined ? "" : category === null ? "" : category,
        status: "",
        maxPrice: "",
        minPrice: "",
      };
      productsFiltration(data, currentPage)
        .then((res) => {
          res.data?.records.map((product, index) => {
            if (product?.status === 1) {
              temp.push({
                id: product?.id,
                name: product?.name,
                status: product?.status,
                price: product?.price,
                files: product?.productFile,
                description: product?.description,
                category: product?.category,
              });
            }
          });
          setProductCardList(temp);
          setCurrentPage(res?.data?.currentPage);
          setTotalRecodes(res?.data?.totalRecords);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const debounceSearchProductFiltration = React.useCallback(
    debounce(handleSearchProductFiltration, 500),
    []
  );

  const onChangePagination = (page) => {
    setCurrentPage(page);

    if (!productName && selectedCategory === "") {
      loadAllProducts(page);
    } else {
      debounceSearchProductFiltration(productName, selectedCategory, page);
    }
  };

  return (
    <div className="page-content">
      <Container fluid className="d-flex flex-row align-baseline mt-4">
        <ArrowLeft
          style={{ cursor: "pointer" }}
          size={18}
          onClick={() => {
            history("/dinging-order-management");
          }}
          className="me-2"
        />{" "}
        <h4>Create Dinging Order</h4>
      </Container>
      <Container fluid>
        <Row>
          <Col sm={12} md={6} lg={6} xl={7}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  Select products to your order
                </h5>
              </CardHeader>
              <CardBody>
                <Row className="my-3">
                  <Col sm={12} md={6} lg={6} xl={6}>
                    <FormGroup className="ms-3">
                      <Label for="productName">Search by Product Name</Label>
                      <Input
                        id="productName"
                        name="name"
                        className="form-control"
                        value={productName}
                        placeholder="Search by product name"
                        type="text"
                        onChange={(e) => {
                          setProductName(e.target.value);
                          debounceSearchProductFiltration(
                            e.target.value,
                            selectedCategory,
                            1
                          );
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6} lg={6} xl={6}>
                    <FormGroup className="ms-3">
                      <Label for="productCategory">Search by Category</Label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isSearchable={true}
                        isClearable
                        onChange={(e) => {
                          setSelectedCategory(
                            e?.value === undefined
                              ? ""
                              : e === null
                              ? ""
                              : e.value
                          );
                          debounceSearchProductFiltration(
                            productName,
                            e?.value === undefined
                              ? ""
                              : e === null
                              ? ""
                              : e.value,
                            1
                          );
                        }}
                        options={categoryList}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  {productCardList.map((product, index) => (
                    <Col sm={6} md={6} lg={6} xl={4} xxl={4} className="my-2 ">
                      <OrderProductCard
                        key={product.id}
                        productData={product}
                        onSelectionChange={handleProductSelection}
                        isChecked={selectedProductsList.some(
                          (item) => item.id === product.id
                        )}
                      />
                    </Col>
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
                      total={totalRecodes}
                      defaultPageSize={24}
                      showTotal={(total) => `Total ${total} items`}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm={12} md={6} lg={6} xl={5}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Quantity and Price</h5>
              </CardHeader>
              <CardBody>
                <Row className="mx-2  my-2">
                  <Col sm={4} md={4} lg={4} xl={4}>
                    <h6>Name</h6>
                  </Col>
                  <Col sm={4} md={3} lg={3} xl={3}>
                    {" "}
                    <h6>Quantity</h6>
                  </Col>
                  <Col sm={2} md={2} lg={2} xl={3} className="text-end">
                    <h6>Price</h6>
                  </Col>
                  <Col
                    sm={2}
                    md={3}
                    lg={3}
                    xl={2}
                    className="text-end pe-xxl-4 pe-xl-1 pe-lg-0 pe-4"
                  >
                    <h6>Action</h6>
                  </Col>
                </Row>
                {selectedProductsList.map((product) => (
                  <ProductTableRow
                    calculateTotal={calculateTotal}
                    key={product.id}
                    product={product}
                    removeFromPackage={(total, product) => {
                      removeProductFromOrder(total, product);
                    }}
                  />
                ))}
                <Divider />
                <div
                  className="py-3 rounded"
                  style={{ backgroundColor: "#ffef8a" }}
                >
                  <Row className="mx-2  my-2 ">
                    <Col sm={8} md={8} lg={8} xl={8}>
                      <h6>Total</h6>
                    </Col>
                    <Col sm={4} md={4} lg={4} xl={4} className="text-end">
                      <h6>
                        {" "}
                        {parseFloat(totalSub).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h6>
                    </Col>
                  </Row>

                  <Row className="mx-2  my-2">
                    <Col
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      className="d-flex align-items-end"
                    >
                      <Label className="form-label">Total Price</Label>
                    </Col>
                    <Col sm={8} md={8} lg={8} xl={8}>
                      <Input
                        type="number"
                        className="form-control text-end"
                        id="package-price"
                        placeholder="Enter package price"
                        name="package-price"
                        disabled={true}
                        value={totalSub}
                      />
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Payment Details</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="package-name-input">
                    Payment Type
                  </Label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable
                    onChange={(e) => {
                      setSelectedPaymentType(
                        e?.value === undefined ? "" : e === null ? "" : e.value
                      );
                    }}
                    options={paymentTypeList}
                  />
                </div>
                {selectedPaymentType === "ONLINE_PAYMENT" && (
                  <div>
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="package-name-input"
                      >
                        Card Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="package-name-input"
                        placeholder="Enter card name"
                        name="name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <Row>
                      <div className="mb-3 col-md-8">
                        <Label
                          className="form-label"
                          htmlFor="package-title-input"
                        >
                          Card No
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="package-title-input"
                          placeholder="Enter card number"
                          name="title"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="mb-3 col-md-4">
                        <Label
                          className="form-label"
                          htmlFor="package-title-input"
                        >
                          CVV
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="package-title-input"
                          placeholder="Enter cvv"
                          name="title"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </Row>
                    <Row>
                      <FormGroup className="col-6">
                        <Label
                          className="form-label"
                          htmlFor="product-expireDate"
                        >
                          Expire Date
                        </Label>
                        <Input
                          type="month"
                          className="form-control"
                          id="product-expireDate"
                          placeholder="Enter expire date"
                          name="expireDate"
                          value={expireDate}
                          onChange={(e) => setExpireDate(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup className="col-6">
                        <Label
                          className="form-label"
                          htmlFor="product-expireDate"
                        >
                          Amount
                        </Label>
                        <Input
                          type="number"
                          disabled={true}
                          className="form-control"
                          id="product-expireDate"
                          placeholder="Enter expireDate"
                          name="expireDate"
                          value={totalSub}
                        />
                      </FormGroup>
                    </Row>
                  </div>
                )}
              </CardBody>
            </Card>

            <div className="text-end mb-3">
              <button
                disabled={selectedPaymentType === ""}
                type="button"
                onClick={() => createOrder()}
                className="w-100 btn btn-primary w-sm"
              >
                Place Order
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateDiningOrder;
