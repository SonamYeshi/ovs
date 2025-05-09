import { React } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import { TITLE } from "common/color";

// Simulated vote counts
const candidates = [
  {
    id: 1,
    name: "Dorji Gyeltshen",
    image: "https://via.placeholder.com/80x100",
    votes: 65,
  },
  {
    id: 2,
    name: "Sonam Penjor",
    image: "https://via.placeholder.com/80x100",
    votes: 78,
  },
  {
    id: 3,
    name: "Dorji Gyeltshen",
    image: "https://via.placeholder.com/80x100",
    votes: 57,
  },
];

const LocalElectionResult = () => {
  return (
    <>
      <Box mt={4}>
        <Typography
          variant="h2"
          align="center"
          fontWeight="bold"
          sx={{ color: TITLE, mb: 2 }}
        >
          Local Government Election Result
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
          sx={{ borderRadius: 4, p: 3, width: "90%", maxWidth: 800 }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#003366" }}
                  >
                    Sl.No
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#003366" }}>
                    Candidate
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#003366" }}
                  >
                    Vote Count
                  </TableCell>
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
                    <TableCell align="center">{candidate.votes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default LocalElectionResult;
