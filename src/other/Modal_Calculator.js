import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import {Button, Col, Row, Container,Form  } from 'react-bootstrap';
import '../App.css';

//modal style
let modal_style = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },

  content: {
    width: "500px",
    height: "250px",
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
    alignitems: "center",
    textalign: "center",
  },
}
 


function Modal_Calculator (props) {
  let money_data  = props.url_data;
  const [modalIsOpen,setModalIsOpen] = useState(false); 
  let Country_name = '';
  let Country_name1 = '';

  //돈 변수 
  let [from_money,setFrom] = useState(0);
  let [to_money,setTo] = useState(0);
  //돈 단위
  let [from_unit,setFromUnit] = useState('');
  let [to_unit,setToUnit] = useState('');
  // 돈 계산용 카운터 
  let [count, setCount] = useState(0);
  let [store_CT ,setStoreCT] = useState('');


    function Exchange_Convert(money_data,Country_name){
        var index = money_data.findIndex(i => i.cur_nm 
          == Country_name);
        //index로 화폐데이터를 원래 배열에서 찾는다.
        //count 는 1이다. 모든 화폐가 1단위로 생각 
        // 입력된 값에다가 원화값을 곱한다. 
        setFromUnit(money_data[index].cur_unit);
        setFrom((money_data[index].deal_bas_r).replace(',',''));
    }

    function Exchange_ReConvert(money_data, Country_name1, from_money, count){
      //해당 국가 화폐 데이터 index를 구한다.
        var index1 = money_data.findIndex(i => i.cur_nm 
          == Country_name1);
        setTo(((count * from_money)/(money_data[index1].deal_bas_r).replace(',','')).toFixed(2));
        setToUnit(money_data[index1].cur_unit);
    }

    //화폐나라 데이터 생성 함수
    function Select_country(data,i) {
      return(
        <option key={i+1}>{data.cur_nm}</option>
      )
    }
    //열기함수
    const openModal = () => {
      setModalIsOpen(true);
    };
    //닫기함수 (환율계산 모달을  닫으면서 화폐데이터도 초기화)
    const closeModal = () => {
      setModalIsOpen(false);
      setFrom(''); 
      setTo('');
      setFromUnit('');
      setToUnit('');
      // 값을 초기화해야함 반드시 
      setStoreCT('');
    };

    //count 값이 달라지면 useEffect 로 값을 재계산한다.
    useEffect(()=>{
      if(store_CT == ''){

      } else {
        Exchange_ReConvert(money_data,store_CT,from_money,count);
      }
    },[count])
  return (

 
    // 모달창 생성
  <div>
    <Button variant="success" onClick={openModal}> 환율계산 </Button>
      <Modal style={modal_style} isOpen={modalIsOpen} onRequestClose={closeModal}>
      <header>
        <title id="contained-modal-title-vcenter">
         환율계산기
        </title>
      </header>
      <body className="grid-example">
      <Container>
        <Row>
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>From(송금)</Form.Label>
          <Form.Select onChange={(e)=>{Country_name = e.target.value; Exchange_Convert(money_data,Country_name); }}>
            <option key={0}>선택해주세요</option>
          {
            money_data.map((data,i)=>
            (
              Select_country(data,i)
            )
          )}
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>{from_unit}</Form.Label>
          <Form.Control onChange={(e)=>{setCount(e.target.value); }}/>
        </Form.Group>
        </Row>

        <Row>
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label className='mt-2'>To(수취)</Form.Label>
          <Form.Select onChange={(e)=>{Country_name1 = e.target.value;  Exchange_ReConvert(money_data,Country_name1,from_money,count); setStoreCT(e.target.value);}} >
          <option key={0}>선택해주세요</option>
          {
            money_data.map((data,i)=>
            (
              Select_country(data,i)
            )
          )}
          </Form.Select>
        </Form.Group>
 
        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label className='mt-2'>{to_unit}</Form.Label>

          <Form.Control value={to_money} onChange={(e)=>{}}/>
        </Form.Group>
        </Row>

        <Row>
           <Button className='mt-2' variant="primary" type="submit" onClick={closeModal}>Close</Button>
        </Row>
        </Container>

       </body>
      </Modal>
     </div>
  )
}

export default Modal_Calculator;