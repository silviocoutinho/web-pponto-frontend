import axios from 'axios';
import toArray from 'lodash/toArray';
import { setMessage } from './MessageNotification';
//startDate="2021-05-05"&endDate="2021-05-06"
const {
  REACT_APP_PORT_API,
  REACT_APP_URL_API,
  REACT_APP_VERSION_API,
  REACT_APP_ENV,
} = process.env;

const RESOURCE = 'certificados';
const MAIN_ROUTE = `${REACT_APP_VERSION_API}/${RESOURCE}`;
const envURL = REACT_APP_ENV === 'test' ? '' : 'http://';

const apiURL = `${envURL}${REACT_APP_URL_API}:${REACT_APP_PORT_API}/${MAIN_ROUTE}`;

console.log('URL: ', apiURL)

axios.defaults.baseURL = apiURL;

const getDataFromAPI = (  
  setTypeOfErrorMessage,
  setErrorMessage,
  setDataTableCeritificates,
) => {
  const token = localStorage.getItem('token');

  const configHeadersAPI = {
    Authorization: 'Bearer ' + token,
  };
  try {
    axios
      .get(apiURL, {       
        headers: configHeadersAPI,
      })
      .then(res => {
        if (res.data.length === 0) {
          setMessage(
            setTypeOfErrorMessage,
            setErrorMessage,
            'warning',
            'Não existem informações sobre Certificados Protocolados!',
          );
          setDataTableCeritificates(null);
          return;
        }
        const arrayDataToTimeCard = toArray(res.data);
        setDataTableCeritificates(arrayDataToTimeCard);
        setMessage(setTypeOfErrorMessage, setErrorMessage, 'warning', null);
      })
      .catch(err => {
        setDataTableCeritificates(null);
        if (!err.response) {
          setMessage(
            setTypeOfErrorMessage,
            setErrorMessage,
            'danger',
            'O Servidor está indisponível, contate o Setor de TI!',
          );
        } else if (err.response.status === 400) {
          const code = err.response.status;
          const response = err.response.data.error;
          setMessage(
            setTypeOfErrorMessage,
            setErrorMessage,
            'danger',
            `${response}.`,
          );
        } else {
          const code = err.response.status;
          const response = err.response.data;
          setMessage(
            setTypeOfErrorMessage,
            setErrorMessage,
            'danger',
            `Estamos com problemas no Servidor. Mensagem: ${response}. Código: ${code}`,
          );
        }
      });
  } catch (error) {
    console.log('Backend is offline!');
  }
};

export { getDataFromAPI };
