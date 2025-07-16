import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Button, 
  Carousel, 
  CarouselItem, 
  CarouselControl, 
  CarouselIndicators, 
  Card,
  Row,
  Col
} from 'reactstrap';
import '../../shared/styles/home.scss';

const importImages = () => {
  const images = [];
  for (let i = 1; i <= 6; i++) {
    images.push(require(`../../shared/image/pelu${i}.png`));
  }
  return images;
};

const HomeComponent = () => {
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated || false);
  const userData = useSelector(state => state.auth?.user || null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const images = importImages();
  const iconImage = require('../../shared/image/icono.png');

  const carouselItems = images.map((src, index) => ({
    src,
    altText: `Servicio de peluquería ${index + 1}`,
    caption: ''
  }));

  const handleNavigation = (path) => () => navigate(path);
  
  const handleNext = () => updateIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  const handlePrevious = () => updateIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  const handleGoToIndex = (newIndex) => updateIndex(newIndex);
  const updateIndex = (newIndex) => !animating && setActiveIndex(newIndex);

  const renderCarouselItem = (item) => (
    <CarouselItem
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key={item.src}
    >
      <img src={item.src} alt={item.altText} className="carousel-image" />
    </CarouselItem>
  );
console.log("user = ",userData);
  return (
    <div className="home-page">
      <Container className="content-container">
        <div className="header-section">
          <Card className="icon-container">
            <img src={iconImage} alt="Icono Peluquería" className="brand-icon" />
          </Card>
          <h1 className="welcome-title">
            {isAuthenticated && userData?.usuario 
              ? `Bienvenido, ${userData.usuario.split(' ')[0]} a Peluquería DB`
              : 'Bienvenido a Peluquería DB'}
          </h1>
        </div>

        {!isAuthenticated ? (
          <>
            <div className="carousel-section">
              <Carousel
                activeIndex={activeIndex}
                next={handleNext}
                previous={handlePrevious}
                interval={1500}
              >
                <CarouselIndicators 
                  items={carouselItems} 
                  activeIndex={activeIndex} 
                  onClickHandler={handleGoToIndex} 
                />
                {carouselItems.map(renderCarouselItem)}
                <CarouselControl 
                  direction="prev" 
                  directionText="Anterior" 
                  onClickHandler={handlePrevious} 
                />
                <CarouselControl 
                  direction="next" 
                  directionText="Siguiente" 
                  onClickHandler={handleNext} 
                />
              </Carousel>
            </div>

            <div className="action-buttons">
              <Button
                className="login-btn"
                color="primary"
                onClick={handleNavigation('/login')}
              >
                Iniciar Sesión
              </Button>
              <Button
                className="register-btn"
                color="success"
                onClick={handleNavigation('/register')}
              >
                Registrarse
              </Button>
            </div>
          </>
        ) : (
          <div className="authenticated-actions">
            <Row className="justify-content-center">
              <Col md={5} className="mb-4">
                <Button
                  className="action-button"
                  color="primary"
                  onClick={handleNavigation('/servicios')}
                  style={{
                    height: '150px',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                  block
                >
                  Servicios
                </Button>
              </Col>
              <Col md={5} className="mb-4">
                <Button
                  className="action-button"
                  color="success"
                  onClick={handleNavigation('/turnos')}
                  style={{
                    height: '150px',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                  block
                >
                  Turnos
                </Button>
              </Col>
            </Row>
            
            <Row className="justify-content-center mt-3">
              <Col md={5} className="mb-4">
                <Button
                  className="action-button"
                  color="info"
                  onClick={handleNavigation('/mis-turnos')}
                  style={{
                    height: '150px',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                  block
                >
                  Mis Turnos
                </Button>
              </Col>
              <Col md={5} className="mb-4">
                <Button
                  className="action-button"
                  color="warning"
                  onClick={handleNavigation('/perfil')}
                  style={{
                    height: '150px',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                  block
                >
                  Mi Perfil
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
};

export default HomeComponent;