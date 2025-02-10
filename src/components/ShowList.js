import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import DefaultPagination from "./DefaultPagination";
import ShowSearch from "./ShowSearch";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = process.env.REACT_APP_BASE_URL;
const PLACEHOLDER_IMAGE = "https://dummyimage.com/260x200/cccccc/555555.png";

const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTvShows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = searchQuery ? "/search/movie" : "/discover/movie";
      const { data } = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          api_key: API_KEY,
          page: currentPage,
          language: "vi",
          with_original_language: originalLanguage || "",
          query: searchQuery || "",
        },
      });
      setShows(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(`Lỗi tải dữ liệu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, originalLanguage, searchQuery]);

  useEffect(() => {
    fetchTvShows();
  }, [fetchTvShows]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">
        <FontAwesomeIcon icon={faFilm} className="me-2" />
        Phim lẻ
      </h2>
      <ShowSearch
        onSearch={handleSearch}
        onReset={handleReset}
        originalLanguage={originalLanguage}
      />

      <Form.Group className="mb-3">
        <Form.Label>Chọn ngôn ngữ gốc</Form.Label>
        <Form.Select
          value={originalLanguage}
          onChange={(e) => {
            setOriginalLanguage(e.target.value);
            setSearchQuery("");
          }}
        >
          <option value="">Tất cả</option>
          <option value="vi">Tiếng Việt</option>
          <option value="zh">Tiếng Trung</option>
          <option value="en">Tiếng Anh</option>
          <option value="ja">Tiếng Nhật</option>
          <option value="ko">Tiếng Hàn</option>
          <option value="th">Tiếng Thái</option>
        </Form.Select>
      </Form.Group>

      {loading ? (
        <Spinner animation="border" className="d-block mx-auto mt-4" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {shows.map((show) => (
            <Col key={show.id} lg={3} md={4} sm={6} className="mb-4">
              <Card className="h-100 rounded shadow-lg">
                <Card.Img
                  variant="top"
                  src={
                    show.poster_path
                      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                      : PLACEHOLDER_IMAGE
                  }
                  alt={show.title}
                  className="rounded-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{show.title}</Card.Title>
                  <Card.Text>
                    {show.overview
                      ? `${show.overview.substring(0, 100)}...`
                      : "Không có mô tả."}
                  </Card.Text>
                  <Link
                    to={`/phim/${show.id}`}
                    className="mt-auto d-flex justify-content-start text-decoration-none"
                  >
                    <Button variant="primary">
                      <FontAwesomeIcon icon={faFilm} className="me-2" /> Xem
                      Phim
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <DefaultPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
};

export default ShowList;
