import { useEffect, React, useState } from "react";
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent
} from "@mui/material";

import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { TITLE, BUTTON_ADD_COLOR } from "common/color";
import Breadcrumbs from "ui-component/extended/Breadcrumbs";
import VoteIcon from "assets/images/VoteIcon.png";

import voteService from "services/vote.service";

// const candidates = [
//   {
//     id: 1,
//     name: "Dorji Gyeltshen",
//     image: "https://via.placeholder.com/80x100",
//   },
//   {
//     id: 2,
//     name: "Sonam Penjor",
//     image: "https://via.placeholder.com/80x100",
//   },
//   {
//     id: 3,
//     name: "Dorji Gyeltshen",
//     image: "https://via.placeholder.com/80x100",
//   },
// ];

const LocalElectionScanPage = () => {
  const location = useLocation();
  console.log('Location State:', location.state);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [dialogState, setDialogState] = useState({
    open: false,
    type: '', // e.g., "vote", "confirm", etc.
    title: '',
    message: '',
    confirmAction: null,
  });

  const { voterCid } = location.state || {};

  useEffect(() => {
    const electionTypeId = 1;

    voteService.getCandidates(electionTypeId)
      .then((response) => {
        setCandidates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
        setDialogState({
          open: true,
          type: "result",
          title: "Error",
          message: "Unable to fetch candidates. Please try again later.",
          confirmAction: null,
        });
      });
  }, []);

  // const submitVote = () => {
  //   if (!selectedCandidateData) return;

  //   const payload = {
  //     voterName: "Voter Name",
  //     voterCid: voterCid,
  //     candidateId: selectedCandidateData.id,
  //     electionTypeId: 1,
  //     isVoted: true,
  //     voteTxnHash: "vote-txn-hash",

  //   };

  //   voteService
  //     .saveVote(payload)
  //     .then((res) => {
  //       console.log("Vote submitted successfully", res.data);
  //       // Optional: show success
  //     })
  //     .catch((err) => {
  //       console.error("Error submitting vote", err);
  //     })
  //     .finally(() => {
  //       handleDialogClose();
  //     });
  // };

  const handleConfirmClick = () => {
    setDialogOpen(true);
  };

  // const handleDialogClose = () => {
  //   setDialogOpen(false);
  // };

  const selectedCandidateData = candidates.find(
    (c) => c.id === selectedCandidate
  );

  const handleVoteClick = (candidateId) => {
    setSelectedCandidate(candidateId);

    const candidate = candidates.find(c => c.id === candidateId);

    setDialogState({
      open: true,
      type: "confirm",
      title: "Confirmation",
      message: (
        <>
          Are you sure you want to confirm your vote for{" "}
          <strong>{candidate.candidateName}</strong>? This process cannot be undone.
        </>
      ),
      // message: `Are you sure you want to confirm your vote for <strong>${candidate.candidateName}</strong>? This process cannot be undone.`,
      confirmAction: () => submitVote(candidate),
    });
  };

  const submitVote = (candidate) => {
    const payload = {
      voterName: "Voter Name",
      voterCid: voterCid,
      candidateId: candidate.id,
      electionTypeId: 1,
      isVoted: true,
      voteTxnHash: "vote-txn-hash",
    };

    voteService.saveVote(payload)
      .then((res) => {
        console.log("Vote submitted successfully", res.data);
        setDialogState({
          open: true,
          type: "result",
          title: "Success",
          message: res.data,
          confirmAction: null,
        });
      })
      .catch((err) => {
        console.error("Error submitting vote", err);
        setDialogState({
          open: true,
          type: "result",
          title: "Error",
          message: err.response.data,
          confirmAction: null,
        });
      });
  };

  const handleDialogClose = () => {
    setDialogState(prev => ({ ...prev, open: false }));
  };

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
                    <TableCell>{candidate.candidateName}</TableCell>
                    <TableCell align="center">
                      <Avatar
                        src={"https://via.placeholder.com/80x100"}
                        alt={candidate.candidateName}
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
                        onClick={() => handleVoteClick(candidate.id)}
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

          {/* <Box textAlign="center" mt={4}>
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
          </Box> */}
        </Paper>
      </Box>
      {/* Dialog */}
      <Dialog open={dialogState.open} onClose={handleDialogClose}>
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
              {dialogState.title}
            </Typography>
            <Typography
              variant="caption"
              fontSize={"13px"}
              textAlign={"center"}
            >
              {dialogState.message}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={handleDialogClose}
          >
            {dialogState.type === "confirm" ? "No" : "Close"}
          </Button>

          {dialogState.type === "confirm" && (
            <Button
              size="small"
              color="success"
              variant="outlined"
              onClick={() => {
                handleDialogClose();
                dialogState.confirmAction && dialogState.confirmAction();
              }}
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LocalElectionScanPage;
