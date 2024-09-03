import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "reactstrap";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import "../../../assets/scss/components/viewProduct.scss";
import { Carousel, Tag } from "antd";
import {
  checkPermission,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";

import { useDispatch } from "react-redux";
import { getProductById } from "../../../service/productService";

const ViewProductDetails = () => {
  const location = useLocation();
  const { productId } = location.state;
  const history = useNavigate();

  document.title = "Product Details | Restaurant";

  const [productData, setProductData] = useState("");
  const [isHaveData, setIsHaveData] = useState(false);
  const [productImg, setProductImg] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  useEffect(() => {
    let temp = [];

    if (productData) {
      let mainImages = [];
      let otherImages = [];

      productData?.files?.forEach((imgFile) => {
        if (imgFile?.isDefault) {
          mainImages.push(imgFile);
        } else {
          otherImages.push(imgFile);
        }
      });

      setProductImg(mainImages.concat(otherImages));
    }
  }, [productData]);

  const loadProductDetails = async () => {
    popUploader(dispatch, true);
    setProductData([]);
    let temp = {};
    await getProductById(productId)
      .then((res) => {
        let product = res.data;
        temp = {
          id: product?.id,
          name: product?.name,
          price: product?.price,
          description: product?.description,
          category: product?.category,
          files: product?.productFile,
          status: product?.status,
        };
        setProductData(temp);
        setIsHaveData(true);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  return (
    <>
      {" "}
      <div className="page-content">
        <Container fluid className="d-flex flex-row align-baseline mt-4">
          <ArrowLeft
            style={{ cursor: "pointer" }}
            size={18}
            onClick={() => {
              history("/product-management");
            }}
          />{" "}
          <h4 className="mx-2">{productData.name}</h4>
        </Container>
        {isHaveData && (
          <Container fluid>
            <Card>
              <Row className="my-4 mx-2">
                <Col sm={12} md={6} lg={6} xl={3}>
                  <div className="object-fit-cover d-flex justify-content-center justify-content-xl-start justify-content-lg-start justify-content-md-start">
                    <Carousel autoplay>
                      {productImg.map((img, index) => (
                        <div
                          key={index}
                          className="d-flex justify-content-center"
                        >
                          {img?.file ? (
                            <img
                              src={img?.file?.originalPath}
                              alt={img?.altTag}
                              className="object-fit-cover rounded-4"
                              width="80%"
                              height="auto"
                              onError={(e) =>
                                (e.target.src =
                                  "https://i.ibb.co/qpB9ZCZ/placeholder.png")
                              }
                            />
                          ) : (
                            <img
                              src="https://i.ibb.co/qpB9ZCZ/placeholder.png"
                              alt="placeholder"
                              className="object-fit-cover"
                              width="80%"
                              height="auto"
                            />
                          )}
                        </div>
                      ))}
                    </Carousel>
                  </div>
                </Col>
                <Col
                  sm={12}
                  md={6}
                  lg={6}
                  xl={7}
                  className="mt-5 mt-xl-1  mt-lg-1  mt-md-1 text-xl-start text-lg-start text-md-start text-center d-flex flex-column align-items-center align-items-md-start"
                >
                  <h4>{productData?.name}</h4>

                  <h5 className="product-data my-3">
                    Price : LKR{" "}
                    {parseFloat(productData?.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h5>

                  <h5 className="product-data my-2">
                    Category : {productData?.category?.name}{" "}
                  </h5>

                  <h5 className="product-data my-3">
                    Status :
                    <Tag
                      className="ms-3 fs-6 "
                      color={
                        productData?.status === 1
                          ? "success"
                          : productData?.status === 2
                          ? "error"
                          : "default"
                      }
                      key={productData?.status}
                    >
                      {productData?.status === 1
                        ? "ACTIVE"
                        : productData?.status === 2
                        ? "INACTIVE"
                        : "none"}
                    </Tag>
                  </h5>
                </Col>
                {/* {checkPermission(UPDATE_PRODUCT) ? ( */}
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  xl={2}
                  className="d-flex justify-content-center justify-content-md-end align-items-start mt-5 mt-xl-5"
                >
                  <button
                    type="button"
                    onClick={() =>
                      history("/update-product", {
                        state: { productData: productData.id },
                      })
                    }
                    className="btn btn-primary w-sm me-4"
                  >
                    Update Product
                  </button>
                </Col>
                {/* ) : (
                  ""
                )} */}

                <Col sm={12} md={12} lg={12} xl={12}>
                  <h5 className="product-data my-3 text-center text-md-start mt-5">
                    {parse(productData?.description)}
                  </h5>
                </Col>
              </Row>
            </Card>
          </Container>
        )}
      </div>
    </>
  );
};

export default ViewProductDetails;
