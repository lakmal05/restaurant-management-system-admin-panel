import React, { useEffect, useState } from "react";
import "../../../assets/scss/components/productCard.scss";
import { Button, Col, Row } from "reactstrap";
import {
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { Avatar, Checkbox, Tooltip } from "antd";

const OrderProductCard = ({
  productData,
  reload,
  onSelectionChange,
  isChecked,
}) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [isDeleted, setIsDeleted] = useState(0);

  useEffect(() => {}, [isDeleted]);

  const handleCheckboxChange = (e) => {
    const isChecked = e;
    onSelectionChange(productData, isChecked);
  };
  return (
    <>
      <div className="product-single-card">
        <div className="product-info">
          <h6 className="product-category text-truncate d-flex">
            <Tooltip title={productData?.category?.name}>
              {productData?.category?.name}
            </Tooltip>
          </h6>

          <h6 className="product-title text-truncate">
            <Tooltip title={productData?.name}>{productData?.name}</Tooltip>
          </h6>
          <h6 className="product-title text-truncate">
            {" "}
            <Tooltip
              title={parseFloat(productData?.price).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            >
              LKR :{" "}
              {parseFloat(productData?.price).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
            </Tooltip>
          </h6>
        </div>

        <div className="product-top-area">
          <div className="product-img">
            <div className="first-view w-100 h-100 object-fit-cover">
              {productData?.files && productData.files.length > 0 ? (
                productData.files.map((img, index) => {
                  if (img?.isDeafult) {
                    return (
                      <img
                        className="w-100 h-100 object-fit-cover"
                        key={index}
                        src={img?.originalPath}
                        alt="image"
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
        </div>

        {!isChecked && (
          <Button
            className="mt-3 w-100 btn btn-primary w-sm"
            color={"primary"}
            onClick={() => {
              handleCheckboxChange(true);
            }}
          >
            Add to Order
          </Button>
        )}

        {/* Render Remove button if isChecked is true */}
        {isChecked && (
          <Button
            className="mt-3 w-100 btn btn-danger w-sm"
            color={"primary"}
            onClick={() => {
              handleCheckboxChange(false);
            }}
          >
            Remove
          </Button>
        )}
      </div>
    </>
  );
};

export default OrderProductCard;
