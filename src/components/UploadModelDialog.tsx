import "../styles/UploadModelDialog.css";
import { useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { putModelServer } from "../hooks/putModelServer";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { postModelServeFile } from "../hooks/postModelServerFile";
import { useNavigate } from "react-router-dom";

function UploadModelDialog() {
    const navigate = useNavigate();
    const { teamId, projectId, modelId } = useParams();
    const [open, setOpen] = useState(true);
    const [dropZoneClassName, setDropZoneClassName] = useState('file-upload-zone');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [uploadButtonIsDisabled, setUploadButtonIsDisabled] = useState(true);

    // ------------------------------------------------------------------------
    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select an HBJSON file to upload.');
            return;
        }

        setProcessing(true);
        setUploadButtonIsDisabled(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        // Create the New Model in the Database
        let model_id: string | undefined = undefined;
        putModelServer(`${teamId}/${projectId}/create_new_model`, { model_data: {} })
            .then(response => {
                model_id = response.model_id;
            }).then(() => {
                // Upload the File to the new model
                if (model_id !== undefined) {
                    postModelServeFile(
                        `${teamId}/${projectId}/${model_id}/upload_hbjson_file_to_model`,
                        formData,
                        setUploadProgress,
                    )
                }
            }).then(() => {
                // Close the Dialog and Navigate to the new Model
                handleClose();
                navigate(`/${teamId}/${projectId}/${model_id}`);
            });
    };

    // ------------------------------------------------------------------------
    // Drag and drop event handlers
    const handleDragOver = (e: any) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: any) => {
        setUploadButtonIsDisabled(false);
        setDropZoneClassName('file-upload-zone-dropped');
        setIsDragOver(false);
        e.preventDefault();
        e.stopPropagation();
        setSelectedFile(e.dataTransfer.files[0]);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // ------------------------------------------------------------------------
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle id="form-dialog-title">Upload a valid Honeybee-JSON (.hbjson) file to view</DialogTitle>
            <DialogContent>
                <p>
                    Note that while using the free viewer any
                    <a href="https://www.ladybug.tools/honeybee-schema/model.html"> HBJSON model files</a> uploaded
                    are public, and all model files will be removed from the server at the end
                    of your viewing session.
                </p>
                <p>
                    To keep your project files private or to make them available for later
                    viewing and sharing, sign up for a PH-Navigator account.
                </p>
                <div
                    onDrop={handleDrop}
                    className={`${isDragOver ? 'file-upload-zone-drag-over' : dropZoneClassName}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="file-upload-zone-text">
                        {
                            processing ? <div style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                <p>Please Wait. Uploading...</p>
                            </div> :
                                <p>{selectedFile ? selectedFile.name : "Drag and drop an HBJSON model file here to view"}</p>
                        }
                    </div>
                    <div className="upload-progress-bar-empty" style={{ width: "100%" }}>
                        <div className="upload-progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                </div>
                <p className="file-upload-speed-warning">
                    Large files may take some time to upload depending on your
                    internet speed.
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleUpload} color="primary" disabled={uploadButtonIsDisabled}>
                    <UploadFileIcon />
                    Upload Model
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UploadModelDialog;