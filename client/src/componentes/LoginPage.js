import React, { useState } from "react";
import styles from "./../css/LoginPage.module.css";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);

  const handleTutorClick = () => {
    setIsActive(true);
  };

  const handleAlumnoClick = () => {
    setIsActive(false);
  };

  return (
    <div className={`${styles.loginBody}`}>
      <div className={`${styles.loginContainer} ${isActive ? styles.active : ""}`}>
        
        <div className={`${styles.loginFormContainerTutor} ${styles["form-container"]}`}>
          <form>
            <h1>Tutores</h1>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Olvide mi contraseña</a>
            <button type="button">Ingresar</button>
          </form>
        </div>

        
        <div className={`${styles.loginFormContainerAlumno} ${styles["form-container"]}`}>
          <form>
            <h1>Alumnos</h1>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Olvide mi contraseña</a>
            <button type="button">Ingresar</button>
          </form>
        </div>

        {/* Panel de alternancia */}
        <div className={styles.loginToggleContainer}>
          <div className={styles.loginToggle}>
            <div className={styles.loginTogglePanelLeft}>
              <h1>Bienvenido, Tutor</h1>
              <p>Ingresa mediante tu correo</p>
              <button
                className={styles.loginHidden}
                type="button"
                onClick={handleAlumnoClick}
              >
                Alumno
              </button>
            </div>
            <div className={styles.loginTogglePanelRight}>
              <h1>Hola, Alumno</h1>
              <p>Ingresa con tu correo institucional</p>
              <button
                className={styles.loginHidden}
                type="button"
                onClick={handleTutorClick}
              >
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