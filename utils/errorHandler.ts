import { AxiosError } from 'axios';
import { message } from 'antd';

export default function errorHandler(error: AxiosError) {
  const status = error.response.status;
  switch (status) {
    case 400:
      return message.error(JSON.stringify(error.response.data))

    default:
      return message.error('Có lỗi xảy ra!');
  }

}