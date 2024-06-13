function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const getCsrfTokenFromServer = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/auth/csrf/`, {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

const csrftoken = getCookie('csrftoken');

export default csrftoken;
