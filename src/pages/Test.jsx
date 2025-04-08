import React,  {useState} from 'react'
import FormDepartment from '@/components/form/Form'
import { Form, Input, Table, Button, Modal  } from 'antd';
import PageHeader from '../components/PageHeader';
import ModalTest from '../components/modal/ModalTest';
const Test = () => {
  
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <div>
      <ModalTest>2</ModalTest>
      <Table dataSource={dataSource} columns={columns} />

        
    
    </div>
  )
}

export default Test