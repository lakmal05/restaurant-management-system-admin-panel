import React, { useEffect, useState, useCallback } from "react";
import { Button, Card, Col, Container, Row } from "reactstrap";
import { Eye, Plus, Trash } from "react-feather";
import {
  customSweetAlert,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { Pagination } from "antd";
import { useDispatch } from "react-redux";
import {
  addGalleryImages,
  deleteGalleryImages,
  getAllGalleryImages,
} from "../../../service/galleryService";
import defaultCategoryImg from "../../../assets/images/default-category-img.png";
import Viewer from "react-viewer";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { upload } from "../../../service/fileService";

const GalleryManagement = () => {
  document.title = "Gallery | Restaurant";

  const [galleryList, setGalleryList] = useState([]);
  const [visible, setVisible] = useState(false);

  //--------------------image uploader----------------------
  const [galleryImgs, setGalleryImgs] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  //-------------------------- pagination --------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecodes, setTotalRecodes] = useState(0);

  let dispatch = useDispatch();

  useEffect(() => {
    loadAllGallery(currentPage);
  }, []);
  useEffect(() => {
    console.log(galleryImgs);
    console.log(fileList);
  }, [galleryImgs]);

  const loadAllGallery = (currentPage) => {
    let temp = [];
    popUploader(dispatch, true);
    getAllGalleryImages(currentPage)
      .then((resp) => {
        resp?.data.map((gallery, index) => {
          temp.push({
            id: gallery?.id,
            src: gallery?.file?.originalPath,
            action: (
              <>
                {/* {checkPermission(DELETE_CATEGORY) && ( */}
                <Button
                  color="danger"
                  className="m-2"
                  outline
                  onClick={(e) => {
                    deleteGalleryImage(category?.id);
                  }}
                >
                  <span>Remove</span>
                </Button>
                {/* )} */}
              </>
            ),
          });
        });
        console.log(temp);

        setGalleryList(temp);
        // setCurrentPage(resp?.data?.currentPage);
        // setTotalRecodes(resp?.data?.totalCount);
        popUploader(dispatch, false);
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const validateGalleryImagesAdd = () => {
    galleryImgs.length === 0
      ? customToastMsg("Select image first", 2)
      : handleAddGalleryImages();
  };

  const handleAddGalleryImages = () => {
    console.log("in");

    const data = {
      fileIds: galleryImgs,
    };

    console.log(data);

    popUploader(dispatch, true);
    addGalleryImages(data)
      .then((res) => {
        popUploader(dispatch, false);
        customToastMsg("Gallery images added successfully", 1);
        setFileList([]);
        setGalleryImgs([]);
        loadAllGallery();
      })
      .catch((err) => {
        popUploader(dispatch, false);
        handleError(err);
      });
  };

  const handleDeleteGalleryImage = (imageId) => {
    customSweetAlert("Are you sure to delete this image?", 0, () => {
      popUploader(dispatch, true);
      console.log(imageId);

      deleteGalleryImages(imageId)
        .then((res) => {
          popUploader(dispatch, false);
          customToastMsg("Gallery image deleted successfully", 1);
          loadAllGallery(currentPage);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        })
        .finally();
    });
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    let temp = {};
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await upload(formData);
      setGalleryImgs((prevIds) => [...prevIds, response?.data?.id]);

      setFileList((prevFileList) =>
        prevFileList.map((fileItem) =>
          fileItem.uid === file.uid
            ? { ...fileItem, customId: response?.data?.id, response: response }
            : fileItem
        )
      );
      setIsUploading(true);
      onSuccess();
    } catch (error) {
      onError(error.message || "Upload failed");
    }
  };

  const deleteFile = (file) => {
    console.log(fileList);
    console.log(file);

    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    const newUploadedFileIds = galleryImgs.filter(
      (id) => id !== file.response?.data?.id
    );
    setGalleryImgs(newUploadedFileIds);
    setFileList(newFileList);
  };

  const onChangePagination = (page) => {
    setCurrentPage(page);
    loadAllGallery(page);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <h4 className="mt-3">Gallery Management</h4>

          <Card>
            <Row className="d-flex my-4 mx-1 justify-content-end">
              <ImgCrop rotationSlider fillColor={"transparent"}>
                <Upload
                  onRemove={deleteFile}
                  customRequest={customRequest}
                  listType="picture-card"
                  fileList={fileList}
                  multiple={false}
                  onChange={onChange}
                  onPreview={onPreview}
                >
                  {fileList.length < 10 && "+ Upload"}
                </Upload>
              </ImgCrop>

              {/* {checkPermission(CREATE_CATEGORY) && ( */}
              <Col sm={12} md={3} lg={3} xl={3}>
                <Button
                  color="primary"
                  className="w-100"
                  onClick={() => {
                    validateGalleryImagesAdd();
                  }}
                >
                  <Plus size={24} /> Add New Gallery Images
                </Button>
              </Col>
              {/* )} */}
            </Row>

            <Row>
              {galleryList.map((image, index) => {
                return (
                  <Col sm={2} md={2} lg={2} xl={2} className="mx-2 my-3">
                    <Card className="px-3 py-4">
                      <div
                        className="object-fit-cover d-flex justify-content-center"
                        key={index}
                      >
                        <img
                          key={index}
                          src={image?.src}
                          alt="image"
                          className="object-fit-cover"
                          width="100%"
                          height="auto"
                          onError={(e) => (e.target.src = defaultCategoryImg)}
                        />
                      </div>
                      <div className="d-flex justify-content-end mt-2">
                        <Button
                          color="primary"
                          onClick={() => {
                            setVisible(true);
                          }}
                        >
                          <Eye size={18} />
                        </Button>
                        <Button
                          color="danger"
                          className="mx-2"
                          onClick={() => {
                            handleDeleteGalleryImage(image?.id);
                          }}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </Card>
                    <Viewer
                      visible={visible}
                      onClose={() => {
                        setVisible(false);
                      }}
                      images={[{ src: image?.src, alt: "gallery image" }]}
                    />
                  </Col>
                );
              })}
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

export default GalleryManagement;
