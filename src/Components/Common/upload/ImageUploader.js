import React, { useEffect, useState } from "react";
import { Upload, Input, Button } from "antd";
import "../../../assets/scss/components/customeUploader.scss";
import ImgCrop from "antd-img-crop";
import { handleError, popUploader } from "../../../common/commonFunctions";
import { upload } from "../../../service/fileService";

const CustomImageUploader = ({
  isMainImage,
  getIds,
  initialData,
  resetUploader,
}) => {
  const [fileList, setFileList] = useState([]);
  const [uploadedFileIds, setUploadedFileIds] = useState([]);

  useEffect(() => {
    getIds(fileList);
  }, [fileList]);

  useEffect(() => {
    if (initialData !== undefined) {
      const transformedData = initialData?.map((data) =>
        data?.id
          ? {
              uid: data?.id,
              name: "52254",
              status: "done",
              url: data?.originalPath,
              thumbUrl: data?.originalPath,
              customId: data?.id,
              // altText: data?.altTag,
            }
          : {}
      );

      const ids = initialData.map((data) => data.id);
      setFileList(transformedData);
      setUploadedFileIds(ids);
    } else {
    }
  }, [initialData]);

  useEffect(() => {
    if (resetUploader) {
      setFileList([]);
    }
  }, [resetUploader]);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await upload(formData);
      await setUploadedFileIds((prevIds) => [...prevIds, response.data.id]); // Store the new ID
      const updatedFileList = fileList.map((fileNew) => {
        return fileNew.customId === undefined
          ? { ...fileNew, customId: response.data.id }
          : fileNew;
      });
      setFileList(updatedFileList);
      onSuccess(response, file);
    } catch (error) {
      handleError(error);
      console.error("Error uploading image:", error);
      onError(error);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const deleteFile = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    const newUploadedFileIds = uploadedFileIds.filter(
      (id) => id !== file.response?.data.id
    ); // Safely access response data
    setUploadedFileIds(newUploadedFileIds);
    setFileList(newFileList);
    getIds(newFileList);
  };

  const uploadButton = (
    <div>
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="mb-4">
      <ImgCrop
        fillColor={"transparent"}
        style={{ position: "absolute", zIndex: "9999999999 !important" }}
        rotate
      >
        <Upload
          onRemove={deleteFile}
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          customRequest={handleUpload}
          multiple={false}
        >
          {fileList.length >= (isMainImage ? 1 : 2) ? null : uploadButton}
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default CustomImageUploader;
