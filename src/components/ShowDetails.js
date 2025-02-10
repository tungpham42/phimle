import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Image,
  ListGroup,
} from "react-bootstrap";

const API_KEY = "fecb69b9d0ad64dbe0802939fafc338d"; // Replace with your TMDB API Key
const BASE_URL = "https://api.themoviedb.org/3";
const STREAM_BASE_URL = "https://hoc.cotuong.top/se_player.php";

const ShowDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovieDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${id}`, {
        params: { api_key: API_KEY, language: "vi" },
      });
      setMovie(response.data);
    } catch (error) {
      setError("Error fetching movie details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!movie) return null;

  return (
    <Container className="mt-4 col-md-8">
      <h2 className="mb-3">{movie.title}</h2>
      <p>{movie.overview || "No description available."}</p>
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        fluid
        rounded
        className="mb-3"
      />

      <h4 className="mt-4">Thông Tin Phim</h4>
      <ListGroup className="mb-3">
        <ListGroup.Item>
          <strong>Ngày phát hành:</strong> {movie.release_date}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Thời lượng:</strong> {movie.runtime} phút
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Điểm đánh giá:</strong> {movie.vote_average} / 10
        </ListGroup.Item>
      </ListGroup>

      <div className="mb-4">
        <h4>Xem Phim</h4>
        <iframe
          src={`${STREAM_BASE_URL}?video_id=${id}&tmdb=1`}
          width="100%"
          height="500px"
          allowFullScreen
          title={movie.title}
        ></iframe>
      </div>

      <Link to="/">
        <Button variant="secondary" className="mb-5">
          Quay về trang chủ
        </Button>
      </Link>
    </Container>
  );
};

export default ShowDetails;
