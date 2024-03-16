import './App.css';
import {useEffect , useState } from 'react';
import {Button, Navbar, Container, Table } from 'react-bootstrap';
import axios from 'axios';
import Modal_Calculator from './other/Modal_Calculator';


function App() {

//인증키
const authKey = "API KEY";
//요청 데이터 타입 
const dataType = "Data type";
//요청 날짜
let today = new Date();
//오늘 날짜데이터 
let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);

//오늘 날짜 요청 포맷 
let [formattedDate, setDate] = useState(`${year}-${month}-${day}`);
//7일 치 데이터 요청 날짜 포맷
let [formattedDate1, setDate1] = useState(`${year}-${month}-${day}`);
//요청용 데이터 
let [Uni_date, setUni] = useState(formattedDate);
;

//요청 url
let url = "요청URL";

//요청용 url 
let Exchange_url = (url + authKey + "&searchdate=" + Uni_date + "&data=" + dataType)

//메인 데이터 
let [url_data, setData] = useState([]);
//복사 데이터
let [copy_data, setCopy] = useState([]);
// 1주일 데이터 
let [week_data, setWeekData] = useState([]);


useEffect(()=>{
      axios.get(Exchange_url).then((query_info)=>{ 
      let copy = [...query_info.data]; setData(copy); setCopy(copy);
      }).catch(()=>{ console.log('데이터 못 가져옴') });
},[Uni_date]);

//7일치 데이터 요청
useEffect(()=>{
  for (let i=0; i < 7; i++){
    let formattedDate1 = (`${year}-${month}-${('0' + (today.getDate()-i)).slice(-2)}`);
    let Week_url = (url + authKey + "&searchdate=" + formattedDate1 + "&data=" + dataType);
    axios.get(Week_url).then((query_info)=>{ 
      week_data.push(...query_info.data); 
      }).catch(()=>{ console.log('데이터 못 가져옴') });
  }
},[]);
//이름 클릭시 fiilter 
let [Week_name, setWeek] = useState([]);

function Week_Serach (id,week_data){ 
  Week_name = [];
  setCopy(week_data.filter(i => i.cur_nm 
    == week_data[id].cur_nm ));
}


//최대값, 최소값 데이터 
function Max_min (url_data){

  let Mathdata = url_data.map((data)=> (data.deal_bas_r.replace(',','')))
  //최댓값 / 최소값 계산 
  let max_data = Math.max(...Mathdata);
  let min_data = Math.min(...Mathdata);

  let out_max = url_data.filter(data => (data.deal_bas_r.replace(',','')) == max_data);
  let out_min = url_data.filter(data => data.deal_bas_r.replace(',','') == min_data);
  return [out_min,out_max];
}

//일부 데이터 표기를 사전에 수정
try {
  if( (url_data[6].cur_nm).indexOf("중국") == -1 ) {
    url_data[6].cur_nm = "중국" + " " + url_data[6].cur_nm;
    url_data[7].cur_nm = url_data[7].cur_nm.replace('덴마아크', '덴마크');
    url_data[8].cur_nm = "유럽연합" + " " + url_data[8].cur_nm;
    url_data[12].cur_nm = url_data[12].cur_nm.replace('옌','엔');
    url_data[12].cur_unit = url_data[12].cur_unit.replace('(100)','');
    url_data[11].cur_unit = url_data[11].cur_unit.replace('(100)','');
    url_data[15].cur_nm = url_data[15].cur_nm.replace('말레이지아', '말레이시아');
  }

} catch (error) {
    console.log('오류');
}
// 버튼 비활성화 함수 
const [IsWeekname, setIsWeekname] = useState(true);

//제목 함수 
function Money_title (IsWeekname ,data , i){
  if (IsWeekname === true){
    return(
      <td className='Ct-name' id={i}
      onClick={(e)=>{ Week_Serach(e.target.id, week_data); setIsWeekname(false); }}>
      {data.cur_nm.slice(0, data.cur_nm.indexOf(' ')) } </td>
    )
  } else {
    return(
      <td id={i}>
      {data.cur_nm.slice(0, data.cur_nm.indexOf(' ')) } </td>
    )
  } 
}


  return (
 
    

    
    <div className="Exchange List">

    {/* 네비바 헤더 영역  */}
    <header>
      <Navbar expand="lg"   className="nav_bar  main-back">
        <Container>
          <Navbar.Brand href="/">
            <img src="./img/1.png" className="logo_text"/>{' '}
            <span className='title_name'>Exchange rate</span>
          </Navbar.Brand>
             <div className="navbar-collapse justify-content-md-end" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item title_name">
                  <a className="nav-link active" href="/"></a>
                </li>
                <li className="nav-item title_name">
                  <a className="nav-link active" href="/"></a>
                </li>
              </ul>
            </div>
        </Container>
      </Navbar>
      </header>

      {/*메인 버튼 부분*/}
      <main>
      <figure className="main-bg"></figure>

      <section className="card">
        <div className="card-header">
          <h5 className='title_name'>환율 조회</h5>
          <p className='align-middle'> ※ 통화명을 누르시면 개별로 주별 정보를 확인 가능합니다. ( { formattedDate } 기준 ) </p>
          <div className="d-flex justify-content-lg-start">
            {/* 캘린더 */}
          <input className='d-flex' type='date'max={formattedDate}
           min="2015-10-09" onChange={(e)=>{setUni(e.target.value); setIsWeekname(true)}}/>
          
           {/* 버튼 이벤트  */}
           {' '}<Button className='d-flex ms-2' variant="success" onClick={()=>{
              //Copy 배열로 복사 
              setCopy(Max_min(url_data)[1])
              setIsWeekname(false);
            }}> 높은 기준 </Button>
            <Button className='d-flex ms-1 me-1' variant="success" onClick={()=>{
              setCopy(Max_min(url_data)[0])
              setIsWeekname(false);
            }}> 낮은 기준 </Button>
            {/* 환율 계산기 모달창 구현 */}
            <Modal_Calculator className="d-flex" url_data={url_data} ></Modal_Calculator>
            <Button className='d-flex ms-1 me-1' variant="success" onClick={()=>{
              setIsWeekname(true);
              setCopy(url_data);
            }}> 돌아가기 </Button>
            </div>
          </div>
        </section>
        </main>

        {/* 하단 표 부분 */}
        <footer>
        <section className="blockquote mb-0">
        <Table className='text-center mb-3' striped bordered>
        <thead>
          <tr>
            <th>순서</th>
            <th>국가</th>
            <th>통화명</th>
            <th>받을때 금액 (송금)</th>
            <th>보낼때 금액 (송금)</th>
            <th>매매 기준율 (사고팔때)</th>
          </tr>
        </thead>
        
        <tbody>
        {
         
         copy_data[0] != null ?
          copy_data.map((data, i)=>
            <tr key={i}>
              <td><span>{ i+1 }</span></td>
              {Money_title (IsWeekname ,data , i)}
              <td>{data.cur_nm.slice(data.cur_nm.indexOf(' '))+ " " +(data.cur_unit) } </td>
              <td>{data.ttb}</td>
              <td>{data.tts}</td>
              <td>{data.deal_bas_r}</td>
            </tr>   
             ) : <p className='justify-content-xl-center'> 해당 날짜에는 환율 정보가 등록되지 않았습니다.</p>
        } 
                
        </tbody>
        </Table>
        </section>
      </footer>
</div>
  );
}

export default App;
