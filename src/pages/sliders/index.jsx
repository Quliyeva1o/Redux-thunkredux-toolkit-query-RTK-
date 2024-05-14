import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Box, Button, Modal, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetMoviesQuery, useDeleteMovieMutation, usePatchMovieMutation } from '../../services/moviesQuerySlice';

const Sliders = () => {
  const { data: movies, error, isLoading, refetch } = useGetMoviesQuery();
  const [deleteMovie] = useDeleteMovieMutation();
  const [patchMovie] = usePatchMovieMutation();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedMovie, setEditedMovie] = useState({
    title: '',
    posterImg: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id) => {
    await deleteMovie(id).unwrap();
    refetch();
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setEditedMovie(movie);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setEditedMovie({
      title: '',
      posterImg: '',
    });
  };

  const handleEditSubmit = async () => {
    await patchMovie({ id: editedMovie.id, changes: editedMovie }).unwrap();
    refetch();
    handleModalClose();
  };

  return (
    <>
      <Swiper
        style={{ margin: '30px auto', width: '1400px' }}
        slidesPerView={4}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {movies &&
          movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <Box>
                <Button onClick={() => handleDelete(movie.id)}>Delete</Button>
                <Button onClick={() => handleEdit(movie)}>Edit</Button>
                <Button>
                  <Link to={`/movies/${movie.id}`}>Detail</Link>
                </Button>
                <h1>{movie.title}</h1>
                <img style={{ width: '100%', objectFit: 'cover', height: '450px' }} src={movie.posterImg} alt="" />
              </Box>
            </SwiperSlide>
          ))}
      </Swiper>
      <Modal open={isModalOpen} onClose={handleModalClose} >
        <Box >
        <form style={{padding:"30px" ,backgroundColor:"white", width:"500px", display:"flex",flexDirection:"column" ,gap:"30px", margin:"150px auto"} } action="" onSubmit={handleEditSubmit}>
        <TextField
            label="Title"
            value={editedMovie.title}
            onChange={(e) => setEditedMovie({ ...editedMovie, title: e.target.value })}
          />
          <TextField
            label="Poster Image"
            value={editedMovie.posterImg}
            onChange={(e) => setEditedMovie({ ...editedMovie, posterImg: e.target.value })}
          />
            <TextField
            label="releaseYear"
            value={editedMovie.releaseYear}
            onChange={(e) => setEditedMovie({ ...editedMovie, releaseYear: e.target.value })}
          />
            <TextField
            label="genre"
            value={editedMovie.genre}
            onChange={(e) => setEditedMovie({ ...editedMovie, genre: e.target.value })}
          />
          <Button type='submit'>Submit Edit</Button>
        </form>
        </Box>
      </Modal>
    </>
  );
};

export default Sliders;
