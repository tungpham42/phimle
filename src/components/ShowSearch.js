import React, { useState, useEffect, useCallback } from "react";
import { Col, Form, FormControl, Button, Spinner, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUndo } from "@fortawesome/free-solid-svg-icons";

const ShowSearch = ({ onSearch, onReset, originalLanguage }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setLoading(true);
      onSearch(query.trim());
      setTimeout(() => setLoading(false), 1500);
    }
  }, [query, onSearch]);

  const handleReset = useCallback(() => {
    setQuery("");
    setLoading(false);
    onReset();
  }, [onReset]);

  useEffect(() => {
    setQuery(""); // Clear search input when originalLanguage changes
  }, [originalLanguage]);

  return (
    <Row className="align-items-center mb-3">
      <Col lg={8} md={7} sm={5}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <FormControl
            type="text"
            placeholder="Điền từ khóa"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form>
      </Col>
      <Col lg={4} md={5} sm={7} className="d-flex">
        <Button
          variant="primary"
          className="me-2"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <FontAwesomeIcon icon={faSearch} className="me-2" />
          )}
          {loading ? "Đang tìm" : "Tìm kiếm"}
        </Button>
        <Button variant="secondary" onClick={handleReset} disabled={loading}>
          <FontAwesomeIcon icon={faUndo} className="me-2" /> Làm mới
        </Button>
      </Col>
    </Row>
  );
};

export default ShowSearch;
