import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/Home.module.css'

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();

  if (isLoading) {
    return <div className={styles.text}>Loading...</div>;
  }
  if (error) {
    return <div className={styles.text}>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div className={styles.text}>
        Hello {user.name}{' '}
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      </div>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
}

export default App;