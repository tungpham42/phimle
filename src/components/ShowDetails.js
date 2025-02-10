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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faClock,
  faCalendarAlt,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = process.env.REACT_APP_BASE_URL;
const EMBED_URL = process.env.REACT_APP_EMBED_URL;

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
      <p>{movie.overview || "Không có mô tả."}</p>
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
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          <strong>Ngày phát hành:</strong> {movie.release_date}
        </ListGroup.Item>
        <ListGroup.Item>
          <FontAwesomeIcon icon={faClock} className="me-2" />
          <strong>Thời lượng:</strong> {movie.runtime} phút
        </ListGroup.Item>
        <ListGroup.Item>
          <FontAwesomeIcon icon={faStar} className="me-2 text-warning" />
          <strong>Điểm đánh giá:</strong> {movie.vote_average} / 10
        </ListGroup.Item>
      </ListGroup>

      <div className="mb-4">
        <h4>Xem Phim</h4>
        <iframe
          src={`${EMBED_URL}?video_id=${id}&tmdb=1`}
          width="100%"
          height="500px"
          allowFullScreen
          title={movie.title}
        ></iframe>
      </div>

      <Link to="/">
        <Button variant="secondary" className="mb-5">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Quay về trang chủ
        </Button>
      </Link>
    </Container>
  );
};

export default ShowDetails;
