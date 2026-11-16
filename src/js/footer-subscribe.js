import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const EMAIL_PATTERN = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const form = document.querySelector('.footer-subscribe-form');

if (form) {
  const input = form.querySelector('.footer-subscribe-input');
  const button = form.querySelector('.footer-subscribe-btn');

  input.setAttribute('name', 'email');
  input.setAttribute('pattern', EMAIL_PATTERN.source);

  form.addEventListener('submit', onSubmit);

  async function onSubmit(event) {
    event.preventDefault();

    const email = input.value.trim();

    if (!email) {
      showError('Please enter your email.');
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      showError('Please enter a valid email, e.g. test@gmail.com');
      return;
    }

    button.disabled = true;

    try {
      const { data } = await axios.post('/subscription', { email });
      iziToast.success({
        title: 'Success',
        message: data?.message || 'You have successfully subscribed to new exercises!',
        position: 'topRight',
      });
    }
    catch (error) {
      handleError(error);
    }
    finally {
      button.disabled = false;
      form.reset();
    }
  }
}

function handleError(error) {
  // Немає відповіді від сервера - проблема з мережею
  if (!error.response) {
    showError('Network error. Please check your connection and try again.');
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      showError(data?.message || 'Invalid email. Please check it and try again.');
      break;
    case 404:
      showError('Service not found. Please try again later.');
      break;
    case 409:
      showError(data?.message || 'This email is already subscribed.', 'warning');
      break;
    default:
      showError('Server error. Please try again later.');
  }
}

function showError(message, type = 'error') {
  iziToast[type]({
    title: type === 'warning' ? 'Warning' : 'Error',
    message,
    position: 'topRight',
  });
}