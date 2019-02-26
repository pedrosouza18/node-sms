const numberInput = document.getElementById('number'),
      textInput = document.getElementById('message'),
      button = document.getElementById('button');

const socket = io();
socket.on('smsStatus', (data) => {
  console.log(data);
});

const send = () => {
  const number = numberInput.value.replace(/\D/g, '');
  const text = textInput.value;
  console.log('chamou');
  
  fetch('/send-sms', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      number,
      text
    })
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => console.log(error));
};

button.addEventListener('click', send);