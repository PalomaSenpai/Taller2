import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTutorLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:5000/api/auth/tutor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        login('tutor');
        navigate('/tutor-dashboard'); // Redirigir a /tutor-dashboard para tutores
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error en el login de tutor');
      }
    } catch (error) {
      console.error('Error en el login de tutor:', error);
      alert('Error en el login de tutor. Asegúrate de que el servidor esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlumnoLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:5000/api/auth/alumno/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        login('alumno');
        navigate('/'); // Redirigir a / para alumnos
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error en el login de alumno');
      }
    } catch (error) {
      console.error('Error en el login de alumno:', error);
      alert('Error en el login de alumno. Asegúrate de que el servidor esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutorClick = () => {
    setIsActive(true);
    console.log('Tutor clicked, isActive:', true);
  };

  const handleAlumnoClick = () => {
    setIsActive(false);
    console.log('Alumno clicked, isActive:', false);
  };

  console.log('Current isActive state:', isActive);

  return (
    <div className={`${styles.loginBody}`}>
      <div className={`${styles.loginContainer} ${isActive ? styles.active : ''}`}>
        {/* Botones de selección en la parte superior (solo visibles en móviles) */}
        <div className={styles.loginToggleButtons}>
          <button
            type="button"
            className={`${styles.toggleButton} ${!isActive ? styles.activeButton : ''}`}
            onClick={handleAlumnoClick}
          >
            Alumno
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${isActive ? styles.activeButton : ''}`}
            onClick={handleTutorClick}
          >
            Tutor
          </button>
        </div>

        {/* Formulario de Tutores */}
        <div className={`${styles.loginFormContainerTutor} ${styles["form-container"]}`}>
          <form onSubmit={handleTutorLogin}>
            <h1>Tutores</h1>
            <p>Ingresa mediante tu correo</p>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <a href="#">Olvide mi contraseña</a>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Formulario de Alumnos */}
        <div className={`${styles.loginFormContainerAlumno} ${styles["form-container"]}`}>
          <form onSubmit={handleAlumnoLogin}>
            <h1>Alumnos</h1>
            <p>Ingresa con tu correo institucional</p>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <a href="#">Olvide mi contraseña</a>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Toggle para pantallas grandes */}
        <div className={styles.loginToggleContainer}>
          <div className={styles.loginToggle}>
            <div className={styles.loginTogglePanelLeft}>
              <h1>Bienvenido, Tutor</h1>
              <p>Ingresa mediante tu correo</p>
              <button className={styles.loginHidden} type="button" onClick={handleAlumnoClick}>
                Alumno
              </button>
            </div>
            <div className={styles.loginTogglePanelRight}>
              <h1>Hola, Alumno</h1>
              <p>Ingresa con tu correo institucional</p>
              <button className={styles.loginHidden} type="button" onClick={handleTutorClick}>
                Tutor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;