import React, { useEffect, useState } from "react";
import "../../../assets/scss/components/productCard.scss";
import { Col } from "reactstrap";
import { MoreVertical } from "react-feather";
import {
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { useNavigate } from "react-router-dom";
import { Button, Popover, Switch, Tag, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { activeInactiveDeleteProduct } from "../../../service/productService";

const ProductCard = ({ productData, reload }) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [isDeleted, setIsDeleted] = useState(0);

  useEffect(() => {
    console.log(productData);
  }, []);

  const handleDeleteProduct = (productId) => {
    customSweetAlert("Are you sure to delete this product?", 0, () => {
      popUploader(dispatch, true);
      activeInactiveDeleteProduct(productId, 0)
        .then((res) => {
          customToastMsg("Product successfully deleted", 1);
          reload();
          let temp = isDeleted;
          setIsDeleted(++temp);
          popUploader(dispatch, false);
        })
        .catch((c) => {
          popUploader(dispatch, false);
          handleError(c);
        });
    });
  };

  const changeStatusProduct = (productData) => {
    const newStatus = productData.status === 1 ? 2 : 1;
    customSweetAlert(
      productData.status === 1
        ? "Do you want to deactivate this product?"
        : "Do you want to active this product?",
      2,
      () => {
        popUploader(dispatch, true);
        activeInactiveDeleteProduct(productData.id, newStatus)
          .then((res) => {
            popUploader(dispatch, false);
            customToastMsg(
              `Product successfully ${1 ? "deactivated" : "activated"}`,
              1
            );
            reload();
          })
          .catch((c) => {
            popUploader(dispatch, false);
            handleError(c);
          });
      }
    );
  };

  const updateProductDetails = () => {
    history("/update-product", {
      state: { productData: productData.id },
    });
  };

  const viewMoreProductDetails = () => {
    history("/view-product", { state: { productId: productData.id } });
  };
  const content = (
    <div className="d-flex flex-column">
      <Button
        className="menu-view-btn"
        onClick={() => {
          viewMoreProductDetails();
        }}
        type="text"
      >
        View
      </Button>
      {/* {checkPermission(UPDATE_PRODUCT) && ( */}
      <Button
        className="menu-view-btn"
        onClick={() => {
          updateProductDetails();
        }}
        type="text"
      >
        Update
      </Button>
      {/* )} */}

      {/* {checkPermission(DELETE_PRODUCT) && ( */}
      <Button
        className="menu-view-btn"
        onClick={(e) => {
          handleDeleteProduct(productData?.id);
        }}
        type="text"
      >
        Delete
      </Button>
      {/* )} */}
    </div>
  );
  return (
    <Col sm={6} md={4} lg={3} xl={3} xxl={2} className="my-2 ">
      <div className="product-single-card">
        <div className="product-top-area">
          <div className="product-img">
            <div className="first-view w-100 h-100 object-fit-cover">
              {productData?.files && productData.files.length > 0 ? (
                productData.files.map((img, index) => {
                  if (img?.isDeafult) {
                    return (
                      <img
                        className="w-100 h-100 object-fit-cover"
                        src={img?.originalPath}
                        alt="product image"
                        onError={(e) =>
                          (e.target.src =
                            "https://i.ibb.co/qpB9ZCZ/placeholder.png")
                        }
                      />
                    );
                  }
                })
              ) : (
                <img
                  src="https://i.ibb.co/qpB9ZCZ/placeholder.png"
                  alt="placeholder"
                  className="w-100 h-100 object-fit-cover"
                />
              )}
            </div>
          </div>
          <div className="sideicons" style={{ cursor: "pointer" }}>
            <div className="menu-div">
              {" "}
              <Popover placement="bottomLeft" content={content}>
                <MoreVertical color="#332321" size={20} />
              </Popover>
            </div>
          </div>
        </div>
        <div className="product-info">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              viewMoreProductDetails();
            }}
          >
            <h6 className="product-category text-truncate d-flex">
              <Tooltip title={productData?.category?.name}>
                {productData?.category?.name}
              </Tooltip>
            </h6>
            <h6 className="product-title text-truncate">
              <Tooltip title={productData?.name}>{productData?.name}</Tooltip>
            </h6>

            <h6 className="product-title text-truncate">
              <Tooltip title={productData?.price}>
                LKR{" "}
                {parseFloat(productData?.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Tooltip>
            </h6>
          </div>
          <h6 className="product-title text-truncate" style={{ zIndex: 1000 }}>
            <Switch
              checked={
                productData.status === 1
                  ? true
                  : productData.status === 2
                  ? false
                  : false
              }
              onChange={(e) => {
                changeStatusProduct(productData);
              }}
              handleBg={productData.status === 1 ? "#60b24c" : "#bababa"}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              style={{
                backgroundColor:
                  productData.status === 1 ? "#60b24c" : "#bababa",
              }}
            />
          </h6>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
