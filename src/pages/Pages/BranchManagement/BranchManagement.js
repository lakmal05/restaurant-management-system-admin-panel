import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Label,
  Input,
  FormGroup,
  Button,
} from "reactstrap";
import { Pagination, Table } from "antd";
import { Plus } from "react-feather";
import { useDispatch } from "react-redux";
import {
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import debounce from "lodash.debounce";
import {
  deleteBranch,
  getAllBranches,
  getAllBranchesFiltration,
} from "../../../service/branchService";
import { BranchTableColumns } from "../../../common/tableColumns";
import BranchModal from "../../../Components/Common/modal/BranchModal";

const BranchManagement = () => {
  document.title = "Branch Management| Restaurant";

  const [branchTableList, setBranchTableList] = useState([]);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isUpdateBranchModalOpen, setIsUpdateBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [searchBranchName, setSearchBranchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  let dispatch = useDispatch();

  useEffect(() => {
    loadAllBranches(currentPage);
  }, []);

  const loadAllBranches = (currentPage) => {
    setBranchTableList([]);
    clearFiltrationFields();
    popUploader(dispatch, true);
    getAllBranches(currentPage)
      .then((res) => {
        const formattedData = res?.data?.records.map((record) => ({
          name: record?.name,
          address: record?.address,
          url: (
            <a href={record.url} target="blank">
              {record.url}
            </a>
          ),
          facilities: record?.facilities,
          action: (
            <>
              <Button
                color="warning"
                className="m-2"
                outline
                onClick={(e) => {
                  toggleModal(record);
                }}
              >
                <span>Update</span>
              </Button>
              <Button
                color="danger"
                className="m-2"
                outline
                onClick={() => handleDeleteBranch(record.id)}
              >
                <span>Remove</span>
              </Button>
            </>
          ),
        }));
        setBranchTableList(formattedData);
        setCurrentPage(res?.data?.currentPage);
        setTotalRecodes(res?.data?.totalCount);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const searchBranchLocatersFiltration = (name, address, currentPage) => {
    popUploader(dispatch, true);
    let temp = [];
    if (name === "" && address === "") {
      loadAllBranches(currentPage);
    } else {
      let data = {
        name: name,
        address: address,
      };

      getAllBranchesFiltration(data, currentPage)
        .then((res) => {
          const formattedData = res?.data?.records.map((record) => ({
            name: record?.name,
            address: record?.address,
            url: (
              <a href={record.url} target="blank">
                {record.url}
              </a>
            ),
            facilities: record?.facilities,
            action: (
              <>
                <Button
                  color="warning"
                  className="m-2"
                  outline
                  onClick={(e) => {
                    toggleModal(record);
                  }}
                >
                  <span>Update</span>
                </Button>
                <Button
                  color="danger"
                  className="m-2"
                  outline
                  onClick={() => handleDeleteBranch(record.id)}
                >
                  <span>Remove</span>
                </Button>
              </>
            ),
          }));
          setBranchTableList(formattedData);
          setCurrentPage(res?.data?.currentPage);
          setTotalRecodes(res?.data?.totalCount);
          popUploader(dispatch, false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const debounceSearchBranchLocatersFiltration = React.useCallback(
    debounce(searchBranchLocatersFiltration, 500),
    []
  );

  const handleDeleteBranch = (branchId) => {
    console.log(branchId);
    customSweetAlert("Are you sure to delete this branch ?", 0, () => {
      popUploader(dispatch, true);
      deleteBranch(branchId)
        .then((res) => {
          loadAllBranches(currentPage);
          popUploader(dispatch, false);
          customToastMsg("Branch has been  deleted", 1);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    });
  };

  const toggleModal = (val) => {
    console.log(val, "00000000000");
    if (val !== undefined) {
      setIsAddBranchModalOpen(true);
      setIsUpdateBranchModalOpen(true);
      setSelectedBranch(val);
      loadAllBranches(currentPage);
    } else {
      setIsAddBranchModalOpen(true);
      loadAllBranches(currentPage);
    }
  };

  const closeBranchModal = () => {
    setIsAddBranchModalOpen(false);
    setIsUpdateBranchModalOpen(false);
    setSelectedBranch([]);
    loadAllBranches(currentPage);
  };

  const clearFiltrationFields = () => {
    setSearchBranchName("");
    setSearchAddress("");
  };

  const onChangePagination = (page) => {
    setCurrentPage(page);
    if (searchBranchName === "" && searchAddress === "") {
      loadAllBranches(page);
    } else {
      debounceSearchBranchLocatersFiltration(
        searchBranchName,
        searchAddress,
        page
      );
    }
  };

  return (
    <div className="page-content">
      <BranchModal
        isUpdate={isUpdateBranchModalOpen}
        updateValue={selectedBranch}
        isOpen={isAddBranchModalOpen}
        toggle={(e) => {
          loadAllBranches(currentPage);
          closeBranchModal();
        }}
      />
      <Container fluid>
        <div className="row mt-3">
          <h4>Branch Management</h4>
        </div>
        <Card>
          <Row className="d-flex mt-4 mb-2 mx-1 justify-content-end">
            <Col
              sm={12}
              md={3}
              lg={3}
              xl={3}
              className="d-flex justify-content-end"
            >
              <Button
                color="primary"
                onClick={() => {
                  toggleModal();
                }}
              >
                <Plus size={24} /> Add New Branch
              </Button>
            </Col>
          </Row>
          <Row className="mx-2">
            <Col sm={12} md={4} lg={3} xl={3}>
              <FormGroup>
                <Label for="branchName">Search by Branch Name</Label>
                <Input
                  id="branchName"
                  name="branchName"
                  placeholder="Search by branch name"
                  type="text"
                  value={searchBranchName}
                  onChange={(e) => {
                    setSearchBranchName(e.target.value);
                    debounceSearchBranchLocatersFiltration(
                      e.target.value,
                      searchAddress,
                      1
                    );
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm={12} md={4} lg={3} xl={3}>
              <FormGroup>
                <Label for="address">Search by Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Search by address"
                  type="text"
                  value={searchAddress}
                  onChange={(e) => {
                    setSearchAddress(e.target.value);
                    debounceSearchBranchLocatersFiltration(
                      searchBranchName,
                      e.target.value,
                      1
                    );
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12} lg={12} xl={12}>
              <Table
                className="mx-3 my-4"
                pagination={false}
                columns={BranchTableColumns}
                dataSource={branchTableList}
                scroll={{ x: "fit-content" }}
              />
            </Col>
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
                defaultPageSize={15}
                total={totalRecodes}
                showTotal={(total) => `Total ${total} items`}
              />
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default BranchManagement;
