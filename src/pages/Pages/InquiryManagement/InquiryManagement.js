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
import { DatePicker, Pagination, Table } from "antd";
import debounce from "lodash/debounce";
import { useDispatch } from "react-redux";
import { InquiryTableColumns } from "../../../common/tableColumns";
import {
  getAllInquiries,
  inquiriesFiltration,
} from "../../../service/inquiryService";
import InquiryModal from "../../../Components/Common/modal/InquiryModal";
import moment from "moment";

const InquiryManagement = () => {
  document.title = "Inquiry | Restaurant";

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [searchCustomerEmail, setSearchCustomerEmail] = useState("");
  const [searchDateRange, setSearchDateRange] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState("");
  const [inquiryTableList, setInquiryTableList] = useState([]);

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  const { RangePicker } = DatePicker;

  let dispatch = useDispatch();

  useEffect(() => {
    loadAllInquiries(currentPage);
  }, []);

  const toggleInquiryModal = (selectedInquiry) => {
    setIsInquiryModalOpen(true);
    setSelectedInquiry(selectedInquiry);
  };

  const loadAllInquiries = (currentPage) => {
    let temp = [];
    clearFiltrationFields();
    popUploader(dispatch, true);
    getAllInquiries(currentPage)
      .then((resp) => {
        resp?.data?.map((inquiry, index) => {
          temp.push({
            email: inquiry?.email,
            sendDate: moment(inquiry?.createdAt).format("YYYY-MM-DD"),
            inquiry: inquiry?.message,
            status: inquiry?.status,
            action: (
              <>
                {inquiry?.replyMessage !== null ? (
                  <Button
                    color="warning"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      toggleInquiryModal(inquiry);
                    }}
                  >
                    <span>View</span>
                  </Button>
                ) : (
                  <Button
                    color="success"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      toggleInquiryModal(inquiry);
                    }}
                  >
                    <span>Send Response</span>
                  </Button>
                )}
              </>
            ),
          });
        });
        setInquiryTableList(temp);
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

  const searchByInquiryFiltration = (name, email, dateRange, currentPage) => {
    let temp = [];
    if (
      name === "" &&
      email === "" &&
      (dateRange === undefined || dateRange === null || dateRange === "")
    ) {
      loadAllInquiries(currentPage);
    } else {
      popUploader(dispatch, true);

      let startDate = "";
      let endDate = "";

      if (dateRange && dateRange.length === 2) {
        startDate = moment(dateRange[0]).format("YYYY-MM-DD");
        endDate = moment(dateRange[1]).format("YYYY-MM-DD");
      }

      let data = {
        name: name,
        email: email,
        startDate: startDate,
        endDate: endDate,
      };

      inquiriesFiltration(data, currentPage)
        .then((resp) => {
          resp?.data?.records.map((inquiry, index) => {
            temp.push({
              name: inquiry?.name,
              email: inquiry?.email,
              status: inquiry?.status,
              action: (
                <>
                  <Button
                    color="warning"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      toggleInquiryModal(inquiry);
                    }}
                  >
                    <span>Send Response</span>
                  </Button>

                  <Button
                    color="danger"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      toggleInquiryModal(inquiry);
                    }}
                  >
                    <span>View</span>
                  </Button>
                </>
              ),
            });
          });
          setInquiryTableList(temp);
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

  const debounceSearchByInquiryFiltration = React.useCallback(
    debounce(searchByInquiryFiltration, 500),
    []
  );

  const onChangePagination = (page) => {
    setCurrentPage(page);
    if (
      searchCustomerName === "" &&
      searchCustomerEmail === "" &&
      (searchDateRange === undefined ||
        searchDateRange === null ||
        searchDateRange === "")
    ) {
      loadAllInquiries(page);
    } else {
      debounceSearchByInquiryFiltration(
        searchCustomerName,
        searchCustomerEmail,
        searchDateRange,
        page
      );
    }
  };

  const clearFiltrationFields = () => {
    setSearchCustomerName("");
    setSearchCustomerEmail("");
    setSearchDateRange("");
  };

  return (
    <>
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => {
          setIsInquiryModalOpen(false);
          loadAllInquiries();
        }}
        currentData={selectedInquiry}
      />

      <div className="page-content">
        <Container fluid>
          <h4 className="mt-3">Inquiry Management</h4>
          <Card>
            <Row className="mx-2 mt-5">
              <Col sm={6} md={6} lg={3} xl={3}>
                <FormGroup>
                  <Label for="exampleEmail">Search by Customer Name</Label>
                  <Input
                    id="exampleEmail"
                    name="email"
                    value={searchCustomerName}
                    placeholder="Search by customer name"
                    type="text"
                    onChange={(e) => {
                      setSearchCustomerName(e.target.value);
                      debounceSearchByInquiryFiltration(
                        e.target.value,
                        searchCustomerEmail,
                        searchDateRange,
                        1
                      );
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={6} md={6} lg={3} xl={3}>
                <FormGroup>
                  <Label for="exampleEmail">Search by Email</Label>
                  <Input
                    id="exampleEmail"
                    name="email"
                    value={searchCustomerEmail}
                    placeholder="Search by email"
                    type="email"
                    onChange={(e) => {
                      setSearchCustomerEmail(e.target.value);
                      debounceSearchByInquiryFiltration(
                        searchCustomerName,
                        e.target.value,
                        searchDateRange,
                        1
                      );
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={12} md={6} lg={4}>
                <Label>Search By Date Range</Label>
                <RangePicker
                  style={{ height: 40, width: "100%", borderRadius: 4 }}
                  onChange={(selectedDates) => {
                    if (selectedDates) {
                      const formattedDates = selectedDates.map((date) =>
                        date ? date.format("YYYY-MM-DD") : null
                      );
                      debounceSearchByInquiryFiltration(
                        searchCustomerName,
                        searchCustomerEmail,
                        formattedDates,
                        1
                      );
                      setSearchDateRange(formattedDates);
                    } else {
                      setSearchDateRange("");
                      debounceSearchByInquiryFiltration(
                        searchCustomerName,
                        searchCustomerEmail,
                        "",
                        1
                      );
                    }
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} lg={12} xl={12}>
                <Table
                  className="mx-3 my-4"
                  pagination={true}
                  columns={InquiryTableColumns}
                  dataSource={inquiryTableList}
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

export default InquiryManagement;
