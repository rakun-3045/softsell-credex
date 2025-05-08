import { useState } from 'react'
import { Container, Navbar, Nav, Button, Row, Col, Card, Form, Carousel } from 'react-bootstrap'
import { 
  FaUpload, 
  FaMoneyCheckAlt, 
  FaHandshake, 
  FaShieldAlt, 
  FaRocket, 
  FaGlobe, 
  FaDollarSign, 
  FaComments 
} from 'react-icons/fa'
import ChatWidget from './components/ChatWidget'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    licenseType: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    company: '',
    licenseType: '',
    message: ''
  })

  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      valid = false
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
      valid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
      valid = false
    }
    
    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
      valid = false
    }
    
    // License type validation
    if (!formData.licenseType) {
      newErrors.licenseType = 'Please select a license type'
      valid = false
    }
    
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // In a real app, this would submit to a backend
      alert('Form submitted successfully!')
      setFormData({
        name: '',
        email: '',
        company: '',
        licenseType: '',
        message: ''
      })
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.setAttribute('data-bs-theme', !isDarkMode ? 'dark' : 'light')
  }

  // Set initial theme
  document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light')

  // Theme colors for cards
  const cardTheme = {
    bg: isDarkMode ? '#2c3034' : 'white',
    text: isDarkMode ? '#f8f9fa' : '#212529',
    border: isDarkMode ? '#495057' : '#dee2e6',
    shadow: isDarkMode ? '0 5px 15px rgba(0, 0, 0, 0.3)' : '0 5px 15px rgba(0, 0, 0, 0.08)'
  };

  // Theme colors for form inputs
  const inputTheme = {
    bg: isDarkMode ? '#343a40' : 'white',
    text: isDarkMode ? '#f8f9fa' : '#212529',
    border: isDarkMode ? '#495057' : '#ced4da',
    placeholder: isDarkMode ? '#adb5bd' : '#6c757d',
    focus: isDarkMode ? '#0d6efd80' : '#0d6efd40'
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      {/* Navigation */}
      <Navbar expand="lg" className="navbar-custom" fixed="top">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold fs-3">
            <span className="text-primary">Soft</span>Sell
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#how-it-works">How It Works</Nav.Link>
              <Nav.Link href="#why-us">Why Choose Us</Nav.Link>
              <Nav.Link href="#testimonials">Testimonials</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="ms-2" 
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">Unlock the Value of Your Unused Software</h1>
              <p className="lead mb-4">
                SoftSell is the premier marketplace for buying and selling unused software licenses. 
                Turn your idle software assets into cash with our secure platform.
              </p>
              <div className="d-flex gap-3">
                <Button variant="light" size="lg" className="rounded-pill fw-bold px-4">
                  Sell My Licenses
                </Button>
                <Button variant="outline-light" size="lg" className="rounded-pill fw-bold px-4">
                  Get a Quote
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <Carousel 
                className="shadow-lg rounded-4 overflow-hidden" 
                indicators={true}
                interval={5000}
                controls={true}
                ride="carousel"
              >
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="./img1.jpeg"
                    alt="Software Marketplace"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="./img2.jpeg"
                    alt="Software Marketplace"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="./img3.jpeg"
                    alt="Software Marketplace"
                  />
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">How It Works</h2>
            <p className="lead">Our simple three-step process makes selling software licenses easy and secure.</p>
          </div>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="icon-box">
                <div className="icon mb-4">
                  <FaUpload size={60} />
                </div>
                <h3>1. Upload License</h3>
                <p>
                  Upload your unused software license information through our secure portal.
                  We support all major software vendors and license types.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="icon-box">
                <div className="icon mb-4">
                  <FaMoneyCheckAlt size={60} />
                </div>
                <h3>2. Get Valuation</h3>
                <p>
                  Our expert team analyzes your license and provides a fair market valuation
                  based on current demand and pricing trends.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="icon-box">
                <div className="icon mb-4">
                  <FaHandshake size={60} />
                </div>
                <h3>3. Get Paid</h3>
                <p>
                  Once you accept our offer, we handle the transfer process and you receive
                  payment through your preferred method within 3 business days.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="section">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Why Choose SoftSell</h2>
            <p className="lead">We're revolutionizing how businesses manage their software assets.</p>
          </div>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: cardTheme.bg, color: cardTheme.text, borderColor: cardTheme.border, boxShadow: cardTheme.shadow }}>
                <Card.Body className="text-center p-4">
                  <div className="icon mb-3">
                    <FaShieldAlt size={40} className="text-primary" />
                  </div>
                  <Card.Title as="h4">Secure & Compliant</Card.Title>
                  <Card.Text>
                    All transactions are verified and compliant with licensing regulations and vendor policies.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: cardTheme.bg, color: cardTheme.text, borderColor: cardTheme.border, boxShadow: cardTheme.shadow }}>
                <Card.Body className="text-center p-4">
                  <div className="icon mb-3">
                    <FaRocket size={40} className="text-primary" />
                  </div>
                  <Card.Title as="h4">Fast Processing</Card.Title>
                  <Card.Text>
                    Get valuations within 24 hours and payment processed within 3 business days.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: cardTheme.bg, color: cardTheme.text, borderColor: cardTheme.border, boxShadow: cardTheme.shadow }}>
                <Card.Body className="text-center p-4">
                  <div className="icon mb-3">
                    <FaGlobe size={40} className="text-primary" />
                  </div>
                  <Card.Title as="h4">Global Network</Card.Title>
                  <Card.Text>
                    Access to thousands of buyers worldwide ensures maximum value for your licenses.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: cardTheme.bg, color: cardTheme.text, borderColor: cardTheme.border, boxShadow: cardTheme.shadow }}>
                <Card.Body className="text-center p-4">
                  <div className="icon mb-3">
                    <FaDollarSign size={40} className="text-primary" />
                  </div>
                  <Card.Title as="h4">Best Rates</Card.Title>
                  <Card.Text>
                    Our pricing algorithm ensures you get the highest possible value for your software licenses.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Customer Success Stories</h2>
            <p className="lead">Don't just take our word for it - hear from our satisfied customers.</p>
          </div>
          <Row>
            <Col lg={6} className="mb-4">
              <div className="testimonial-card" style={{ 
                backgroundColor: cardTheme.bg, 
                color: cardTheme.text,
                boxShadow: cardTheme.shadow,
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div className="d-flex align-items-center mb-4">
                  <img 
                    src="https://placehold.co/100?text=JS" 
                    alt="Jane Smith" 
                    className="rounded-circle me-3" 
                    width="60" 
                    height="60" 
                  />
                  <div>
                    <h4 className="mb-0">Jane Smith</h4>
                    <p className={`${isDarkMode ? 'text-light' : 'text-muted'} mb-0 opacity-75`}>IT Director, Acme Corp</p>
                  </div>
                </div>
                <p className="mb-0">
                  "SoftSell helped us recover over $85,000 from unused enterprise software licenses. 
                  The process was smooth and their team was professional throughout. I highly recommend 
                  their services to any company looking to optimize their software assets."
                </p>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="testimonial-card" style={{ 
                backgroundColor: cardTheme.bg, 
                color: cardTheme.text,
                boxShadow: cardTheme.shadow,
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div className="d-flex align-items-center mb-4">
                  <img 
                    src="https://placehold.co/100?text=MD" 
                    alt="Michael Davis" 
                    className="rounded-circle me-3" 
                    width="60" 
                    height="60" 
                  />
                  <div>
                    <h4 className="mb-0">Michael Davis</h4>
                    <p className={`${isDarkMode ? 'text-light' : 'text-muted'} mb-0 opacity-75`}>CFO, TechInnovate</p>
                  </div>
                </div>
                <p className="mb-0">
                  "As a fast-growing startup, we needed to be smart with our budget. SoftSell allowed 
                  us to purchase legitimate software licenses at a fraction of the retail cost. Their 
                  verification process gave us peace of mind that everything was above board."
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section / Lead Form */}
      <section id="contact" className="section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Get Started Today</h2>
                <p className="lead">Fill out the form below for a free valuation of your software licenses.</p>
              </div>
              <Card className="border-0 shadow" style={{ 
                backgroundColor: cardTheme.bg, 
                color: cardTheme.text,
                boxShadow: cardTheme.shadow
              }}>
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            placeholder="Your full name" 
                            isInvalid={!!errors.name}
                            style={{
                              backgroundColor: inputTheme.bg,
                              color: inputTheme.text,
                              borderColor: inputTheme.border
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            placeholder="Your email address" 
                            isInvalid={!!errors.email}
                            style={{
                              backgroundColor: inputTheme.bg,
                              color: inputTheme.text,
                              borderColor: inputTheme.border
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Company <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="company" 
                            value={formData.company} 
                            onChange={handleInputChange} 
                            placeholder="Your company name" 
                            isInvalid={!!errors.company}
                            style={{
                              backgroundColor: inputTheme.bg,
                              color: inputTheme.text,
                              borderColor: inputTheme.border
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.company}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>License Type <span className="text-danger">*</span></Form.Label>
                          <Form.Select 
                            name="licenseType" 
                            value={formData.licenseType} 
                            onChange={handleInputChange} 
                            isInvalid={!!errors.licenseType}
                            style={{
                              backgroundColor: inputTheme.bg,
                              color: inputTheme.text,
                              borderColor: inputTheme.border
                            }}
                          >
                            <option value="">Select license type</option>
                            <option value="enterprise">Enterprise Software</option>
                            <option value="productivity">Productivity Suite</option>
                            <option value="design">Design & Creative</option>
                            <option value="development">Development Tools</option>
                            <option value="security">Security & Infrastructure</option>
                            <option value="other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.licenseType}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        placeholder="Tell us more about your licenses" 
                        style={{
                          backgroundColor: inputTheme.bg,
                          color: inputTheme.text,
                          borderColor: inputTheme.border
                        }}
                      />
                    </Form.Group>
                    <div className="text-center mt-4">
                      <Button type="submit" variant="primary" size="lg" className="rounded-pill px-5">
                        Submit Request
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-5">
        <Container>
          <Row>
            <Col md={6} className="text-center text-md-start">
              <h3 className="mb-3">
                <span className="text-primary">Soft</span>Sell
              </h3>
              <p>The premier marketplace for software license resale.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p>&copy; {new Date().getFullYear()} SoftSell. All rights reserved.</p>
              <div>
                <a href="#" className="text-light me-3">Privacy Policy</a>
                <a href="#" className="text-light me-3">Terms of Service</a>
                <a href="#" className="text-light">Contact Us</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Chat Widget */}
      <ChatWidget isDarkMode={isDarkMode} />
    </div>
  )
}

export default App
