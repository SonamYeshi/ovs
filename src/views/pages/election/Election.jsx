// material-ui
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// project imports
import VoteIcon from "assets/images/VoteIcon.png";

import MainCard from "ui-component/cards/MainCard";

const Election = () => {
  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: "10px" }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            sx={{
              height: 200, // optional fixed height
              transition: "box-shadow 0.5s",
              "&:hover": { boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
            }}
          >
            <Box
              component={Link}
              href="/nationalAssemblyElectionScanPage"
              sx={{ textDecoration: "none" }}
              display={"flex"}
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <img src={VoteIcon} alt="VoteIcon" height="20%" width="20%" />
              <Typography
                variant="body1"
                sx={{
                  fontSize: {
                    xs: "13px",
                    sm: "10px",
                    md: "17px",
                    lg: "15px",
                    xl: "1rem",
                  },
                  color: "#000000",
                }}
              >
                National Assembly Elections
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            sx={{
              height: 200,
              transition: "box-shadow 0.5s",
              "&:hover": { boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
            }}
          >
            <Box
              component={Link}
              href="/nationalCouncilElectionScanPage"
              sx={{ textDecoration: "none" }}
              display={"flex"}
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <img src={VoteIcon} alt="VoteIcon" height="20%" width="20%" />
              <Typography
                variant="body1"
                sx={{
                  fontSize: {
                    xs: "13px",
                    sm: "10px",
                    md: "17px",
                    lg: "15px",
                    xl: "1rem",
                  },
                  color: "#000000",
                }}
              >
                National Council Elections
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            sx={{
              height: 200,
              transition: "box-shadow 0.5s",
              "&:hover": { boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
            }}
          >
            <Box
              component={Link}
              href="/localElectionScanPage"
              sx={{ textDecoration: "none" }}
              display={"flex"}
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <img src={VoteIcon} alt="VoteIcon" height="20%" width="20%" />
              <Typography
                variant="body1"
                sx={{
                  fontSize: {
                    xs: "13px",
                    sm: "10px",
                    md: "17px",
                    lg: "15px",
                    xl: "1rem",
                  },
                  color: "#000000",
                }}
              >
                Local Government Elections
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            sx={{
              height: 200,
              transition: "box-shadow 0.5s",
              "&:hover": { boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
            }}
          >
            <Box
              component={Link}
              href="/byeElectionScanPage"
              sx={{ textDecoration: "none" }}
              display={"flex"}
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <img src={VoteIcon} alt="VoteIcon" height="20%" width="20%" />
              <Typography
                variant="body1"
                sx={{
                  fontSize: {
                    xs: "13px",
                    sm: "10px",
                    md: "17px",
                    lg: "15px",
                    xl: "1rem",
                  },
                  color: "#000000",
                }}
              >
                Bye-Elections
              </Typography>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export default Election;
