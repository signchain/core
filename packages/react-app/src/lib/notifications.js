export const sendMail = async (recipients, data) => {
    console.log(recipients, data)
    const url = process.env.REACT_APP_API_SERVER_URL + '/email/send'
    const response =  await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({recipients: recipients, data: data}) // body data type must match "Content-Type" header
    });
    return response;
  }
  