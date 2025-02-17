import React, { useEffect, useState } from 'react';
import Navbar from '../component/Navbar';
import Header from '../component/Header';
import { useDispatch, useSelector } from 'react-redux';
import { jobLoadAction } from '../redux/actions/jobAction';
import { useParams } from 'react-router-dom';
import { Box, Card, Container, Stack, Pagination, Typography, useTheme, MenuList, MenuItem, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CardElement from '../component/CardElement';
import LoadingBox from '../component/LoadingBox';
import SelectComponent from '../component/SelectComponent';
import { jobTypeLoadAction } from '../redux/actions/jobTypeAction';
import Footer from '../component/Footer';

const Home = () => {
  const { jobs,setUniqueLocation, pages, loading } = useSelector((state) => state.loadJobs);
  const theme = useTheme();
  const { palette } = theme;
  const dispatch = useDispatch();
  const { keyword, location } = useParams();

  const [page, setPage] = useState(1);
  const [cat, setCat] = useState('');

  useEffect(() => {
    dispatch(jobLoadAction(page, keyword, cat, location));
  }, [page, keyword, cat, location, dispatch]);

  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, [dispatch]);

  const handleChangeCategory = (e) => {
    setCat(e.target.value);
  };

  
  return (
    <div>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
        <Navbar />
        <Header />
        <Container>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
            <Box sx={{ flex: 2, p: 2 }}>
              <Card sx={{ minWidth: 150, mb: 3, mt: 3, p: 2 }}>
                <Box sx={{ pb: 2 }}>
                  <Typography component="h4" sx={{ color: palette.secondary.main, fontWeight: 600 }}>
                    Filter job by category
                  </Typography>
                </Box>
                <SelectComponent handleChangeCategory={handleChangeCategory} cat={cat} />
              </Card>
              {/* jobs by location */}
              <Card sx={{ minWidth: 150, mb: 3, mt: 3, p: 2 }}>
                <Box sx={{ pb: 2 }}>
                  <Typography component="h4" sx={{ color: palette.secondary.main, fontWeight: 600 }}>
                    Filter job by location
                  </Typography>
                  <MenuList>
                    {setUniqueLocation &&
                      setUniqueLocation.map((location, i) => (
                        <MenuItem key={i}>
                          <ListItemIcon>
                            <LocationOnIcon sx={{ color: palette.secondary.main, fontSize: 18 }} />
                          </ListItemIcon>
                          <Link to={`/search/location/${location}`}>{location}</Link>
                        </MenuItem>
                      ))}
                  </MenuList>
                </Box>
              </Card>
            </Box>
            <Box sx={{ flex: 5, p: 2 }}>
              {loading ? (
                <LoadingBox />
              ) : jobs && jobs.length === 0 ? (
                <Box
                  sx={{
                    minHeight: '350px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <h2>No result found!</h2>
                </Box>
              ) : (
                jobs &&
                jobs.map((job, i) => (
                  <CardElement
                    key={i}
                    id={job._id}
                    description={job.description}
                    category={job.jobType ? job.jobType.jobTypeName : "No category"}
                    location={job.location}
                  />
                ))
              )}
              <Stack spacing={2}>
                <Pagination page={page} count={pages === 0 ? 1 : pages} onChange={(event, value) => setPage(value)} />
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </div>
  );
};

export default Home;
