import Collapse from "@mui/material/Collapse";
import  Alert  from "@mui/material/Alert";
import IconButton  from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// import Space from "./space";

const CustomAlert = ({ alert, setAlert }) => {
  return (
    <Collapse in={alert.show}>
      <Alert
        severity={alert.severity}
        action={
          <IconButton onClick={() => setAlert({ ...alert, show: false })}>
            <CloseIcon />
          </IconButton>
        }
      >
        {alert.msg}
      </Alert>
      <br />
    </Collapse>
  );
};

export default CustomAlert;
