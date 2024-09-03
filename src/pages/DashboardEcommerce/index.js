import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { ApexChartComponent } from "../Charts/ApexChartComponent";
import ApexLineChartComponent from "../Charts/ApexLineChartComponent";
import ApexMixChartComponent from "../Charts/ApexMixChartComponent";
import { useNavigate } from "react-router-dom";

const DashboardEcommerce = () => {
  document.title = "Dashboard | Restaurant";
  const history = useNavigate();
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="mt-4">
            <Col md={12} lg={12} xl={5}>
              <Row>
                <Col md={12}>
                  {" "}
                  <h5>Collect Payments</h5>
                  <p className="text-muted">
                    Make sure to collect your payments here
                  </p>
                  <Button
                    color="primary"
                    className="my-2"
                    onClick={(e) => {
                      history("/payment-management");
                    }}
                  >
                    <span>Collect Payment</span>
                  </Button>
                </Col>
                <Col md={12} className="mt-3">
                  {" "}
                  <h5>Manage Table Reservations</h5>
                  <p className="text-muted">
                    Easily manage table reservations by accepting or rejecting
                    them directly from your dashboard, streamlining your
                    reservation process.
                  </p>
                  <Button
                    color="primary"
                    className="my-2"
                    onClick={(e) => {
                      history("/reservation-management");
                    }}
                  >
                    <span>Check Reservations</span>
                  </Button>
                </Col>
              </Row>{" "}
            </Col>
            {/* <Col md={12} lg={6} xl={4}>
              <h5>Package Sales Summery</h5> <ApexChartComponent />
            </Col> */}
            <Col md={12} lg={12} xl={7}>
              {" "}
              <h5>Annual Branches Incomes</h5>
              <ApexLineChartComponent />
            </Col>
          </Row>
          <Row className="mt-4">
            <h5>Annual Product Sales Summery</h5>
            <ApexMixChartComponent />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
