import { Col, InputNumber, Row } from "antd";
import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { Input } from "reactstrap";
import debounce from "lodash/debounce";
import { Trash2 } from "react-feather";

const ProductTableRow = ({ product, calculateTotal, removeFromPackage }) => {
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (product?.quantity) {
      setQuantity(product?.quantity);
    }
  }, []);

  useEffect(() => {
    debounceCalculateItemPrice(parseFloat(product?.price));
    calculateItemPrice(product?.price);
  }, [quantity, product]);

  const calculateItemPrice = async (price) => {
    let calculatePrice = price * quantity;

    setPrice(calculatePrice.toFixed(2));
    calculateTotal(parseFloat(calculatePrice), quantity, product);
  };

  const debounceCalculateItemPrice = useCallback(
    debounce((price) => {
      calculateItemPrice(price);
    }, 1000),
    [calculateItemPrice]
  );

  return (
    <Row className="ms-4  my-3">
      <Col sm={8} md={8} lg={8} xl={8} className="d-flex align-items-end">
        <h6>{product?.name}</h6>
      </Col>
      <Col sm={8} md={8} lg={8} xl={8}>
        <Row className="w-100">
          <Col sm={16} md={16} lg={16} xl={16}>
            <Input
              id="exampleEmail"
              value={quantity}
              suf
              type="number"
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col
        sm={3}
        md={3}
        lg={3}
        xl={3}
        className="d-flex align-items-end justify-content-end"
      >
        <h6>{price}</h6>
      </Col>
      <Col
        sm={4}
        md={4}
        lg={4}
        xl={4}
        className="d-flex align-items-end justify-content-end"
      >
        <button
          type="button"
          onClick={() => removeFromPackage(price, product)}
          className="btn btn-danger"
        >
          <Trash2 size={18} />
        </button>
      </Col>
    </Row>
  );
};

export default ProductTableRow;
