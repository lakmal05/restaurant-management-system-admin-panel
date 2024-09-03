import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Label,
  Input,
  FormGroup,
} from "reactstrap";
import { Plus } from "react-feather";
import {
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { Pagination, Table } from "antd";
import debounce from "lodash/debounce";
import { useDispatch } from "react-redux";
import {
  deleteService,
  getAllServicers,
  serviceFiltration,
} from "../../../service/serviceService";
import AddServiceModal from "../../../Components/Common/modal/AddServiceModal";
import { ServiceTableColumns } from "../../../common/tableColumns";
import UpdateServiceModal from "../../../Components/Common/modal/UpdateServiceModal";

const ServiceManagement = () => {
  document.title = "Service | Restaurant";

  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isUpdateServiceModalOpen, setIsUpdateServiceModalOpen] =
    useState(false);
  const [serviceName, setServiceName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [serviceTableList, setServiceTableList] = useState([]);

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  let dispatch = useDispatch();

  useEffect(() => {
    loadAllServicers(currentPage);
  }, []);

  const toggleAddServiceModal = () => {
    setIsAddServiceModalOpen(!isAddServiceModalOpen);
    loadAllServicers(currentPage);
  };

  const openUpdateServiceModal = (selectService) => {
    setSelectedService(selectService);
    setIsUpdateServiceModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateServiceModalOpen(false);
    loadAllServicers(currentPage);
  };

  const loadAllServicers = (currentPage) => {
    let temp = [];
    clearFiltrationFields();
    popUploader(dispatch, true);
    getAllServicers(currentPage)
      .then((resp) => {
        resp?.data?.map((service, index) => {
          temp.push({
            image: (
              <div
                className="object-fit-cover d-flex justify-content-center"
                key={index}
              >
                {service?.file && Object.keys(service?.file).length > 0 ? (
                  <img
                    key={index}
                    src={img?.originalPath}
                    alt="logo"
                    className="object-fit-cover"
                    width="100%"
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
                    width="70%"
                    height="auto"
                  />
                )}
              </div>
            ),

            name: service?.name,
            description:
              service?.description != null ? service?.description : "",
            categories_status: service?.status,

            action: (
              <>
                {/* {checkPermission(UPDATE_SERVICE) && ( */}
                <Button
                  color="warning"
                  className="m-2"
                  outline
                  onClick={(e) => {
                    openUpdateServiceModal(service);
                  }}
                >
                  <span>Update</span>
                </Button>
                {/* )} */}

                {/* {checkPermission(DELETE_SERVICE) && ( */}
                <Button
                  color="danger"
                  className="m-2"
                  outline
                  onClick={(e) => {
                    handleDeleteService(service?.id);
                  }}
                >
                  <span>Remove</span>
                </Button>
                {/* )} */}
              </>
            ),
          });
        });
        setServiceTableList(temp);
        setCurrentPage(resp?.data?.currentPage);
        setTotalRecodes(resp?.data?.totalCount);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        console.log(err);

        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const searchByServiceFiltration = (name, currentPage) => {
    let temp = [];
    if (name === "") {
      loadAllServicers(currentPage);
    } else {
      popUploader(dispatch, true);
      let data = {
        name: name,
      };

      serviceFiltration(data, currentPage)
        .then((resp) => {
          resp?.data?.map((service, index) => {
            temp.push({
              image: (
                <div
                  className="object-fit-cover d-flex justify-content-center"
                  key={index}
                >
                  {service?.file && Object.keys(service?.file).length > 0 ? (
                    <img
                      key={index}
                      src={img?.originalPath}
                      alt="logo"
                      className="object-fit-cover"
                      width="100%"
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
                      width="70%"
                      height="auto"
                    />
                  )}
                </div>
              ),
              name: service?.name,
              description:
                service?.description != null ? service?.description : "",
              categories_status: service?.status,
              action: (
                <>
                  {/* {checkPermission(UPDATE_SERVICE) && ( */}
                  <Button
                    color="warning"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      openUpdateServiceModal(service);
                    }}
                  >
                    <span>Update</span>
                  </Button>
                  {/* )} */}
                  {/* {checkPermission(DELETE_SERVICE) && ( */}
                  <Button
                    color="danger"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      handleDeleteService(service?.id);
                    }}
                  >
                    <span>Remove</span>
                  </Button>
                  {/* )} */}
                </>
              ),
            });
          });
          setServiceTableList(temp);
          setCurrentPage(resp?.data?.currentPage);
          setTotalRecodes(resp?.data?.totalCount);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          handleError(err);
          popUploader(dispatch, false);
        });
    }
  };

  const debounceSearchByServiceFiltration = React.useCallback(
    debounce(searchByServiceFiltration, 500),
    []
  );
  const handleDeleteService = (cateId) => {
    customSweetAlert("Are you sure to delete this service?", 0, () => {
      popUploader(dispatch, true);
      deleteService(cateId)
        .then(() => {
          popUploader(dispatch, false);
          customToastMsg("Service deleted successfully", 1);
          loadAllServicers(currentPage);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        })
        .finally();
    });
  };

  const onChangePagination = (page) => {
    setCurrentPage(page);
    if (serviceName === "") {
      loadAllServicers(page);
    } else {
      debounceSearchByServiceFiltration(serviceName, page);
    }
  };

  const clearFiltrationFields = () => {
    setServiceName("");
  };

  return (
    <>
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        toggle={() => toggleAddServiceModal()}
      />
      {isUpdateServiceModalOpen && (
        <UpdateServiceModal
          isOpen={isUpdateServiceModalOpen}
          onClose={closeUpdateModal}
          currentData={selectedService}
        />
      )}
      <div className="page-content">
        <Container fluid>
          <h4 className="mt-3">Service Management</h4>

          <Card>
            <Row className="d-flex my-4 mx-1 justify-content-end">
              {/* {checkPermission(CREATE_SERVICE) && ( */}
              <Col sm={12} md={3} lg={3} xl={3}>
                <Button
                  color="primary"
                  className="w-100"
                  onClick={toggleAddServiceModal}
                >
                  <Plus size={24} /> Add New Service
                </Button>
              </Col>
              {/* )} */}
            </Row>

            <Row className="mx-2">
              <Col sm={6} md={6} lg={3} xl={3}>
                <FormGroup>
                  <Label for="exampleEmail">Search by Service Name</Label>
                  <Input
                    id="exampleEmail"
                    name="email"
                    value={serviceName}
                    placeholder="Search by service name"
                    type="text"
                    onChange={(e) => {
                      setServiceName(e.target.value);
                      debounceSearchByServiceFiltration(e.target.value, 1);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} lg={12} xl={12}>
                <Table
                  className="mx-3 my-4"
                  pagination={true}
                  columns={ServiceTableColumns}
                  dataSource={serviceTableList}
                  scroll={{ x: "fit-content" }}
                />
              </Col>
            </Row>

            {/* <Row>
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
                  defaultPageSize={15}
                  total={totalRecodes}
                  showTotal={(total) => `Total ${total} items`}
                />
              </Col>
            </Row> */}
          </Card>
        </Container>
      </div>
    </>
  );
};

export default ServiceManagement;
