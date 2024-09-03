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
import { OfferTableColumns } from "../../../common/tableColumns";
import {
  deleteOffer,
  getAllOffers,
  offerFiltration,
} from "../../../service/offersService";
import AddOfferModal from "../../../Components/Common/modal/AddOfferModal";
import UpdateOfferModal from "../../../Components/Common/modal/UpdateOfferModal";

const OffersManagement = () => {
  document.title = "Offers | Restaurant";

  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const [isUpdateOfferModalOpen, setIsUpdateOfferModalOpen] = useState(false);
  const [offerTitle, setOfferTitle] = useState("");
  const [selectedSOffer, setSelectedSOffer] = useState("");
  const [offerTableList, setOfferTableList] = useState([]);

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  let dispatch = useDispatch();

  useEffect(() => {
    loadAllOffers(currentPage);
  }, []);

  const toggleAddOfferModal = () => {
    setIsAddOfferModalOpen(!isAddOfferModalOpen);
    loadAllOffers(currentPage);
  };

  const openUpdateOfferModal = (selectOffer) => {
    setSelectedSOffer(selectOffer);
    setIsUpdateOfferModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateOfferModalOpen(false);
    loadAllOffers(currentPage);
  };

  const loadAllOffers = (currentPage) => {
    let temp = [];
    clearFiltrationFields();
    popUploader(dispatch, true);
    getAllOffers(currentPage)
      .then((resp) => {
        resp?.data?.map((offer, index) => {
          temp.push({
            image: (
              <div
                className="object-fit-cover d-flex justify-content-center"
                key={index}
              >
                {offer?.file && Object.keys(offer?.file).length > 0 ? (
                  <img
                    key={index}
                    src={offer.file?.originalPath}
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

            name: offer?.title,
            description: offer?.description != null ? offer?.description : "",
            value: offer?.value,
            startDate: offer?.startAt,
            endDate: offer?.endAt,

            action: (
              <>
                {/* {checkPermission(UPDATE_OFFER) && ( */}
                <Button
                  color="warning"
                  className="m-2"
                  outline
                  onClick={(e) => {
                    openUpdateOfferModal(offer);
                  }}
                >
                  <span>Update</span>
                </Button>
                {/* )} */}

                {/* {checkPermission(DELETE_OFFER) && ( */}
                <Button
                  color="danger"
                  className="m-2"
                  outline
                  onClick={(e) => {
                    handleDeleteOffer(offer?.id);
                  }}
                >
                  <span>Remove</span>
                </Button>
                {/* )} */}
              </>
            ),
          });
        });
        setOfferTableList(temp);
        setCurrentPage(resp?.data?.currentPage);
        setTotalRecodes(resp?.data?.totalCount);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const searchByOfferFiltration = (title, currentPage) => {
    let temp = [];
    if (title === "") {
      loadAllOffers(currentPage);
    } else {
      popUploader(dispatch, true);
      let data = {
        title: title,
      };

      offerFiltration(data, currentPage)
        .then((resp) => {
          resp?.data?.map((offer, index) => {
            temp.push({
              image: (
                <div
                  className="object-fit-cover d-flex justify-content-center"
                  key={index}
                >
                  {offer?.file && Object.keys(offer?.file).length > 0 ? (
                    <img
                      key={index}
                      src={offer.file?.originalPath}
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

              name: offer?.title,
              description: offer?.description != null ? offer?.description : "",
              value: offer?.value,
              startDate: offer?.startAt,
              endDate: offer?.endAt,

              action: (
                <>
                  {/* {checkPermission(UPDATE_OFFER) && ( */}
                  <Button
                    color="warning"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      openUpdateOfferModal(offer);
                    }}
                  >
                    <span>Update</span>
                  </Button>
                  {/* )} */}

                  {/* {checkPermission(DELETE_OFFER) && ( */}
                  <Button
                    color="danger"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      handleDeleteOffer(offer?.id);
                    }}
                  >
                    <span>Remove</span>
                  </Button>
                  {/* )} */}
                </>
              ),
            });
          });
          setOfferTableList(temp);
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

  const debounceSearchByOfferFiltration = React.useCallback(
    debounce(searchByOfferFiltration, 500),
    []
  );
  const handleDeleteOffer = (cateId) => {
    customSweetAlert("Are you sure to delete this offer?", 0, () => {
      popUploader(dispatch, true);
      deleteOffer(cateId)
        .then(() => {
          popUploader(dispatch, false);
          customToastMsg("Offer deleted successfully", 1);
          loadAllOffers(currentPage);
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
    if (offerTitle === "") {
      loadAllOffers(page);
    } else {
      debounceSearchByOfferFiltration(offerTitle, page);
    }
  };

  const clearFiltrationFields = () => {
    setOfferTitle("");
  };

  return (
    <>
      <AddOfferModal
        isOpen={isAddOfferModalOpen}
        toggle={() => toggleAddOfferModal()}
      />
      {isUpdateOfferModalOpen && (
        <UpdateOfferModal
          isOpen={isUpdateOfferModalOpen}
          onClose={closeUpdateModal}
          currentData={selectedSOffer}
        />
      )}
      <div className="page-content">
        <Container fluid>
          <h4 className="mt-3">Offers Management</h4>

          <Card>
            <Row className="d-flex my-4 mx-1 justify-content-end">
              {/* {checkPermission(CREATE_OFFER) && ( */}
              <Col sm={12} md={3} lg={3} xl={3}>
                <Button
                  color="primary"
                  className="w-100"
                  onClick={toggleAddOfferModal}
                >
                  <Plus size={24} /> Add New Offer
                </Button>
              </Col>
              {/* )} */}
            </Row>

            <Row className="mx-2">
              <Col sm={6} md={6} lg={3} xl={3}>
                <FormGroup>
                  <Label for="exampleEmail">Search by Offer Title</Label>
                  <Input
                    id="exampleEmail"
                    name="email"
                    value={offerTitle}
                    placeholder="Search by offer title"
                    type="text"
                    onChange={(e) => {
                      setOfferTitle(e.target.value);
                      debounceSearchByOfferFiltration(e.target.value, 1);
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
                  columns={OfferTableColumns}
                  dataSource={offerTableList}
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

export default OffersManagement;
