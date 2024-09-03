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
import Select from "react-select";
import { Pagination, Table } from "antd";
import debounce from "lodash/debounce";
import { useDispatch } from "react-redux";
import defaultCategoryImg from "../../../assets/images/default-category-img.png";
import {
  categoryFiltration,
  deleteCategory,
  getAllCategories,
} from "../../../service/categoryService";
import { CategoriesTableColumns } from "../../../common/tableColumns";
import AddCategoryModal from "../../../Components/Common/modal/AddCategoryModal";
import UpdateCategoryModal from "../../../Components/Common/modal/UpdateCategoryModal";

const CategoryManagement = () => {
  document.title = "Category | Restaurant";

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] =
    useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [catTableList, setCatTableList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusList, setStatusList] = useState([]);

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  let dispatch = useDispatch();

  useEffect(() => {
    loadAllCatagories(currentPage);
    setStatusList([
      { value: 1, label: "Active" },
      { value: 2, label: "Inactive" },
    ]);
  }, []);

  const toggleAddCategoryModal = () => {
    setIsAddCategoryModalOpen(!isAddCategoryModalOpen);
    loadAllCatagories(currentPage);
  };

  const openUpdateCategoryModal = (selectCategory) => {
    setSelectedCategory(selectCategory);
    setIsUpdateCategoryModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateCategoryModalOpen(false);
    loadAllCatagories(currentPage);
  };

  const loadAllCatagories = (currentPage) => {
    let temp = [];
    clearFiltrationFields();
    popUploader(dispatch, true);
    getAllCategories(currentPage)
      .then((resp) => {
        resp?.data?.records.map((category, index) => {
          temp.push({
            image: (
              <div
                className="object-fit-cover d-flex justify-content-center"
                key={index}
              >
                {category?.file && Object.keys(category?.file).length > 0 ? (
                  <img
                    key={index}
                    src={category.file?.originalPath}
                    alt="logo"
                    className="object-fit-cover"
                    width="100%"
                    height="auto"
                    onError={(e) => (e.target.src = defaultCategoryImg)}
                  />
                ) : (
                  <img
                    src={defaultCategoryImg}
                    alt="placeholder"
                    className="object-fit-cover"
                    width="70%"
                    height="auto"
                  />
                )}
              </div>
            ),

            name: category?.name,
            description:
              category?.description != null ? category?.description : "",
            categories_status: category?.status,

            action: (
              <>
                {/* {checkPermission(UPDATE_CATEGORY) && ( */}
                <Button
                  color="warning"
                  className="m-2"
                  outline
                  onClick={(e) => {
                    openUpdateCategoryModal(category);
                  }}
                >
                  <span>Update</span>
                </Button>
                {/* )} */}

                {/* {checkPermission(DELETE_CATEGORY) && ( */}
                <Button
                  color="danger"
                  className="m-2"
                  outline
                  onClick={(e) => {
                    handleDeleteCategory(category?.id);
                  }}
                >
                  <span>Remove</span>
                </Button>
                {/* )} */}
              </>
            ),
          });
        });
        setCatTableList(temp);
        setCurrentPage(resp?.data?.currentPage);
        setTotalRecodes(resp?.data?.totalCount);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const searchByCategoryFiltration = (name, selectedStatus, currentPage) => {
    let temp = [];
    if (name === "" && selectedStatus === "") {
      loadAllCatagories(currentPage);
    } else {
      popUploader(dispatch, true);
      let data = {
        name: name,
        selectedStatus: selectedStatus,
      };

      categoryFiltration(data, currentPage)
        .then((resp) => {
          resp?.data?.records.map((category, index) => {
            temp.push({
              image: (
                <div
                  className="object-fit-cover d-flex justify-content-center"
                  key={index}
                >
                  {category?.file && Object.keys(category?.file).length > 0 ? (
                    <img
                      key={index}
                      src={category.file?.originalPath}
                      alt="logo"
                      className="object-fit-cover"
                      width="100%"
                      height="auto"
                      onError={(e) => (e.target.src = defaultCategoryImg)}
                    />
                  ) : (
                    <img
                      src={defaultCategoryImg}
                      alt="placeholder"
                      className="object-fit-cover"
                      width="70%"
                      height="auto"
                    />
                  )}
                </div>
              ),
              name: category?.name,
              description:
                category?.description != null ? category?.description : "",
              categories_status: category?.status,
              action: (
                <>
                  {/* {checkPermission(UPDATE_CATEGORY) && ( */}
                  <Button
                    color="warning"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      openUpdateCategoryModal(category);
                    }}
                  >
                    <span>Update</span>
                  </Button>
                  {/* )} */}
                  {/* {checkPermission(DELETE_CATEGORY) && ( */}
                  <Button
                    color="danger"
                    className="m-2"
                    outline
                    onClick={(e) => {
                      handleDeleteCategory(category?.id);
                    }}
                  >
                    <span>Remove</span>
                  </Button>
                  {/* )} */}
                </>
              ),
            });
          });
          setCatTableList(temp);
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

  const debounceSearchByCategoryFiltration = React.useCallback(
    debounce(searchByCategoryFiltration, 500),
    []
  );

  const handleDeleteCategory = (cateId) => {
    console.log(cateId);

    customSweetAlert("Are you sure to delete this category?", 0, () => {
      popUploader(dispatch, true);
      deleteCategory(cateId)
        .then((res) => {
          popUploader(dispatch, false);
          customToastMsg("Category deleted successfully", 1);
          loadAllCatagories(currentPage);
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
    if (categoryName === "" && selectedStatus === "") {
      loadAllCatagories(page);
    } else {
      debounceSearchByCategoryFiltration(categoryName, selectedStatus, page);
    }
  };

  const clearFiltrationFields = () => {
    setCategoryName("");
    setSelectedStatus("");
  };

  return (
    <>
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        toggle={() => toggleAddCategoryModal()}
      />
      {isUpdateCategoryModalOpen && (
        <UpdateCategoryModal
          isOpen={isUpdateCategoryModalOpen}
          onClose={closeUpdateModal}
          currentData={selectedCategory}
        />
      )}
      <div className="page-content">
        <Container fluid>
          <h4 className="mt-3">Category Management</h4>

          <Card>
            <Row className="d-flex my-4 mx-1 justify-content-end">
              {/* {checkPermission(CREATE_CATEGORY) && ( */}
              <Col sm={12} md={3} lg={3} xl={3}>
                <Button
                  color="primary"
                  className="w-100"
                  onClick={toggleAddCategoryModal}
                >
                  <Plus size={24} /> Add New Category
                </Button>
              </Col>
              {/* )} */}
            </Row>

            <Row className="mx-2">
              <Col sm={6} md={6} lg={3} xl={3}>
                <FormGroup>
                  <Label for="exampleEmail">Search by Category Name</Label>
                  <Input
                    id="exampleEmail"
                    name="email"
                    value={categoryName}
                    placeholder="Search by category name"
                    type="text"
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      debounceSearchByCategoryFiltration(
                        e.target.value,
                        selectedStatus,
                        1
                      );
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm={6} md={6} lg={3} xl={3}>
                <FormGroup>
                  <Label for="exampleEmail">Search by Status</Label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable
                    value={
                      statusList.find(
                        (option) => option.value === selectedStatus
                      ) || null
                    }
                    onChange={(e) => {
                      setSelectedStatus(
                        e?.value === undefined ? "" : e === null ? "" : e.value
                      );
                      debounceSearchByCategoryFiltration(
                        categoryName,
                        e?.value === undefined ? "" : e === null ? "" : e.value,
                        1
                      );
                    }}
                    options={statusList}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} lg={12} xl={12}>
                <Table
                  className="mx-3 my-4"
                  pagination={false}
                  columns={CategoriesTableColumns}
                  dataSource={catTableList}
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
    </>
  );
};

export default CategoryManagement;
