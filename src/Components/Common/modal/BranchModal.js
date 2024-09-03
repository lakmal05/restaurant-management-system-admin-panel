import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  countDescription,
  customToastMsg,
  handleError,
  popUploader,
} from "../../../common/commonFunctions";
import { useDispatch } from "react-redux";
import { desMaxLimit } from "../../../common/util";
import { createBranch, updateBranch } from "../../../service/branchService";

const BranchModal = ({ isOpen, toggle, updateValue, isUpdate }) => {
  const [isDone, setIsDone] = useState(false);

  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [facilities, setFacilities] = useState("");

  let dispatch = useDispatch();

  useEffect(() => {
    if (isUpdate) {
      let isSetData = setUpdateDetails();
      setIsDone(isSetData);
    } else {
      setIsDone(true);
    }
  }, [isOpen]);

  const setUpdateDetails = async () => {
    await setBranchName(updateValue?.name);
    await setAddress(updateValue?.address);
    await setLocationUrl(updateValue?.url);
    await setFacilities(
      updateValue?.facilities != null ? updateValue?.facilities : ""
    );
    return true;
  };

  const closeModal = async () => {
    toggle(updateValue);
    await setBranchName("");
    await setAddress("");
    await setFacilities("");
    await setLocationUrl("");
  };

  const saveNewBranch = () => {
    let isValidated = false;

    branchName === ""
      ? customToastMsg("Branch name cannot be empty")
      : address === ""
      ? customToastMsg("Address cannot be empty")
      : facilities === ""
      ? customToastMsg("Facility description cannot be empty")
      : countDescription(facilities) > desMaxLimit
      ? customToastMsg("Facility description limit exceed", 2)
      : locationUrl === ""
      ? customToastMsg("Location url cannot be empty")
      : (isValidated = true);

    const data = {
      name: branchName,
      address: address,
      url: locationUrl,
      facilities: facilities,
    };

    if (isValidated) {
      popUploader(dispatch, true);
      createBranch(data)
        .then((res) => {
          popUploader(dispatch, false);
          closeModal();
          customToastMsg("Branch successfully create", 1);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const updateBranchDetails = () => {
    let isValidated = false;

    branchName === ""
      ? customToastMsg("Branch name cannot be empty")
      : address === ""
      ? customToastMsg("Address cannot be empty")
      : facilities === ""
      ? customToastMsg("Facility description cannot be empty")
      : countDescription(facilities) > desMaxLimit
      ? customToastMsg("Facility description limit exceed", 2)
      : locationUrl === ""
      ? customToastMsg("Location url cannot be empty")
      : (isValidated = true);

    const data = {
      name: branchName,
      address: address,
      url: locationUrl,
      facilities: facilities,
    };

    if (isValidated) {
      popUploader(dispatch, true);
      updateBranch(updateValue.id, data)
        .then((res) => {
          popUploader(dispatch, false);
          closeModal();
          customToastMsg("Branch successfully updated", 1);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  return (
    <Modal isOpen={isOpen} size="lg" toggle={(e) => closeModal()}>
      {isUpdate ? (
        <ModalHeader toggle={(e) => closeModal()}>Update Branch</ModalHeader>
      ) : (
        <ModalHeader toggle={(e) => closeModal()}>Add New Branch</ModalHeader>
      )}

      {isDone && (
        <ModalBody>
          <Form className="row">
            <FormGroup className="col-12 col-lg-6">
              <Label for="branchName">Branch Name</Label>
              <Input
                type="text"
                id="branchName"
                placeholder="Enter branch name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="col-12 col-lg-6">
              <Label for="address">Address</Label>
              <Input
                type="text"
                id="address"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <div>
                <div className="d-flex justify-content-between">
                  {" "}
                  <Label>Facility Description</Label>
                  {countDescription(facilities) > desMaxLimit ? (
                    <span class="text-count  text-danger">
                      {countDescription(facilities)} of {desMaxLimit} Characters
                    </span>
                  ) : (
                    <span class="text-count text-muted">
                      {countDescription(facilities)} of {desMaxLimit} Characters
                    </span>
                  )}
                </div>
                <CKEditor
                  key={branchName}
                  value={facilities}
                  data={facilities}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setFacilities(data);
                  }}
                  config={{
                    toolbar: {
                      items: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "|",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "alignment",
                        "|",
                        "indent",
                        "outdent",
                        "|",
                        "fontColor",
                        "fontSize",
                        "fontBackgroundColor",
                        "|",
                        "undo",
                        "redo",
                        "|",
                        "cut",
                        "copy",
                        "paste",
                        "|",
                        "removeFormat",
                        "|",
                        "blockQuote",
                        "horizontalLine",
                        "|",
                        "code",
                        "|",
                        "specialCharacters",
                        "|",
                      ],
                    },
                  }}
                  editor={ClassicEditor}
                  onReady={(editor) => {}}
                />
              </div>
            </FormGroup>

            <FormGroup className="col-12 col-lg-12">
              <Label for="mapUrl">Location URL</Label>
              <Input
                type="url"
                id="mapUrl"
                placeholder="Enter goggle map location URL"
                value={locationUrl}
                onChange={(e) => setLocationUrl(e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
      )}
      <ModalFooter>
        <Button onClick={(e) => closeModal()}>Cancel</Button>
        {isUpdate ? (
          <Button
            onClick={() => {
              updateBranchDetails();
            }}
            color="primary"
          >
            Update Branch
          </Button>
        ) : (
          <Button
            onClick={() => {
              saveNewBranch();
            }}
            color="primary"
          >
            Add New Branch
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default BranchModal;
