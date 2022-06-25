import { Button, Col, Divider, Input, InputNumber, Radio, Row, Space } from 'antd'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import axios from 'axios';
import styles from '../styles/Home.module.css'
import errorHandler from '../utils/errorHandler'

const productName = 'Apple IPhone';
const productPhoto = '/iphone.png';
const price = 29550000;
const shipping = 10000;

const Home: NextPage = () => {
  const [quantity, setQuantity] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('zalopay');
  const [userName, setUserName] = useState('');
  const [address, setAddress] = useState('');

  const onCheckOut = () => {
    axios.post('/api/order', {
      paymentMethod,
      userName,
      items: [{
        name: productName,
        photo: productPhoto,
        quantity,
        price
      }]
    }).then(value => {
      window.open(value.data.payUrl, "_blank");
    })
      .catch(error => errorHandler(error))
  }

  return (
    <div>
      <Head>
        <title>EC04-01 Payment Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row className='min-h-screen lg:mx-80 lg:my-8 border rounded shadow divide-y md:divide-y-0 md:divide-x'>
        <Col sm={24} md={16} className='divide-y'>
          <div className='p-3 flex justify-start items-center'>
            <div className='inline-block mr-2'>
              <Image src={productPhoto} alt={productName} width={200} height={200} />
            </div>
            <Space direction='vertical'>
              <h2 className='text-2xl'>{productName}</h2>
              <h3 className='text-lg  font-semibold'>{price.toLocaleString()} ₫</h3>
              <Space size={0}>
                <Button type='primary' onClick={() => setQuantity(Math.max(0, quantity - 1))}>-</Button>
                <InputNumber value={quantity} min={0} onChange={(value) => setQuantity(value)} />
                <Button type='primary' onClick={() => setQuantity(quantity + 1)}>+</Button>
              </Space>
            </Space>
          </div>
          <Space className='p-4 w-full' direction='vertical'>
            <h4 className='text-xl'>Chọn hình thức thanh toán</h4>
            <Radio.Group value={paymentMethod} size='large' onChange={event => setPaymentMethod(event.target.value)}>
              <Space direction="vertical">
                <Radio value={'zalopay'} style={{ alignItems: 'center' }}>
                  <Space>
                    <Image src='/icon-payment-method-zalo-pay.svg' height={30} width={30} />
                    Thanh toán bằng ví ZaloPay
                  </Space>
                </Radio>
                <Radio value={'vnpay'} style={{ alignItems: 'center' }}>
                  <Space>
                    <Image src='/icon-payment-method-vnpay.png' height={30} width={30} />
                    Thanh toán bằng VNPAY
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Space>

          <Space className='p-4 w-full' direction='vertical'>
            <h4 className='text-xl'>Thông tin người dùng</h4>
            <Input value={userName} placeholder='Tên người dùng' onChange={(event) => setUserName(event.target.value)} />
            <Input value={address} placeholder='Địa chỉ' onChange={(event) => setAddress(event.target.value)} />
          </Space>
        </Col>
        <Col className='p-4' sm={24} md={8}>
          <Space direction='vertical' className='w-full'>
            <Space direction='vertical' size={2}>
              <h4 className='text-xl'>Thông tin người dùng</h4>
              <p className='leading-3 text-gray-700 font-semibold'>{userName}</p>
              <p className='leading-3 text-gray-500'>{address}</p>
            </Space>
            <Space direction='vertical' className='w-full'>
              <h4 className='text-xl'>Mã giảm giá</h4>
              <Input />
            </Space>
            <Space direction='vertical' className='w-full' size={2}>
              <h4 className='text-xl'>Giá trị đơn hàng</h4>
              <div className='flex justify-between '>
                <span className='text-gray-500'>Tạm tính</span>
                <span>{(quantity * price).toLocaleString()} ₫</span>
              </div>
              <div className='flex justify-between '>
                <span className='text-gray-500'>Phí vận chuyển</span>
                <span>{shipping.toLocaleString()} ₫</span>
              </div>
            </Space>
          </Space>
          <Divider />
          <Button type='primary' className='w-full mt-2' disabled={!quantity} onClick={onCheckOut}>Đặt hàng</Button>
        </Col>
      </Row>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
