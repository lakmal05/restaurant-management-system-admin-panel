import React from "react";
import { Container } from "reactstrap";
import LoaderTea from "../../Components/Common/loader/loaderview";

const DashboardEcommerce = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";
    console.log('DashboardEcommerce')
  return (
    <React.Fragment>


      <div className="page-content">
        <Container fluid>
            <h1 className="bg-primary">Dilanajan</h1>
        </Container>

      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
