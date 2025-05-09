import { React, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { TITLE, BUTTON_ADD_COLOR } from "common/color";
import Breadcrumbs from "ui-component/extended/Breadcrumbs";
import VoteIcon from "assets/images/VoteIcon.png";

const candidates = [
  {
    id: 1,
    name: "Dorji Gyeltshen",
    image: "https://via.placeholder.com/80x100",
  },
  {
    id: 2,
    name: "Sonam Penjor",
    image: "https://via.placeholder.com/80x100",
  },
  {
    id: 3,
    name: "Dorji Gyeltshen",
    image: "https://via.placeholder.com/80x100",
  },
];

const LocalElectionScanPage = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirmClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const selectedCandidateData = candidates.find(
    (c) => c.id === selectedCandidate
  );

  return (
    <>
      <Box mt={4}>
        {" "}
        <Typography
          variant="h2"
          align="center"
          fontWeight="bold"
          sx={{ color: TITLE, mb: 4 }}
        >
          Local Government Elections
        </Typography>
      </Box>
      <Box
        mt={1}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ borderRadius: 4, p: 4, width: "80%", maxWidth: 900 }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate, index) => (
                  <TableRow key={candidate.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell align="center">
                      <Avatar
                        src={candidate.image}
                        alt={candidate.name}
                        sx={{ width: 56, height: 70 }}
                        variant="rounded"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <ArrowCircleLeftIcon
                        fontSize="large"
                        sx={{
                          color:
                            selectedCandidate === candidate.id
                              ? "#c0392b"
                              : "#003366", // green if selected
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => setSelectedCandidate(candidate.id)}
                        sx={{
                          backgroundColor:
                            selectedCandidate === candidate.id
                              ? "#667FA5"
                              : "#003366", // green if selected
                          borderRadius: "30px",
                          px: 7,
                          py: 2.5,
                          minWidth: "100px",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#003366",
                          },
                        }}
                      >
                        Vote
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              disabled={selectedCandidate === null}
              onClick={handleConfirmClick}
              sx={{
                backgroundColor: BUTTON_ADD_COLOR,
                "&:hover": {
                  backgroundColor: "#003366",
                },
                px: 4,
                py: 2,
                borderRadius: 2,
              }}
            >
              Confirm Vote
            </Button>
          </Box>
        </Paper>
      </Box>
      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Box display={"flex"} justifyContent={"center"}>
          <img src={VoteIcon} alt="VoteIcon" height="25%" width="25%" />
        </Box>

        <DialogContent>
          <Box
            p={2}
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Typography
              variant="caption"
              fontSize={"14px"}
              textAlign={"center"}
            >
              Are you sure you want to confirm your vote for{" "}
              <strong>{selectedCandidateData?.name}</strong>?
            </Typography>
            <Typography
              variant="caption"
              fontSize={"13px"}
              textAlign={"center"}
            >
              This process cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            size="small"
            color="success"
            variant="outlined"
            onClick={handleDialogClose}
          >
            No
          </Button>

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              // Final vote action here (API call, navigation, etc.)
              handleDialogClose();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LocalElectionScanPage;
